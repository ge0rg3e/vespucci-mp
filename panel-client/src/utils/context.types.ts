export interface Account {
	id: number;
	username: string;
	email: string;

	// Access levels..
	groups: string;
	factionId: number;
	factionRank: number;
	donorTier: number;

	// Dates
	loggedInDate: Date;
	rememberMeUntil: Date | null;
}
