import * as rpc from 'rage-rpc';
import { v4 as uuidv4 } from 'uuid';

// Types
import { ChatReaction, SendChatMessage, SendClientMessage } from './extensions.types';
import { sendChatMessageWithColor } from './extensions.utils';

mp.Player.prototype.sendChatMessage = function (params) {
	// Allocate uuid
	const allocateId = uuidv4();

	rpc.triggerBrowsers(this, 'chatbox:onMessageReceived', JSON.stringify({ ...params, uuid: allocateId }));

	return allocateId;
};

mp.Player.prototype.clearChat = function () {
	rpc.triggerBrowsers(this, 'chatbox:clear');
};

mp.Player.prototype.sendClientMessage = function (sender, channel, message, type) {
	return sendChatMessageWithColor(this, sender, channel, `${message}`, type);
};

mp.Player.prototype.sendErrorMessage = function (sender, channel, message, type) {
	return sendChatMessageWithColor(this, sender, channel, `{d9d9d9}${message}`, type);
};

mp.Player.prototype.sendAdminMessage = function (sender, channel, message, type) {
	return sendChatMessageWithColor(this, sender, channel, `{FF6347}${message}`, type);
};

mp.Player.prototype.sendServerMessage = function (sender, channel, message, type) {
	return sendChatMessageWithColor(this, sender, channel, `{F1C410}${message}`, type);
};

mp.Player.prototype.sendStaffMessage = function (message) {
	return this.sendAdminMessage('AdmBot', 'staff', `${message}`, 'staffAlerts');
};

mp.Player.prototype.updateChatMessageReaction = function (messageId, reactionId, payload) {
	this.triggerBrowserEvent(`chatbox:updateChatMessageReaction`, { messageId, reactionId, payload });
};

mp.Player.prototype.deleteChatMessageReaction = function (messageId, reactionId) {
	this.triggerBrowserEvent(`chatbox:deleteChatMessageReaction`, { messageId, reactionId });
};

declare global {
	interface PlayerMp {
		// Natives
		clearChat(): void;
		sendChatMessage(params: SendChatMessage): string | null;

		// Shortcuts
		sendClientMessage: SendClientMessage;
		sendAdminMessage: SendClientMessage;
		sendServerMessage: SendClientMessage;
		sendErrorMessage: SendClientMessage;

		// Staff Message - Atunci cand vrem ca sa fie un mesaj cu type "Staff Alerts"
		sendStaffMessage(message: string): void;

		// Chat reactions
		updateChatMessageReaction(messageId: string, reactionId: string, payload: Partial<ChatReaction>): void;
		deleteChatMessageReaction(messageId: string, reactionId: string): void;
	}
}

export {};
