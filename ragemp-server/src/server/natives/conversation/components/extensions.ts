import { CurrentPlayerConversation, ShowConversationProps } from './types';

mp.Player.prototype.showConversation = function (props: ShowConversationProps): void {
	// Triggering a client event 'conversation@show' with the provided properties
	this.triggerClientEvent('conversation@show', props);

	// Updating player variables with the conversation ID from the properties
	this.updateVars({
		conversationId: props.id
	});
};

mp.Player.prototype.getActiveConversation = function () {
	if (this.vars.conversationId === null) return null;

	let response: CurrentPlayerConversation = {
		identifier: this.vars.conversationId
	};

	return response;
};

mp.Player.prototype.hideConversation = function (): void {
	// Triggering a client event 'conversation@hide'
	this.triggerClientEvent('conversation@hide');

	// Updating player variables to set the conversation ID to null
	this.updateVars({
		conversationId: null
	});
};

declare global {
	interface PlayerMp {
		/**
		 * Show a conversation interactive or monologue to the player.
		 */

		showConversation(props: ShowConversationProps): void;

		/**
		 * Get the current active conversation  of the player.
		 */

		getActiveConversation(): null | CurrentPlayerConversation;

		/**
		 * Hides the conversation interface.
		 */

		hideConversation(): void;
	}
	interface PlayerVariables {
		conversationId: string | null;
	}
}
