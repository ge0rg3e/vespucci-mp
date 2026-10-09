import { AccountAttributes, AccountLanguage } from '@modules/database/game/accounts/model/types';

declare global {
	interface PlayerVariables {
		loggedIn: boolean;
		username: string;
		playerId: number;
		accountId: number;
		level: number;
		groups: string;
		language: AccountLanguage;
	}

	interface PlayerMeta {
		serverVersion: string;
		rememberMeCredentials: Array<string> | null;
		cef_domain: string | undefined;
		lastOnline: Date | undefined;
	}

	interface PlayerMp {
		info: AccountAttributes;
		vars: PlayerVariables;
		meta: PlayerMeta;
		lang: AccountLanguage;
	}
}

declare module 'rage-rpc' {
	// eslint-disable-next-line
	interface ProcedureInfo extends ProcedureListenerInfo<PlayerMp> {}
}
