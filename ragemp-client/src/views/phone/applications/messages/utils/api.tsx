import { useEffect } from 'react';

// Context
import { AppState } from '..';
import { groupMessagesIntoConversations, scrollToLastMessages } from './functions';
import { isPhoneDevelopment } from '@/views/phone/utils/helpers';
import { Responses } from './response';

// Variables
let timerLoading: ExpectedAny = null;

const Component = () => {
	const { setLoadingFinished, subRoute, setData, setMessages } = AppState();
	const { setConversations, setContacts } = AppState();

	const onMessagesReceived = (arr: Array<PhoneMessage>) => {
		// Set the data without affecting the others..
		setMessages((currentState: ExpectedAny) => {
			const newState = [...currentState, ...arr];

			// Set the converastions data.
			setConversations(groupMessagesIntoConversations(newState));

			return newState;
		});

		scrollToLastMessages();

		// If the timer is still active we clear the timeout.
		if (timerLoading !== null) {
			// Clear
			clearTimeout(timerLoading);

			// Reset timer id..
			timerLoading = null;
		}

		// Set the timer..
		timerLoading = setTimeout(() => {
			// Variables..
			setLoadingFinished(true);

			// Reset timer id
			timerLoading = null;
		}, 100);
	};

	const onContactsReceived = (arr: Array<PhoneContact>) => {
		// Set the data without affecting the others..
		setContacts((currentState: ExpectedAny) => {
			const newState = [...currentState, ...arr];

			return newState;
		});
	};

	const onDataReceived = (args: ExpectedAny) => {
		const newData = JSON.parse(args);

		setData((currentState: ExpectedAny) => ({ ...currentState, ...newData }));
	};

	/**
	 *
	 * This event will be called by the server-side when someone else read one of our messages.
	 */

	const markMessageAsSeen = (payload: ExpectedAny) => {
		setMessages((currentState: ExpectedAny) => {
			const arr = [...currentState];

			// Find index..
			const index = arr.findIndex((c) => c.id == payload.id);
			if (index === -1) return arr;

			// Find participant
			const recipientIndex = arr[index].recipients.findIndex(
				(c: ExpectedAny) =>
					c.type === payload.recipient.type && c.id === payload.recipient.id
			);
			if (recipientIndex == -1) return arr;

			// Update
			arr[index].recipients[recipientIndex].seen = true;

			// Update converastions
			setConversations(groupMessagesIntoConversations(arr));

			return arr;
		});
	};

	useEffect(() => {
		const doc = document.getElementsByClassName('device-content phone-app-route-messages');

		if (subRoute === 'conversation') {
			// By default, jump to the last message
			const messagesContainer = document.getElementById('messages-container');
			if (!messagesContainer) return;
			messagesContainer.scrollTop = messagesContainer.scrollHeight;

			doc[0].classList.add('view-conversation');
			doc[0].classList.remove('view-list');
		} else if (subRoute === 'list') {
			doc[0].classList.add('view-list');
			doc[0].classList.remove('view-conversation');
		}
	}, [subRoute]);

	useEffect(() => {
		// Sockets
		window.socket.on(`messages.loadMessages`, onMessagesReceived);
		window.socket.on(`messages.loadContacts`, onContactsReceived);
		window.socket.on(`messages.updateSeenStatus`, markMessageAsSeen);

		// Load local data..
		window.rpc.on(`messages.loadData`, onDataReceived);

		// Request data once.
		window.rpc.triggerServer(`messages.loadDependencies`);

		// If we're simulating.
		if (isPhoneDevelopment()) {
			// Fake messages..
			onMessagesReceived(Responses.messages);

			// Fake data..
			onDataReceived(JSON.stringify(Responses.data));

			// Fake contacts..
			onContactsReceived(Responses.contacts);
		}

		return () => {
			// Sockets
			window.socket.off(`messages.loadMessages`);
			window.socket.off(`messages.loadContacts`);
			window.socket.off(`messages.updateSeenStatus`);

			// RPC
			window.rpc.off(`messages.loadData`, onDataReceived);

			// Clear timeout..
			if (timerLoading !== null) {
				// Clear timeout
				clearTimeout(timerLoading);

				// Reset timer id
				timerLoading = null;
			}
		};
	}, []);

	return null;
};

export default Component;
