import React from 'react';

// Dependencies
import { groupContactsAlphabetically } from '../../../utils/helpers';
import { getLanguagePack } from '@vmp/i18n';

// Context
import { AppState } from '../../..';

// Components
import ContactCard from '../components/contactCard';

const Component = () => {
	const { contacts, searchingContact, gotoContact } = AppState();
	const lang = getLanguagePack('PHONE_APP_PHONE_LISTCONTACTS', window.language);

	const getContacts = () => {
		// Get the full list of contacts
		let arr = [...contacts];

		// Filter it if we have search active..
		if (searchingContact) {
			arr = arr.filter((c) =>
				c.name
					.toString()
					.toLowerCase()
					.includes(`${searchingContact.toString().toLowerCase()}`)
			);
		}

		// We return it and group it..
		return groupContactsAlphabetically(arr);
	};

	return (
		<React.Fragment>
			<div className="component-list">
				<div className="--container">
					<ContactCard />
					{getContacts().map((g, ix) => (
						<div className="group" key={ix}>
							<div className="letter">{g.letter}</div>
							<div className="entries">
								{g.entries.map((entry, ix) => (
									<div
										key={`${g.letter}-${ix}`}
										className={`entry`}
										onClick={() => gotoContact({ id: entry.id })}
									>
										<div className="text">{entry.name}</div>
									</div>
								))}
							</div>
						</div>
					))}
					{searchingContact && getContacts().length < 1 && (
						<div className="no-entries">
							<div className="icon">
								<i className="elm fa-solid fa-magnifying-glass"></i>
							</div>
							<div className="heading">
								{lang.get('List:search:heading', { searchingContact })}
							</div>
							<div className="subheading">{lang.get('List:search:subheading')}</div>
						</div>
					)}

					{!searchingContact && getContacts().length < 1 && (
						<div className="no-entries">
							<div className="icon">
								<i className="elm fa-solid fa-address-book"></i>
							</div>
							<div className="heading">{lang.get('List:noContacts:heading')}</div>
							<div className="subheading">
								{lang.get('List:noContacts:subheading')}
							</div>
						</div>
					)}
				</div>
			</div>
		</React.Fragment>
	);
};

export default Component;
