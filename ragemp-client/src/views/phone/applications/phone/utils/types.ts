declare global {
	type PhoneContact = {
		id: number;

		// Details of the contact
		name: string;
		number: string;

		// Details about the contact
		type: 'player' | 'actor';
		creatorId: number /* The id of the player adding him */;
		contactId: number /* The Id of the player or actor added */;
	};

	type RecentCall = {
		phoneNumber: string; // The number of the other person.
		// Timestamps and Identifers
		date: Date;
		uuid: string; // Random UUID Generated.
		// Information
		isCaller: boolean; // To know if we called him or not
		callMissed: boolean; // To know if this call was missed or not.
	};

	interface Phone {
		callNumber: (phoneNumber: string) => void;
	}
}

export {};
