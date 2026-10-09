import { getLanguagePack } from '@vmp/i18n';
import React from 'react';

// Context
import { AppState } from '../../../../../';
import { ViewState } from '../../..';

const Component = () => {
	const lang = getLanguagePack('PHONE_APP_MESSAGES_CONVERSATION', window.language);
	const { data, selectedParticipants, getNumberDisplayName } = AppState();
	const { setShowContactCard } = ViewState();

	const getDisplayName = () => {
		const participants = selectedParticipants.filter(
			(c: ExpectedAny) => c !== data.phoneNumber
		);

		// If is a converastion..
		if (participants.length > 1) {
			return `${selectedParticipants.length} people`;
		}

		// Get the display name
		const displayName = getNumberDisplayName(participants[0]);

		return displayName;
	};

	const onDone = () => {
		setShowContactCard(false);
	};

	return (
		<React.Fragment>
			<div className="header">
				<div className="done-button" onClick={onDone}>
					{lang.get('done')}
				</div>
				<div className="component-avatar">
					<i className="icon fa-solid fa-user"></i>
				</div>
				<div className="displayName">{getDisplayName()}</div>
			</div>
		</React.Fragment>
	);
};

export default Component;
