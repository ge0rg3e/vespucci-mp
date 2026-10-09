import React from 'react';
import { AppState } from '../../..';
import { getLanguagePack } from '@vmp/i18n';

const Component = () => {
	const lang = getLanguagePack('PHONE_APP_PHONE_LISTCONTACTS', window.language);

	const { setSubRoute } = AppState();

	const onSelect = () => setSubRoute('contactCard');

	return (
		<React.Fragment>
			<div className="component-contact-card" onClick={onSelect}>
				<div className="avatar">
					<i className="icon fas fa-user"></i>
				</div>
				<div className="details">
					<div className="username">{lang.get('yourContact:header')}</div>
					<div className="description">{lang.get('yourContact:description')}</div>
				</div>
			</div>
		</React.Fragment>
	);
};

export default Component;
