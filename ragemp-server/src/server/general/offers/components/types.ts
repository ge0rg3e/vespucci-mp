declare global {
	type Offer = {
		// Identifier
		uuid: string;

		// Others
		status: 'pending' | 'accepted' | 'denied' | 'expired';
		payload: Record<string, ExpectedAny>;

		// Timestamps
		createdAt: Date;
	};
}

export {};
