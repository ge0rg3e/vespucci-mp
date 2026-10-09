import React from 'react';
import { AppState } from '../../..';

const Component = (props: ExpectedAny) => {
	const { setSubRoute, setSelectedParticipants, getNumberDisplayName } = AppState();
	const { data, selectedParticipants } = AppState();

	const goBack = () => {
		setSubRoute('list');
		setSelectedParticipants([]);
	};

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

	return (
		<React.Fragment>
			<div className="component-app-header">
				<div className="left-side">
					<div className="entry" onClick={goBack}>
						<div className="icon">
							<i className="elm fa-solid fa-chevron-left"></i>
						</div>{' '}
					</div>
				</div>
				<div className="middle-side" onClick={() => props.setShowContactCard(true)}>
					<div className="component-avatar medium">
						<i className="icon fa-solid fa-user"></i>
					</div>
					<div className="displayName">{getDisplayName()}</div>
				</div>
				<div className="right-side"></div>
			</div>
		</React.Fragment>
	);
};

export default Component;
