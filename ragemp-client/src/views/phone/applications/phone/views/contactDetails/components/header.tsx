import { getLanguagePack } from '@vmp/i18n';
import { AppState } from '../../..';
import React from 'react';

const Component = () => {
	const lang = getLanguagePack('PHONE_APP_PHONE_CONTACTDETAILS', window.language);
	const { setSubRoute, setSelectedContactId } = AppState();

	const goBack = () => {
		setSubRoute('listContacts');
		setSelectedContactId(null);
	};

	const editContact = () => {
		setSubRoute('editContact');
	};

	return (
		<React.Fragment>
			<div className="component-app-header">
				<div className="left-side">
					<div className="entry" onClick={goBack}>
						<div className="icon">
							<i className="elm fa-regular fa-chevron-left"></i>
						</div>
						<div className="label">{lang.get('Header:left-side:label')}</div>
					</div>
				</div>
				<div className="right-side">
					<div className="entry" onClick={editContact}>
						<div className="label">{lang.get('Header:right-side:label')}</div>
					</div>
				</div>
			</div>
		</React.Fragment>
	);
};

export default Component;
