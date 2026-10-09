import React, { useState, createContext, useContext, useEffect } from 'react';

// Components
import API from './components/api';
import Container from './components/container';
import Channels from './components/channels';
import Footer from './components/inputArea';
import DevControls from './components/devControls';

// Dependencies
import { conditionalClassNames, logError, useStateRef } from '@/utils/helpers';
import { removeHtmlTags } from './utils/helpers';
import { AppContext } from '@/utils/context';

// Context
const Context = createContext({});
export const ChatContext: ExpectedAny = () => useContext(Context);

const Component = () => {
	const [messages, setMessages, messagesRef] = useStateRef([]);
	const [inputVisible, setInputVisible, inputVisibleRef] = useStateRef(false);
	const [chatVisible, setChatVisible, chatVisibleRef] = useStateRef(true);
	const [channel, setChannel, channelRef] = useStateRef('all');
	const [inputText, setInputText] = useState('');
	const [inputHistory, setInputHistory, inputHistoryRef] = useStateRef({
		entries: [],
		direction: null,
		index: 0
	});

	// HUD
	const { dialogVisible } = AppContext();

	const changeChannel = (newChannel: ChatMessage['channel']) => {
		setChannel(newChannel);

		const doc = document.getElementById(`chatbox-container`);
		if (doc) doc.scrollTop = doc.scrollHeight;
	};

	const getMessages = (channel: string, unreadOnly = false, refUsed = false) => {
		const src = refUsed ? messagesRef.current : messages;

		return src.filter((c: ExpectedAny) => {
			if (!unreadOnly && c.channel === channel) return true;
			if (unreadOnly && c.channel === channel && c.read === false) return true;
			return false;
		});
	};
	const markMessageAsRead = (uuid: string) => {
		setMessages((currentState: ExpectedAny) => {
			let newArr = [...currentState];

			// Get index..
			const arrIndex = currentState.findIndex((b: ExpectedAny) => uuid === b.uuid);

			if (arrIndex !== -1) {
				newArr[arrIndex].read = true;
			}

			return newArr;
		});
	};

	const submitMessage = async () => {
		try {
			// Getting the inputted text..
			let text = inputText;

			// Remove any dangerous code..
			text = text.replaceAll(/{([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})}/g, ``); // Remove colors {000}
			text = removeHtmlTags(text); // Remove html tags
			text = text.replaceAll(`{BR}`, ``); // Remove hidden BR

			// If there is no text, close the chat.
			if (text.trim().length < 1) {
				window.rpc.triggerClient('chatbox:close');
			}

			// Invoke server event
			mp.invoke(text[0] === '/' ? 'command' : 'chatMessage', text);

			// Save history..
			setInputHistory((currentState: ExpectedAny) => ({
				...currentState,
				entries: [...currentState.entries, inputText],
				index: 0,
				direction: null
			}));

			// Reset input text..
			setInputText('');

			// Hide input on message send
			window.rpc.triggerClient('chatbox:close');
		} catch (err) {
			await logError(`chatbox.submitMessage`, err);
		}
	};

	const PassedProps = {
		// Messages
		messages,
		setMessages,
		messagesRef,
		// Input visible or not
		inputVisible,
		inputVisibleRef,
		setInputVisible,
		// Channels
		channel,
		channelRef,
		setChannel,
		// Chat visible ??
		chatVisible,
		chatVisibleRef,
		setChatVisible,
		// Functions
		changeChannel,
		getMessages,
		// On input change
		inputText,
		setInputText,
		// History
		inputHistory,
		inputHistoryRef,
		setInputHistory,
		// Others
		submitMessage,
		markMessageAsRead
	};

	const shouldChatBeHidden = () => {
		if (dialogVisible) return true;

		return false;
	};

	const classNameOptionals = [
		{
			class: `chat-visible`,
			if: chatVisible && !shouldChatBeHidden()
		},
		{
			class: `input-visible`,
			if: inputVisible
		}
	];

	return (
		<React.Fragment>
			<Context.Provider value={PassedProps}>
				<div className={conditionalClassNames(`chatbox`, classNameOptionals)}>
					<Container />
					<div className={conditionalClassNames(`footer`, classNameOptionals)}>
						<Footer />
						<Channels />
					</div>
				</div>
				<DevControls />
				<API />
			</Context.Provider>
		</React.Fragment>
	);
};

export default Component;
