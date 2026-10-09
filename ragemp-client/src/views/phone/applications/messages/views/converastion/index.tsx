import React, { createContext, useContext, useState } from 'react';
import moment from 'moment';

// Language
import * as i18n from '@vmp/i18n';
import LanguagePack from './language';
i18n.createLanguagePack(`PHONE_APP_MESSAGES_CONVERSATION`, LanguagePack);

// Context
import { AppState } from '../..';

// Components
import Header from './components/header';
import Message from './components/message';
import Footer from './components/footer';
import ContactCard from './components/contactCard';

//  Dependencies
import { getLastSentMessageIndex, groupMessagesByDates } from './utils/functions';

// View Context
const Context = createContext({});
export const ViewState: ExpectedAny = () => useContext(Context);

const Component = () => {
	const { data, conversations, selectedParticipants, sendMessage } = AppState();
	const [showContactCard, setShowContactCard] = useState(false);

	const getMessages = () => {
		// Clone the converastions because otherwise the SET below will overwrite original variable.
		const clonedConverastions = [...JSON.parse(JSON.stringify(conversations))];

		// Check if there is a matching conversation already existing. (aka we have messages between them)
		const matchConverastion = clonedConverastions.find(
			(c: MessageConverastion) => JSON.stringify(c.participants) === JSON.stringify(selectedParticipants)
		);

		// Set the _lastSeenMessage: true to the last message where I'm recipient.
		if (matchConverastion) {
			// Get the last message sent index..
			const lastMsgIndex = getLastSentMessageIndex(matchConverastion.messages, data.phoneNumber);

			if (lastMsgIndex !== -1) {
				const hasSeen = matchConverastion.messages[lastMsgIndex].recipients.find((c: ExpectedAny) => c.seen === true);

				if (hasSeen) {
					matchConverastion.messages[lastMsgIndex]._lastSeenMessage = true;
				}
			}
		}

		// If there is a matching converastion
		if (matchConverastion) return groupMessagesByDates(matchConverastion.messages);

		// If not we return empty array.
		return [];
	};

	const formatTimestamp = (date: Date) => {
		const today = new Date();
		const yesterday = new Date(today);
		yesterday.setDate(today.getDate() - 1);

		const momentDate = moment(date);

		if (momentDate.isSame(today, 'day')) {
			return 'Today';
		} else if (momentDate.isSame(yesterday, 'day')) {
			return 'Yesterday';
		} else {
			return momentDate.format('ddd DD MMM [at] HH:mm');
		}
	};

	const sendMessageToParticipants = (inputText: string) => {
		// Get the other participants other than us
		const otherParticipants = selectedParticipants.filter((c: ExpectedAny) => c !== data.phoneNumber);

		// Send message
		sendMessage(otherParticipants, {
			type: 'text',
			data: inputText
		});
	};

	const ContextProps = {
		messages: getMessages(),
		setShowContactCard
	};

	return (
		<Context.Provider value={ContextProps}>
			<Header setShowContactCard={setShowContactCard} />
			<div className="messages">
				<div className="--container" tabIndex={-1} id="messages-container">
					{getMessages().map((group: ExpectedAny, ix: number) => (
						<React.Fragment key={ix}>
							<div className="component-chat-timestamp">{formatTimestamp(group.date)}</div>
							{group.messages.map((entry: ExpectedAny, ixx: number) => (
								<Message
									isSender={entry.sender.phoneNumber === data.phoneNumber}
									seen={entry._lastSeenMessage ? true : false}
									data={entry}
									key={ixx}
								/>
							))}
						</React.Fragment>
					))}
				</div>
			</div>
			<Footer onSendMessage={sendMessageToParticipants} />
			{showContactCard && <ContactCard />}
		</Context.Provider>
	);
};

export default Component;
