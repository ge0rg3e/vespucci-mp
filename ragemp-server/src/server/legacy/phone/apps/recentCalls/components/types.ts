declare global {
	type RecentCall = {
		phoneNumber: string; // The number of the other person.
		// Timestamps and Identifers
		date: Date;
		uuid: string; // Random UUID Generated.
		// Information
		isCaller: boolean; // To know if we called him or not
		callMissed: boolean; // To know if this call was missed or not.
	};

	interface PlayerMeta {
		recentCalls: Array<RecentCall>;
	}
}
export {};
