import { getLanguagePack } from '@vmp/i18n';
import React from 'react';

// Context
import { AppState } from '../../..';

const Component = () => {
	const lang = getLanguagePack('PHONE_APP_PHONE_LISTCONTACTS', window.language);
	const { searchingContact, setSearchingContact, setSubRoute } = AppState();

	const onClickRecents = () => {
		setSubRoute('recentCalls');
	};

	const onClickAdd = () => {
		setSubRoute('createContact');
	};

	return (
		<React.Fragment>
			<div className="component-app-header">
				<div className="left-side">
					<div className="entry" onClick={onClickRecents}>
						<div className="icon">
							<i className="elm fa-regular fa-chevron-left"></i>
						</div>
						<div className="label">{lang.get('Header:left-side:label')}</div>
					</div>
				</div>
				<div className="right-side">
					<div className="entry add" onClick={onClickAdd}>
						<div className="icon">
							<i className="elm fa-solid fa-plus"></i>
						</div>
					</div>
				</div>
			</div>
			<div className="component-heading">
				<div className="text">{lang.get('Header:heading')}</div>
				<input
					type="text"
					className="search-bar"
					placeholder="Search"
					value={searchingContact}
					onChange={(ev) => setSearchingContact(ev.target.value)}
				/>
			</div>
		</React.Fragment>
	);
};

export default Component;
