import { createContext, useContext, useState, useEffect } from 'react';

// Components
import mappedScreens from './utils/maps';
import API from './utils/api';

// UI Components
import ScreenLoading from '@phone/components/ui/loadingScreen';
import { getConversationParticipants, groupMessagesIntoConversations } from './utils/functions';
import { formatPhoneNumber } from '@/utils/helpers';
import { PhoneState } from '../..';
import moment from 'moment';

// App Context
const Context = createContext({});
export const AppState: ExpectedAny = () => useContext(Context);

const Component = () => {
	const [loadingFinished, setLoadingFinished] = useState(false);
	const [subRoute, setSubRoute] = useState('list');
	const [contacts, setContacts] = useState([]);
	const { route } = PhoneState();

	// conversations
	const [messages, setMessages] = useState<ExpectedAny>([]);
	const [conversations, setConversations] = useState<ExpectedAny>([]);
	const [selectedParticipants, setSelectedParticipants] = useState<string[]>([]);

	const [messageSentAt, setMessageSentAt] = useState<Date | null>(null);

	// Info about us
	const [data, setData] = useState({
		phoneNumber: `555666`
	});

	const sendMessage = (phoneNumbers: Array<string>, content: ExpectedAny) => {
		// Check if the time difference between the current moment and when the message was last sent is less than 10 seconds
		if (moment().diff(moment(messageSentAt)) < 10000) return;

		// Set the messageSentAt to the current date and time
		setMessageSentAt(new Date());

		// Trigger the server to send the message
		window.rpc.triggerServer(`messages.send`, JSON.stringify({ phoneNumbers, content }));
	};

	const markMessageAsSeen = (id: number) => {
		window.rpc.triggerServer(`messages.markAsSeen`, JSON.stringify({ id }));
	};

	const deleteConversation = (participants: ExpectedAny) => {
		// Message ids
		const messageIds: ExpectedAny = [];

		// Get the mesasge ids that must be deleted
		messages.forEach((c: ExpectedAny) => {
			// Get participants
			const thisParticipants = getConversationParticipants(c.sender, c.recipients);

			// If is a match..
			if (JSON.stringify(thisParticipants) === JSON.stringify(participants)) {
				messageIds.push(c.id);
			}
		});

		// Trigger callback on server
		window.rpc.triggerServer(`messages.deleteConversation`, JSON.stringify({ messageIds }));

		// Delete it from the front-end.
		setMessages((currentState: ExpectedAny) => {
			let newArr = [...currentState];

			newArr = newArr.filter((c) => (messageIds.includes(c.id) ? false : true));

			// Reset converastions
			setConversations(groupMessagesIntoConversations(newArr));

			return newArr;
		});
	};

	const getNumberDisplayName = (number: string) => {
		const match: ExpectedAny = contacts.find((c: PhoneContact) => c.number === number);

		if (match) return match.name;

		return formatPhoneNumber(number);
	};

	const onConverastionSelected = (arr: Array<string>) => {
		// Select to watch the converastion on this participants.
		setSelectedParticipants(arr.sort());

		// Switch view..
		setSubRoute('conversation');
	};

	// @TBD: Sa mutam asta in api.
	useEffect(() => {
		// If we are supposed to jumpt into a converastion right away..
		if (route.payload.gotoConverastion) {
			onConverastionSelected(route.payload.gotoConverastion.participants);
		}
	}, []);

	const ContextProps = {
		// Messages
		messages,
		setMessages,
		// Conversations
		conversations,
		setConversations,
		onConverastionSelected,
		// Participants selected
		selectedParticipants,
		setSelectedParticipants,
		// Route
		subRoute,
		setSubRoute,
		// Contacts
		contacts,
		setContacts,
		// Function
		deleteConversation,
		sendMessage,
		getNumberDisplayName,
		markMessageAsSeen,
		messageSentAt,
		// Data about us
		data,
		setData,
		// Loading
		loadingFinished,
		setLoadingFinished
	};

	// Get rendered component
	const RenderedComponent = mappedScreens[subRoute];

	return (
		<Context.Provider value={ContextProps}>
			<ScreenLoading loading={!loadingFinished} delayLoadingIcon={500}>
				<div className={`component-view ${subRoute}`}>
					<RenderedComponent />
				</div>
			</ScreenLoading>
			<API />
		</Context.Provider>
	);
};

export default Component;
