import { getLanguagePack } from '@vmp/i18n';
import React from 'react';

// Context
import { AppState } from '@/views/phone/applications/messages';
import { ViewState } from '../../..';
import { PhoneState } from '@/views/phone';
import { fakeAwait } from '@/utils/helpers';

const Component = () => {
	const lang = getLanguagePack('PHONE_APP_MESSAGES_CONVERSATION', window.language);
	const { contacts, data, selectedParticipants } = AppState();
	const { closeApplication, openApplication } = PhoneState();
	const { setShowContactCard } = ViewState();

	const onCall = () => {
		// Get the number of the other participant that is not me.
		const phoneNumber = selectedParticipants.find((c: ExpectedAny) => c !== data.phoneNumber);
		if (!phoneNumber) return false; // bug.

		window.phone.callNumber(phoneNumber);
	};

	const seeContactInfo = async () => {
		// Hide this to see alert better
		setShowContactCard(false);

		// Get the number of the other participant that is not me.
		const phoneNumber = selectedParticipants.find((c: ExpectedAny) => c !== data.phoneNumber);
		if (!phoneNumber) return false; // bug.

		const contactMatch = contacts.find((c: ExpectedAny) => c.number === phoneNumber);

		// Close the message application
		closeApplication();

		// Wait for 500 ms for a smooth transition?
		await fakeAwait(500);

		const payload: ExpectedAny = { subRoute: 'listContacts' };

		if (contactMatch) {
			// If there is a match, go to the contact
			payload['gotoContact'] = { id: contactMatch.id };
		} else {
			// If there is no match, go to add a contact
			payload['addContactWithFilledDetails'] = { name: '', number: phoneNumber };
		}

		// @Why do I do this? Because events are not accessible.

		// Open the phone app
		openApplication({
			route: 'phone',
			payload
		});
	};

	const getActions = () => {
		const actions = [
			{
				id: 'call',
				disabled: selectedParticipants.length > 2 ? true : false,
				icon: 'fa-solid fa-phone',
				onClick: onCall
			},
			{
				id: 'mail',
				icon: 'fa-solid fa-envelope',
				disabled: true
			},

			{
				id: 'info',
				icon: 'fa-solid fa-user',
				disabled: false,
				onClick: seeContactInfo
			}
		];

		return actions;
	};

	return (
		<React.Fragment>
			<div className="actions">
				{getActions().map((c, ix) => (
					<div key={ix} className={`entry ${c.disabled && 'disabled'}`}>
						<div className="content" onClick={c.onClick}>
							<div className="icon">
								<i className={`elm ${c.icon}`}></i>
							</div>
							<div className="label">{lang.get(`ContactCard.actions.${c.id}`)}</div>
						</div>
					</div>
				))}
			</div>
		</React.Fragment>
	);
};

export default Component;
