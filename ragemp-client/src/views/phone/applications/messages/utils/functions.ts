import { logError } from '@/utils/helpers';

/**
 * Groups an array of phone messages into conversations.
 *
 * @param messages An array of phone messages to be grouped.
 * @returns An array of conversations, where each conversation contains participants and messages.
 */

export const groupMessagesIntoConversations = (messages: Array<PhoneMessage>) => {
	try {
		// Array to hold the converastions (A conversation = a message send between two players)
		const conversations: MessageConverastion[] = [];

		// Iterate..
		for (const message of messages) {
			// Get unique array of participants to know who's active in this converastion.
			const participants = getConversationParticipants(message.sender, message.recipients);

			// Check if a group of messages between these numbers already exists.
			const existsGroup = conversations.find(
				(c) => JSON.stringify(c.participants) === JSON.stringify(participants)
			);

			// If it does exist..
			if (existsGroup) {
				// Add message to existing conversation
				existsGroup.messages.push(message);
			} else {
				// Create a new conversation
				conversations.push({ participants, messages: [message] });
			}
		}

		// Sort messages within each conversation group by createdAt (oldest first)
		conversations.forEach((conversation) => {
			conversation.messages.sort((a, b) => a.createdAt - b.createdAt);
		});

		// Sort conversations by the createdAt of the most recent message (newest conversation first)
		conversations.sort((a, b) => {
			const mostRecentA = a.messages[a.messages.length - 1].createdAt;
			const mostRecentB = b.messages[b.messages.length - 1].createdAt;
			return mostRecentB - mostRecentA;
		});

		return conversations;
	} catch (err) {
		logError(`groupMessagesIntoConversations`, err);
		return [];
	}
};

/**
 *
 * @param sender The message sender
 * @param recipients The message recipients
 * @returns The array of participating phone numbers sorted accordingly so no matter who send it is the same.
 */

export const getConversationParticipants = (
	sender: PhoneMessage['sender'],
	recipients: PhoneMessage['recipients']
) => {
	const res = [sender.phoneNumber, ...recipients.map((r) => r.phoneNumber)].sort(); // sort them to not have mistakes of different order.
	return res;
};

export const scrollToLastMessages = () => {
	const container = document.getElementById('messages-container');
	if (!container) return;

	const isScrolledToBottom =
		container.scrollHeight - container.clientHeight <= container.scrollTop + 1;

	if (isScrolledToBottom) {
		// Scrolling to the bottom
		container.scrollTop = container.scrollHeight; // Scroll to the bottom to show latest messages
	} else {
		// Scrolling up or trying to scroll to the oldest messages
		const isCloseToBottom =
			container.scrollHeight - container.scrollTop <= 2 * container.clientHeight;
		// Check if the user is close to the bottom (within double the container's visible height)

		if (isCloseToBottom) {
			container.scrollTop = container.scrollHeight;
			// If close to the bottom, scroll to the bottom to show latest messages
		}
	}
};
