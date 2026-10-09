declare global {
	interface MessageParticipant {
		// The phone number of who received it
		phoneNumber: string; // @Required for: Display Name from Contacts.

		// To know if they deleted their own message from their side.
		deleted: boolean; // @Required for: To filter out this message once deleted.

		// To know who seen it
		seen: boolean;

		// To know who received it
		received: boolean;

		// To identify this player better. @Required for: Database filtering but later down the line certain callbacks when a sms is sent or received.
		type: 'player' | 'actor'; // They can be a player or an actor.
		id: number | null; // Their database ID.
	}

	interface PhoneMessage {
		id: number;
		createdAt: number;

		// Who sent this
		sender: MessageParticipant;

		// Who received this
		recipients: Array<MessageParticipant>;

		// Content of message: Text, Coords or Image link.
		content: {
			// Type of message
			type: 'text' | 'location';

			// Content itself..
			data: string | { x: number; y: number; z: number; label: string };
		};
	}

	interface MessageConverastion {
		participants: string[];
		messages: PhoneMessage[];
	}
}

export {};
