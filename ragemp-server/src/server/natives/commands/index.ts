import * as i18n from '@vmp/i18n';
import { logError } from '@server/utils/helpers';

import './utils/registry';
import './components/langs';
import './components/args';
import './components/flags';
import { AccountLanguage } from '@modules/database/game/accounts/model/types';

mp.events.add('playerCommand', async (player, command) => {
	if (!player || !mp.players.exists(player)) return;
	try {
		const lang = i18n.getLanguagePack('CommandRegistry', player.info.language);
		let commandLangPack: LanguageCallback | null = null;

		const input: string[] = command.trim().slice(1).trim().split(' ');
		const commandName: string = input.shift()!.toLowerCase();
		const cmd = mp.commands.getCommand(commandName);

		if (!cmd) return player.sendErrorMessage('Server', 'system', lang.get('CMD_NOT_FOUND', { cmd: commandName }), 'system');

		if (!mp.commands.resolveFlags(player, cmd.flags, cmd)) return false;
		if (!mp.commands.checkPermissions(player, cmd)) return false;

		// Trying to check if there's a language.

		try {
			commandLangPack = i18n.getLanguagePack(`cmdLangs:${cmd.name}`, player.info.language);
		} catch (err) {
			commandLangPack = null;
		}

		const getCommandLangs = function (lang: AccountLanguage, msg: string, params: Record<string, ExpectedAny>) {
			// Getting the language now based on the receiver's language.
			commandLangPack = i18n.getLanguagePack(`cmdLangs:${cmd.name}`, lang);
			return commandLangPack?.get(msg, params);
		};

		const requiredArgs = mp.commands.defineargsRequired(cmd.args, input, cmd.argsRequired, player);

		const defaultSyntaxMessage = lang.get('CMD_SYNTAX_HINT', { cmd: commandName, args: requiredArgs });

		if (Object.keys(requiredArgs!).length > 0 && input.length < Object.keys(requiredArgs!).length) {
			player.sendClientMessage('Server', cmd.argsChatChannel, defaultSyntaxMessage, 'system');
			if (commandLangPack !== null) {
				const syntaxExampleMessage = commandLangPack.get(`SyntaxExampleMessage`, { player });
				let conditionPasses = true;
				if (cmd.argsRequired && cmd.argsRequired['SyntaxExampleMessage']) {
					conditionPasses = cmd.argsRequired[`SyntaxExampleMessage`](input, requiredArgs, player)!;
				}
				if (syntaxExampleMessage !== 'SyntaxExampleMessage' && conditionPasses === true) {
					player.sendClientMessage('Server', cmd.argsChatChannel, syntaxExampleMessage, 'system');
				}
			}
			return false;
		}

		// This is kinda not a great thing but we have to do it like this
		// Cause otherwise the 'forced' definition that "target" in commands is always player it won't work.

		let handlerArguments: ExpectedAny = {
			syntaxMessage: defaultSyntaxMessage
		};

		try {
			const resolvedArgs = mp.commands.resolveArguments(player, requiredArgs, input);
			handlerArguments = { ...handlerArguments, ...resolvedArgs, argsChatChannel: cmd.argsChatChannel };
		} catch (err: ExpectedAny) {
			return player.sendErrorMessage('Server', cmd.argsChatChannel, `ERROR: ${err.message}`, 'system');
		}

		try {
			const passedLanguage: ExpectedAny = commandLangPack ? getCommandLangs : null;
			cmd.handler(player, handlerArguments, passedLanguage);
		} catch (err) {
			player.sendErrorMessage('Server', cmd.argsChatChannel, `Command processing error. Please try again or contact our staff.`, 'system');
			await logError(`COMMAND_ERROR`, err);
		}
	} catch (err) {
		player.sendErrorMessage('Server', 'system', `Internal command processor error. Please contact our administrators.`, 'system');
		await logError(`COMMAND_PROCESSOR_ERROR`, err);
	}
});
