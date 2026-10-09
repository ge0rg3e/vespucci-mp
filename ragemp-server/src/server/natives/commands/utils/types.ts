import { AccountLanguage } from '@modules/database/game/accounts/model/types';
import { LanguagePack } from '@vmp/i18n';
import { argumentTypes } from '../components/args';

export type commandCallback = (player: PlayerMp, args: CommandArgs, mainLanguage: CommandMainLanguage) => void;
export type CommandMainLanguage = (lang: AccountLanguage, msg: string, params?: Record<string, ExpectedAny>) => string;
export type CommandArgs = {
	// 👇️ key         value
	[key: string]: ExpectedAny;
	target: PlayerMp; // 👈️ We know that target will always mean a playerMp.
	argsChatChannel: ChatChannels;
};

export type argConditionalCallback = (input: Array<ExpectedAny>, args: Record<string, argumentTypes>, player: PlayerMp) => void;

export type createCommandObject = {
	name: string;
	aliases?: string | string[];
	args?: Record<string, argumentTypes>;
	handler: commandCallback;
	flags?: string | string[];
	permission?: string;
	permissions?: string[];
	loadLangs?: string | string[];
	defineLangs?: LanguagePack;
	langs?: string[];
	argsRequired?: Record<string, argConditionalCallback>;
	argsChatChannel?: ChatChannels;
};

export type commandObject = {
	name: string;
	aliases: string[];
	args: Record<string, argumentTypes>;
	handler: commandCallback;
	flags: string[];
	langs: ExpectedAny;
	flagArgument?: ExpectedAny;
	permissions?: string[];
	argsRequired?: Record<string, argConditionalCallback>;
	argsChatChannel: ChatChannels;
};

export type flagObject = {
	name: string;
	handler: (player: PlayerMp, lang: ExpectedAny, command: commandObject) => ExpectedAny;
};

export type argumentObject = {
	name: string;
	handler: (entry: { value: ExpectedAny; inputsEntered: ExpectedAny[]; argument: string; lang: ExpectedAny; player: PlayerMp }) => ExpectedAny;
};

export type langCommandCallback = (messageId: string, args?: object | undefined) => string;
