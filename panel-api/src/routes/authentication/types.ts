declare global {
	interface SessionAccount {
		id: number;
		username: string;
		email: string;
		language: languageCodes /* Account language */;
		groups: string;
		factionId: number;
		factionRank: number;
		donorTier: number;
		rememberMeUntil: Date | null;
	}

	interface ApiRequest {
		session: SessionAccount | Record<string, never>;
	}
}

export {};
