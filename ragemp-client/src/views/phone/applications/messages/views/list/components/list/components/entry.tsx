import { getMessageContent } from '../../../../converastion/utils/functions';
import { logError, truncateString } from '@/utils/helpers';
import { AppState } from '../../../../..';
import { ViewState } from '../../..';
import moment from 'moment';
import React from 'react';

const Component = (props: Props) => {
	const { data, getNumberDisplayName, onConverastionSelected } = AppState();
	const { deleting, setDeletingParticipants, deletingParticipants } = ViewState();

	const getLastMessage = () => props.data.messages[props.data.messages.length - 1];

	const getMessageSummary = () => {
		try {
			const lastMsg = getLastMessage();

			const text = getMessageContent(lastMsg, { data });
			return truncateString(text, 20);
		} catch (err) {
			logError(`getMessageSummary`, err, { message: getLastMessage(), data });
			return `UNKNOWN_MESSAGE`;
		}
	};

	const getTimestmap = () => {
		const lastMsg = getLastMessage();
		const date = lastMsg.createdAt;
		const today = moment();

		if (moment(date).isSame(today, 'day')) {
			// Format for today
			return moment(date).format('HH:mm');
		} else {
			// Format for other dates
			return moment(date).format('DD/MM/YYYY');
		}
	};

	const getDisplayName = () => {
		const participants = props.data.participants.filter((c) => c !== data.phoneNumber);

		// Get the display name
		let displayName = participants
			.slice(0, 2)
			.map((c) => getNumberDisplayName(c))
			.join(', ');

		// Truncate
		displayName = truncateString(displayName, 30, false);

		if (participants.length > 2) {
			displayName += ` (+${participants.length - 2} more)`;
		}

		return displayName;
	};

	const isMarkedForDeletion = () => {
		const index = deletingParticipants.findIndex(
			(c: ExpectedAny) => `${JSON.stringify(c)}` === JSON.stringify(props.data.participants)
		);

		if (index !== -1) return true;

		return false;
	};

	const switchMarkForDeletion = () => {
		const index = deletingParticipants.findIndex(
			(c: ExpectedAny) => `${JSON.stringify(c)}` === JSON.stringify(props.data.participants)
		);

		if (index === -1) {
			setDeletingParticipants([...deletingParticipants, props.data.participants]);
		} else {
			const newArr = [...deletingParticipants];
			newArr.splice(index, 1);
			setDeletingParticipants(newArr);
		}
	};

	const onClick = () => {
		if (deleting) return switchMarkForDeletion();

		onConverastionSelected(props.data.participants);
	};

	return (
		<React.Fragment>
			<div
				className={`entry ${isMarkedForDeletion() && 'marked-for-deletion'}`}
				onClick={onClick}
			>
				{deleting && (
					<React.Fragment>
						<div
							className={`component-delete-check ${
								isMarkedForDeletion() && 'marked'
							}`}
						>
							{isMarkedForDeletion() && (
								<div className="checked-icon">
									<i className="elm fa-solid fa-check"></i>
								</div>
							)}
						</div>
					</React.Fragment>
				)}
				<div className="component-avatar medium">
					<i className="icon fa-solid fa-user"></i>
				</div>
				<div className="details">
					<div className="header">
						<div className="names">{getDisplayName()}</div>
						<div className="timestamp">{getTimestmap()}</div>
						<div className="icon-right">
							<i className="elm fa-solid fa-chevron-right"></i>
						</div>
					</div>
					<div className="content">{getMessageSummary()}</div>
				</div>
			</div>
		</React.Fragment>
	);
};

type Props = {
	data: MessageConverastion;
};

export default Component;
