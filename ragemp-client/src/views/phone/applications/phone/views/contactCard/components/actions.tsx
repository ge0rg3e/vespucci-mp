import { getLanguagePack } from '@vmp/i18n';
import React from 'react';

const Component = () => {
	const lang = getLanguagePack('PHONE_APP_PHONE_CONTACTDETAILS', window.language);

	const getActions = () => {
		const actions = [
			{
				id: 'message',
				icon: 'fa-solid fa-comment',
				disabled: true
			},
			{
				id: 'call',
				icon: 'fa-solid fa-phone',
				disabled: true
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
						<div className="content">
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
