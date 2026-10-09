import { createLanguagePack, LanguagePack } from '@vmp/i18n';

const formatArguments = (args: Record<string, ExpectedAny>) => {
	const arr = Object.keys(args);
	return arr.map((arg: string) => {
		const text: string = arg.replace('_', ' '); // player_id => player id
		return text;
	});
};

const translationCommandsPack: LanguagePack = {
	CMD_NOT_FOUND: {
		EN: ({ cmd }) => `Command "/${cmd}" doesn't exist. Use /help for more information.`,
		RO: ({ cmd }) => `Comanda "/${cmd}" nu există. Folosește /help pentru mai multe informații.`
	},
	CMD_SYNTAX_HINT: {
		EN: ({ cmd, args }) => `SYNTAX: /${cmd} [${formatArguments(args).join('] [')}]`
	},
	PARSER_TYPE_STRING_ERR: {
		EN: ({ arg, val }) => `Parameter {FF6347}"${val}"{ffffff} for ${arg} is not a valid string.`,
		RO: ({ arg, val }) => `Parametrul {FF6347}"${val}"{ffffff} pentru ${arg} nu este un string valid.`
	},
	PARSER_TYPE_STRING_ERR_EMOJI: {
		EN: ({ arg, val }) => `Parameter {FF6347}"${val}"{ffffff} for ${arg} can't contain an emoji.`,
		RO: ({ arg, val }) => `Parametrul {FF6347}"${val}"{ffffff} pentru ${arg} nu poate contine un emoji.`
	},
	PARSER_TYPE_NUMBER_ERR: {
		EN: ({ arg, val }) => `Parameter {FF6347}"${val}"{ffffff} for ${arg} is not a valid number.`,
		RO: ({ arg, val }) => `Parametrul {FF6347}"${val}"{ffffff} pentru ${arg} nu este un număr valid.`
	},
	PARSER_TYPE_FLOAT_ERR: {
		EN: ({ arg, val }) => `Parameter {FF6347}"${val}"{ffffff} for ${arg} is not a valid float number.`,
		RO: ({ arg, val }) => `Parametrul {FF6347}"${val}"{ffffff} pentru ${arg} nu este un float number.`
	},
	PARSER_TYPE_PLAYER_ERR: {
		EN: ({ arg, val }) => `Parameter {FF6347}"${val}"{ffffff} for ${arg} is not a valid player name or id.`,
		RO: ({ arg, val }) => `Parametrul {FF6347}"${val}"{ffffff} pentru ${arg} nu este un nume sau id de jucător online.`
	},
	FLAG_PERMISSION_ERR: {
		EN: `You don't have the permissions required to use the command.`,
		RO: `Nu ai permisiunile necesare să folosești comanda.`
	}
};

createLanguagePack('CommandRegistry', translationCommandsPack);
