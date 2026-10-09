import { getLanguagePack } from '@vmp/i18n';
import React, { useEffect } from 'react';

// Dependencies
import { getMessageContent } from '../utils/functions';

// Context
import { AppState } from '../../..';

const Component = (props: Props) => {
	const { data, selectedParticipants, getNumberDisplayName, markMessageAsSeen } = AppState();
	const lang = getLanguagePack('PHONE_APP_MESSAGES_CONVERSATION', window.language);

	// If this message is sent by someone else in a converastion (more than 2 participants)
	const isConversationMessage =
		selectedParticipants.length > 2 && props.isSender === false ? true : false;

	const notDelivered =
		props.isSender === true &&
		props.data.recipients.filter((c) => c.received === true).length < 1
			? true
			: false;

	const checkMessageIsSeen = () => {
		if (props.isSender === true) return false;

		// Get our recipient
		const recipient = props.data.recipients.find((c) => c.phoneNumber === data.phoneNumber);
		if (!recipient) return false; // We don't exist??

		// Already seen
		if (recipient.seen === true) return false;

		// Mark it as seen.
		markMessageAsSeen(props.data.id);
	};

	useEffect(() => {
		checkMessageIsSeen();
	}, []);

	return (
		<React.Fragment>
			<div
				className={`entry ${notDelivered && 'not-delivered'} ${
					props.isSender ? 'sender' : 'recipient'
				}`}
			>
				{isConversationMessage && (
					<React.Fragment>
						<div className="username">
							{getNumberDisplayName(props.data.sender.phoneNumber)}
						</div>
					</React.Fragment>
				)}
				<div className="chat-bubble">
					<div className="content">
						<div className="text">{getMessageContent(props.data, { data })}</div>
						<div className="tail">
							<i
								className={`icon fa-solid fa-comment ${
									props.isSender ? 'fa-flip-horizontal' : ''
								}`}
							></i>
						</div>
					</div>
					{notDelivered && (
						<div className="not-delivered-icon">
							<i className="elm fa-regular fa-circle-exclamation"></i>
						</div>
					)}
				</div>
				{props.seen && <div className="message-seen">{lang.get('Message.seen')}</div>}
				{notDelivered && (
					<React.Fragment>
						<div className="not-delivered-text">
							{lang.get('Message.not-delivered')}
						</div>
					</React.Fragment>
				)}
			</div>
		</React.Fragment>
	);
};

type Props = {
	isSender: boolean;
	seen: boolean;
	data: PhoneMessage;
};

export default Component;
