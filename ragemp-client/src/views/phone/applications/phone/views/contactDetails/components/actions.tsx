import { getLanguagePack } from '@vmp/i18n';
import React from 'react';
import { AppState } from '../../..';
import { PhoneState } from '@/views/phone';
import { fakeAwait } from '@/utils/helpers';

const Component = () => {
	const { closeApplication, openApplication } = PhoneState();
	const { data, contactSelected } = AppState();

	const lang = getLanguagePack('PHONE_APP_PHONE_CONTACTDETAILS', window.language);

	const getActions = () => {
		const actions = [
			{
				id: 'message',
				icon: 'fa-solid fa-comment',
				onClick: async () => {
					// Close the message application
					closeApplication();

					// Wait for 500 ms for a smooth transition?
					await fakeAwait(500);

					// @Why do I do this? Because events are not accessible.

					// Open the messages app
					openApplication({
						route: 'messages',
						payload: {
							subRoute: 'list',
							gotoConverastion: {
								participants: [contactSelected.number, data.localInfo.number]
							}
						}
					});
				}
			},
			{
				id: 'call',
				icon: 'fa-solid fa-phone',
				onClick: () => window.phone.callNumber(contactSelected.number)
			},
			{
				id: 'mail',
				icon: 'fa-solid fa-envelope',
				disabled: true
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
							<div className="label">{lang.get(`Actions:${c.id}`)}</div>
						</div>
					</div>
				))}
			</div>
		</React.Fragment>
	);
};

export default Component;
