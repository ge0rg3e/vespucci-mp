/**
 * Scrolls to the last message.
 */

export const scrollToChatboxLatestMessage = () => {
	const doc = document.getElementById(`chatbox-container`);

	if (doc) {
		doc.scrollTop = doc.scrollHeight;
	}
};

export const setCursorAtEndOfInput = () => {
	setTimeout(() => {
		// MP-515
		const input: UndefinedAny = document.getElementById('chatbox-input');
		if (!input) return false;
		const end = input.value.length;
		input.setSelectionRange(end, end);
		input.focus();
	}, 20);
};
