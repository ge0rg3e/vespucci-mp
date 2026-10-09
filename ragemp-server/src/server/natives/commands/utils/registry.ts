import { argumentObject, commandObject, createCommandObject, flagObject } from './types';
import { createLanguagePack } from '@vmp/i18n';
import { red } from 'colorette';
import * as i18n from '@vmp/i18n';

export class CommandRegistry {
	private commands: commandObject[] = [];
	private flags: flagObject[] = [];
	private argumentTypes: ExpectedAny[] = [];

	public addCommand(commandEntry: createCommandObject) {
		const { name, handler, args, flags, loadLangs, permissions = [], permission, defineLangs, argsRequired = {}, argsChatChannel = 'system' } = commandEntry;
		const aliases = commandEntry.aliases ? this.convertStringToArr(commandEntry.aliases) : [];

		if (this.commandNameOrAliasExists(name, aliases)) {
			console.error(`${red('[ERROR]')} Command name or aliases already registered: ${[name, ...aliases].join(', ')}`);
			process.exit(1);
		}

		if (permission) {
			permissions.push(permission);
		}

		const entry = {
			name,
			aliases,
			handler,
			permissions: permissions ? permissions : [],
			args: args ? args : {},
			flags: flags ? this.convertStringToArr(flags) : [],
			langs: loadLangs ? this.convertStringToArr(loadLangs) : [],
			argsRequired,
			argsChatChannel
		};

		// If they defined a language within that command

		if (defineLangs) {
			const langName = `cmdLangs:${name}`;
			createLanguagePack(langName, defineLangs);
			entry.langs.splice(0, 0, langName);
		}

		return this.commands.push(entry);
	}

	public getCommand(text: string) {
		const commandMatch = this.commands.find((cmd: commandObject) => cmd.name === text || cmd.aliases?.includes(text));
		return commandMatch;
	}

	public defineargsRequired(args: ExpectedAny, input: ExpectedAny, conditions: ExpectedAny, player: PlayerMp) {
		const requiredArgs: ExpectedAny = {};

		Object.keys(args).forEach((arg: string) => {
			const func = conditions[arg] || undefined;
			if (func) {
				const res = func(input, args, player);
				if (res === true) {
					requiredArgs[arg] = args[arg];
				}
			} else {
				requiredArgs[arg] = args[arg];
			}
			return true;
		});

		return requiredArgs;
	}

	public addFlag(flagEntry: flagObject) {
		if (this.flags.find((a: flagObject) => a.name === flagEntry.name)) {
			console.error(`${red('[ERROR]')} Flag "${flagEntry.name}" name already taken.`);
			process.exit(1);
		}
		this.flags.push({
			name: flagEntry.name,
			handler: flagEntry.handler
		});
	}

	public resolveFlags(player: PlayerMp, flags: Array<string>, command: commandObject) {
		const lang = i18n.getLanguagePack('CommandRegistry', player.info.language);
		for (let index = 0; index < flags.length; index++) {
			const flagName = flags[index];
			const flag = this.flags.find((flag: flagObject) => flag.name === flagName || (flagName.includes(':') && flagName.split(':')[0] === flag.name));
			const flagArgument = flagName.split(':')[1];
			if (!flag) throw new Error(`There is no flag processor for ${flagName}`);
			try {
				flag.handler(player, lang, { ...command, flagArgument });
			} catch (err: ExpectedAny) {
				player.sendErrorMessage('Server', 'system', err.message, 'system');
				return false;
			}
		}
		return true;
	}

	public checkPermissions(player: PlayerMp, cmd: commandObject) {
		const lang = i18n.getLanguagePack('CommandRegistry', player.info.language);
		let granted = true;

		// Prepare array
		const permissions = cmd.permissions || [];

		permissions.forEach((p) => {
			if (granted === false) return;
			const result = player.checkPermission(p);
			if (result === false) {
				granted = false;
			}
		});
		if (granted === true) return true;
		player.sendErrorMessage('Server', cmd.argsChatChannel, lang.get('FLAG_PERMISSION_ERR'), 'system');
		return false;
	}

	public resolveArguments(player: PlayerMp, definedArgs: ExpectedAny, inputEntered: ExpectedAny) {
		if (Object.keys(definedArgs).length < 1) return {};
		const argumentsParsed: ExpectedAny = {};
		for (let index = 0; index < Object.keys(definedArgs).length; index++) {
			const argumentParser = this.argumentTypes.find((a: ExpectedAny) => a.name === Object.values(definedArgs)[index]);
			try {
				if (!argumentParser) throw new Error(`There is no parser for argument type "${Object.values(definedArgs)[index]}"`);
				const lang = i18n.getLanguagePack('CommandRegistry', player.info.language);
				const val = argumentParser.handler({
					value: inputEntered[index],
					inputsEntered: inputEntered,
					player: player,
					type: Object.values(definedArgs)[index],
					argument: Object.keys(definedArgs)[index],
					lang
				});
				argumentsParsed[Object.keys(definedArgs)[index]] = val;
			} catch (err: ExpectedAny) {
				throw err;
			}
		}
		return argumentsParsed;
	}

	public addArgumentType(entry: argumentObject) {
		if (this.argumentTypes.find((a: ExpectedAny) => a.name === entry.name)) {
			console.error(`${red('[ERROR]')} Argument type "${entry.name}" name already taken.`);
			process.exit(1);
		}
		this.argumentTypes.push(entry);
	}

	public commandNameOrAliasExists = (name: string, aliases?: string[]) => {
		const match = this.commands.find((cmd: commandObject) => {
			if (cmd.name === name || cmd.aliases?.includes(name)) return true;
			let matchAlias = false;
			aliases?.forEach((al: string) => {
				if (matchAlias === true) return;
				if (cmd.aliases?.includes(al) || cmd.name === al) {
					matchAlias = true;
				}
			});
			if (matchAlias) return true;
			return false;
		});
		return match ? true : false;
	};

	public convertStringToArr = (entry: string | string[]) => (typeof entry === 'string' ? [entry] : [...entry]);

	public getSize() {
		return this.commands.length;
	}
}

mp.commands = new CommandRegistry();

declare global {
	interface Mp {
		commands: CommandRegistry;
	}
}
