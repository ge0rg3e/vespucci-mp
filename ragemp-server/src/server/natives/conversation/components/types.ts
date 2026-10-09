export type ConversationInteractive = {
	type: 'interactive';
	options: {
		text: string;
		id: string;
	}[];
};

export type ConversationMonologue = {
	type: 'monologue';
};

export type ShowConversationProps =
	| {
			id: string;
			heading: string;
			contents: string[];
	  } & (ConversationInteractive | ConversationMonologue);

export type CurrentPlayerConversation = {
	identifier: string;
};
