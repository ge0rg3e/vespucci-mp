export type SendChatMessage = {
	channel: ChatChannels;
	sender: string;
	type: {
		text: string;
		icon: string /** Font Awesome Icon */;
		color: string /** CSS COLOR */;
	};
	content: {
		type: 'text';
		data: string;
		reactions?: Array<ChatReaction>;
	};
};

export type ChatReaction = {
	id: string;
	label: string;
	payload: Record<string, ExpectedAny>;
	disabled?: boolean;
};

export type SendChatMessageToAll = {
	channel: SendChatMessage['channel'];
	type: (targetEntity: PlayerMp) => SendChatMessage['type'];
	sender: (targetEntity: PlayerMp) => SendChatMessage['sender'];
	content: (targetEntity: PlayerMp) => SendChatMessage['content'];
	checkPlayer?: (targetEntity: PlayerMp) => boolean | undefined;
};

export type SendClientMessage = (sender: string, channel: SendChatMessage['channel'], message: string, type: ChatTypesIds) => string | null;

export type SendClientMessageToAll = {
	systemId: string;
	messageId: string;
	args?: (targetEntity: PlayerMp) => object;
	permission?: string /** Check if this player has this permission */;
};

export type AnnounceRoleplayParams = {
	systemId: string;
	messageId: string;
	args?: (targetEntity: PlayerMp) => object;
	position: Vector3;
	range: number;
};

export default {};
