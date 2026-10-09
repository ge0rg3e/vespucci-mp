declare global {
	type ChatMessage = {
		// A client-side uuid generated when it's received.
		uuid: string;

		//  Where this message is rendered in..
		channel: 'general' | 'system' | 'staff';

		// When it was sent..
		date: Date;

		// Who sent it..
		sender: string;

		// Type badge
		type: {
			text: string;
			icon: string;
			color: string;
		};

		// Has this been read (client-side)
		read: boolean;

		// Meta about content
		content: {
			// The type of this message
			type: 'text';

			// Data..
			data: string;

			// Reaction buttons
			reactions?: Array<ChatReaction>;
			
		};
	};

	type ChatReaction = {
		id: string;
		label: string;
		payload: Record<string, ExpectedAny>;

		// This can be later sent from the server.
		disabled?: boolean;
	};
}

export type ChatData = {
	messages: Array<ChatMessage>;
};
export {};
