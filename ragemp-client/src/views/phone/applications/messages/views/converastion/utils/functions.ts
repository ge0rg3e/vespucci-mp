import moment from 'moment';

export const getMessageContent = (message: PhoneMessage, params: ExpectedAny): string => {
	if (message.content.type === 'location') {
		return message.sender.phoneNumber === params.data.phoneNumber
			? { EN: 'You sent a location', RO: 'Ai trimis o locație' }[window.language]
			: { EN: 'Sent you a location', RO: 'Ți-am trimis o locație' }[window.language];
	}

	// @ts-ignore-next-line
	return message.content.data;
};

export function groupMessagesByDates(messages: Array<PhoneMessage>) {
	const groups: ExpectedAny = [];

	// Iterate over each message to sort messages into groups of days.
	for (const message of messages) {
		// Get the date
		const dayDate = moment(message.createdAt).format('DD/MM/YYYY');

		let group = groups.find((g: ExpectedAny) => g.day === dayDate);

		// If a group for the message date doesn't exist, create a new group
		if (!group) {
			group = { day: dayDate, date: null, messages: [] };
			groups.push(group);
		}

		// Add the message to the group
		group.messages.push(message);
	}

	// Set the earliest date now..
	for (const group of groups) {
		const sortedMessages = group.messages.sort((a: ExpectedAny, b: ExpectedAny) => {
			const dateA: ExpectedAny = new Date(a.createdAt);
			const dateB: ExpectedAny = new Date(b.createdAt);
			return dateA - dateB; // Sort messages based on createdAt date
		});

		group.date = sortedMessages[0].createdAt;
	}

	// Delete the day field
	for (const group of groups) {
		delete group.day;
	}

	return groups;
}

export function getLastSentMessageIndex(messages: Array<PhoneMessage>, recipientNumber: string) {
	for (let i = messages.length - 1; i >= 0; i--) {
		const message = messages[i];
		const recipient = message.sender.phoneNumber === recipientNumber;
		if (recipient) {
			return i;
		}
	}
	return -1; // If no matching message found
}
