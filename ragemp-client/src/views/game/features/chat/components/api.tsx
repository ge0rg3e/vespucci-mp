import React, { useEffect, useState } from 'react';
import DemoResponse from '../responses';

// Context
import { ChatContext } from '..';
import { logError } from '@/utils/helpers';
import { scrollToChatboxLatestMessage, setCursorAtEndOfInput } from './functions';
import { key } from '@/definitions/keys';
import { AppContext } from '@/utils/context';

// Variables
let hideChatTimer: ExpectedAny = null;
let channelChannelTimer: ExpectedAny = null;

const Component = () => {
	const { channel, setMessages, setInputVisible, setInputText } = ChatContext();
	const { inputVisibleRef, messages, inputHistoryRef, setInputHistory } = ChatContext();
	const { inputVisible, chatVisible, chatVisibleRef, setChatVisible, changeChannel } = ChatContext();

	const [scrollingUp, setScrollingUp] = useState(false);
	const { dialogVisible, setChatVisible: setHudChatIsVisible } = AppContext();

	const onMessageReceived = async (args: string) => {
		try {
			const { uuid, channel: messageChannel, type, sender, content } = JSON.parse(args);

			// Add the new messages..
			setMessages((currentState: ExpectedAny) => {
				// Getting current arr
				let currentArr = [...currentState];

				// Adding new one
				currentArr.push({
					uuid,
					date: new Date(),
					channel: messageChannel,
					type,
					sender,
					content,
					// Default Meta....
					read: false
				});

				// Delete oldest ones if max is reached
				if (currentArr.length > 200) {
					currentArr.splice(0, 1);
				}

				return currentArr;
			});

			// Check if is current channel..
			const isCurrentChannel = channel === 'all' || channel == messageChannel ? true : false;

			if (isCurrentChannel) {
				// Stop the current one if existing
				stopChatAutoHide();

				// Show chat!
				setChatVisible(true);

				// If input is not on then we just start another chat auto hide timer in 10 seconds..
				if (inputVisible === false) {
					startChatAutoHide();
				}
			}
		} catch (err) {
			await logError(`chatbox.onMessageReceived`, err);
		}
	};

	const startChatAutoHide = () => {
		hideChatTimer = setTimeout(() => {
			if (inputVisibleRef.current === true) return false; // Safety check.

			// Variables
			setChatVisible(false);

			// Reset timer id
			hideChatTimer = null;

			// change channel to all after 30 seconds of inactivity..
			channelChannelTimer = setTimeout(() => {
				// Change
				changeChannel('all');

				// Reset
				channelChannelTimer = null;
			}, 20000);
		}, 10000);
	};

	const stopChatAutoHide = () => {
		if (hideChatTimer !== null) {
			// Clear timeout
			clearTimeout(hideChatTimer);

			// Reset variable
			hideChatTimer = null;
		}

		if (channelChannelTimer !== null) {
			// Clear timeout
			clearTimeout(channelChannelTimer);

			// Reset variable
			channelChannelTimer = null;
		}
	};

	const onScrollUp = (ev: ExpectedAny) => {
		// If input is not visible.
		if (inputVisibleRef.current === false) {
			ev.preventDefault(); // Preventing a bugfix.
			return false;
		}

		// Get container
		const doc = document.getElementById(`chatbox-container`);
		if (!doc) return false;

		const scrollTop = doc.scrollTop;
		const scrollHeight = doc.scrollHeight;
		const clientHeight = doc.clientHeight;

		// Calculate the distance from the bottom
		const distanceFromBottom = scrollHeight - (scrollTop + clientHeight);

		setScrollingUp(distanceFromBottom > 10 ? true : false);
	};

	const onInputStateChange = (args: string) => {
		const { boolean } = JSON.parse(args);

		// Change state
		setInputVisible(boolean);

		// If chat was hidden..
		if (chatVisibleRef.current === false) {
			setChatVisible(true);
		}

		// // Scroll too
		scrollToChatboxLatestMessage();

		// If this is true let's focus onto the input.
		if (boolean) {
			// Clear it when they open it
			setInputText('');

			// Focus onto input
			const div = document.getElementById(`chatbox-input`);

			// Focus..
			if (div) {
				div.focus();
			}
		}

		// If is closed let's focus out of it.
		if (!boolean) {
			// Focus outside inptu..
			const tmp = document.createElement('input');
			document.body.appendChild(tmp);
			tmp.focus();
			document.body.removeChild(tmp);
		}
	};

	const onClearChat = () => setMessages([]);

	const autoScrollOnMessageChanges = () => {
		// Safety checks
		if (messages.length < 1) return false;

		// Getting last messages.
		const lastMessage = messages[messages.length - 1];

		// Calculate scroll percentage
		const doc = document.getElementById(`chatbox-container`);
		if (!doc) return false;

		// Is scrolling up..
		if (scrollingUp) return false;

		// If current channel is that one
		if (lastMessage.channel === channel || channel === 'all') {
			scrollToChatboxLatestMessage();
		}
	};

	const onHistoryKeyPressed = (e: ExpectedAny) => {
		// Input is not visible
		if (inputVisibleRef.current === false) return false;

		// Variables
		let index = inputHistoryRef.current.index;
		const msg: Array<string> = inputHistoryRef.current.entries;
		const lastDir = inputHistoryRef.current.direction;

		if (key(e, 'ArrowUp')) {
			if (lastDir === 'up' && index !== 0 && msg[index - 1]) {
				index = index - 1;
			}

			if (index === 0 && msg.length > 0 && !msg[index - 1]) {
				setInputText(msg[msg.length - 1]);
				setInputHistory((currentState: ExpectedAny) => ({
					...currentState,
					index: msg.length - 1,
					direction: 'down'
				}));
				setCursorAtEndOfInput();
				return false;
			}

			if (!msg[index - 1]) return false;

			setInputText(msg[index - 1]);
			setInputHistory((currentState: ExpectedAny) => ({
				...currentState,
				index: index - 1,
				direction: 'down'
			}));

			setCursorAtEndOfInput();
		} else if (key(e, 'ArrowDown')) {
			if (lastDir === 'down' && index !== 0 && msg[index + 1]) {
				index = index + 1;
			}

			if (!msg[index]) return false;

			setInputText(msg[index]);

			if (index + 1 !== msg.length) {
				setInputHistory((currentState: ExpectedAny) => ({
					...currentState,
					index: index + 1,
					direction: 'up'
				}));
			} else {
				setInputHistory((currentState: ExpectedAny) => ({
					...currentState,
					index: 0,
					direction: 'up'
				}));
			}
			setCursorAtEndOfInput();
		}
	};

	const textKeyCombos = (e: ExpectedAny) => {
		const inputFocused = document.activeElement;

		if (key(e, 'Space') && !(inputFocused && ['input', 'textarea'].includes(inputFocused.localName))) {
			// MP-1489 - Preventing spaces to jump the scrollbar.
			e.preventDefault();
			return false;
		}

		if (inputVisibleRef.current === false) return false;

		// MP-583
		if (key(e, 'PageUp') || key(e, 'PageDown')) {
			e.preventDefault();
		}
	};

	useEffect(() => {
		// Reminder if this is ever removed: On client-side (rage) we also prevent chat from being triggered if dialog is active.
		if (dialogVisible && inputVisible === true) {
			// Hide..
			setInputVisible(false);

			// Hide input on message send
			window.rpc.triggerClient('chatbox:close');
		}
	}, [dialogVisible]);

	useEffect(() => {
		setHudChatIsVisible(chatVisible);
	}, [chatVisible]);

	useEffect(() => {
		autoScrollOnMessageChanges();
	}, [messages]);

	useEffect(() => {
		// If we just closed the input
		if (inputVisible === false) {
			startChatAutoHide();
		}

		// If we just enabled
		if (inputVisible === true) {
			stopChatAutoHide();
		}
	}, [inputVisible]);

	const updateChatMessageReaction = async (args: ExpectedAny) => {
		try {
			const { messageId, reactionId, payload } = JSON.parse(args);

			// Add the new messages..
			setMessages((currentState: ExpectedAny) => {
				// Getting current arr
				let currentArr = [...currentState];

				// Find index of message
				const messageIndex = currentArr.findIndex((c) => c.uuid === messageId);

				// Failed to find message index.
				if (messageIndex === -1) return currentArr;

				// Wrong message this one doesn't have reactions.
				if (currentArr[messageIndex].content.reactions === undefined) return currentArr;

				// Find the index of the reaction id.
				const reactionIndex = currentArr[messageIndex].content.reactions.findIndex(
					(r: ExpectedAny) => r.id === reactionId
				);

				if (reactionIndex === -1) return currentArr;

				// Update data
				currentArr[messageIndex].content.reactions[reactionIndex] = {
					...currentArr[messageIndex].content.reactions[reactionIndex],
					...payload
				};

				return currentArr;
			});
		} catch (err) {
			await logError(`chatbox.updateChatMessageReaction`, err);
		}
	};

	const deleteChatMessageReaction = async (args: ExpectedAny) => {
		try {
			const { messageId, reactionId } = JSON.parse(args);

			// Add the new messages..
			setMessages((currentState: ExpectedAny) => {
				// Getting current arr
				let currentArr = [...currentState];

				// Find index of message
				const messageIndex = currentArr.findIndex((c) => c.uuid === messageId);

				// Failed to find message index.
				if (messageIndex === -1) return currentArr;

				// Wrong message this one doesn't have reactions.
				if (currentArr[messageIndex].content.reactions === undefined) return currentArr;

				// Find the index of the reaction id.
				const reactionIndex = currentArr[messageIndex].content.reactions.findIndex(
					(r: ExpectedAny) => r.id === reactionId
				);

				if (reactionIndex === -1) return currentArr;

				// Delete
				currentArr[messageIndex].content.reactions.splice(reactionIndex, 1);

				return currentArr;
			});
		} catch (err) {
			await logError(`chatbox.deleteChatMessageReaction`, err);
		}
	};

	useEffect(() => {
		window.rpc.on(`chatbox:onMessageReceived`, onMessageReceived);
		window.rpc.on(`chatbox:showInput`, onInputStateChange);
		window.rpc.on(`chatbox:clear`, onClearChat);
		window.rpc.on(`chatbox:updateChatMessageReaction`, updateChatMessageReaction);
		window.rpc.on(`chatbox:deleteChatMessageReaction`, deleteChatMessageReaction);

		// Document
		document.addEventListener(`keydown`, onHistoryKeyPressed);
		document.addEventListener(`keydown`, textKeyCombos);

		// Get container
		const doc = document.getElementById(`chatbox-container`);

		// JS
		if (doc) {
			doc.addEventListener('scroll', onScrollUp);
		}

		// When demo..
		if (window.mp.fake) {
			// Set the messages..
			setMessages(DemoResponse.messages);
		}

		return () => {
			// RPC
			window.rpc.off(`chatbox:onMessageReceived`, onMessageReceived);
			window.rpc.off(`chatbox:showInput`, onInputStateChange);
			window.rpc.off(`chatbox:clear`, onClearChat);
			window.rpc.off(`chatbox:updateChatMessageReaction`, updateChatMessageReaction);
			window.rpc.off(`chatbox:deleteChatMessageReaction`, deleteChatMessageReaction);

			// Get container
			const doc = document.getElementById(`chatbox-container`);

			// JS
			if (doc) {
				doc.removeEventListener('scroll', onScrollUp);
			}

			document.removeEventListener(`keydown`, onHistoryKeyPressed);
			document.removeEventListener(`keydown`, textKeyCombos);
		};
	}, []);
	return null;
};

export default Component;
