import { getLanguagePack } from '@vmp/i18n';
import React from 'react';

// Context..
import { AppState } from '../../../..';
import { ViewState } from '../..';

// Components
import Entry from './components/entry';

// Dependencies
import { getNumberFromDisplayName, toSmallString } from './components/functions';

const Component = () => {
	const lang = getLanguagePack('PHONE_APP_MESSAGES_LIST', window.language);
	const { conversations, contacts } = AppState();
	const { searchValue } = ViewState();

	const getConversations = () => {
		// The array of conversations originally.
		let arr = [...conversations];

		// Are we searching?
		if (searchValue && searchValue.trim().length > 0) {
			// Reverse engineer "Lucy" from Contacts to extract her real phone number.
			const foundNumber = getNumberFromDisplayName(contacts, searchValue);

			// If we found a contact with that name we now have her number otherwise we'll assume they're searching by phone number.
			const numberUsed = foundNumber ? foundNumber : searchValue.trim();

			arr = arr.filter((c) => {
				// Are we participants?
				const isParticipant = c.participants.find((c: ExpectedAny) =>
					// If the real participant number is at least containing some of my search string.
					toSmallString(c).includes(toSmallString(numberUsed))
				);

				if (!isParticipant) return false;
				return true;
			});
		}
		return arr;
	};

	return (
		<React.Fragment>
			<div className="entries">
				<div className="--container">
					{getConversations().map((data: MessageConverastion, ix: number) => (
						<Entry key={ix} data={data} />
					))}
					{getConversations().length < 1 && !searchValue && (
						<div className="no-entries">
							<div className="icon">
								<i className="elm fa-solid fa-circle-info"></i>
							</div>
							<div className="heading">{lang.get('List.no-entries.heading')}</div>
							<div className="subheading">
								{lang.get('List.no-entries.subheading')}
							</div>
						</div>
					)}

					{getConversations().length < 1 && searchValue && (
						<div className="no-entries">
							<div className="icon">
								<i className="elm fa-solid fa-magnifying-glass"></i>
							</div>
							<div className="heading">
								{lang.get('List.search.no-entries.heading', { searchValue })}
							</div>
							<div className="subheading">
								{lang.get('List.search.no-entries.subheading')}
							</div>
						</div>
					)}
				</div>
			</div>
		</React.Fragment>
	);
};

export default Component;
