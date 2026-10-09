import React, { useState, createContext, useContext } from 'react';

// Context
import { AppState } from '../..';

// Phone Context
const Context = createContext({});
export const ViewState: ExpectedAny = () => useContext(Context);

// Dependencies
import Avatar from '../contactDetails/components/avatar';

// Components
import Header from './components/header';
import Forms from './components/forms';
import Preferences from './components/preferences';
import Notes from './components/notes';
import { logError } from '@/utils/helpers';

// Language
import * as i18n from '@vmp/i18n';
import LanguagePack from './components/language';
i18n.createLanguagePack('PHONE_APP_PHONE_EDITCONTACT', LanguagePack);

const Component = () => {
	const lang = i18n.getLanguagePack('PHONE_APP_PHONE_EDITCONTACT', window.language);
	const { contactSelected, setSubRoute, refreshContactsList } = AppState();
	const { updateContact } = AppState();

	const [editData, setEditData] = useState(contactSelected);
	const [submitted, setSubmitted] = useState(false);

	// If no contact data is loaded we don't render anything.
	if (contactSelected === null || editData === null) return null;

	const onSubmit = async () => {
		try {
			if (submitted) return false;

			// Mark as submitted
			setSubmitted(true);

			// Preparing the payload
			const payload = { name: editData.name, number: editData.number, notes: editData.notes };

			// Ask the server to update this contact for us..
			const response = await window.rpc.callServer(
				`phone:contacts.edit`,
				JSON.stringify({
					id: contactSelected.id,
					payload
				})
			);

			// If the id is not in list of contacts..
			if (response === 'NOT_IN_CONTACTS') throw new Error(`NOT_IN_CONTACTS`);

			// If the phone number is invalid.
			if (response === 'INVALID_PHONE_NUMBER') throw new Error(`INVALID_PHONE_NUMBER`);

			// Or if we're facing server difficulties
			if (response === false) throw new Error(`SERVER_DIFFICULTIES`);

			// Let's update his data
			updateContact(contactSelected.id, payload);

			// Redirect view
			setSubRoute('contactDetails');
		} catch (err: ExpectedAny) {
			let errTitle = lang.get('Submit:Alert:Error:title');
			let errMessage = `Submit:Alert:Error:description`;

			if (err.meessage === 'NOT_IN_CONTACTS') {
				errMessage = lang.get('Submit:Alert:Error:NotInContacts:title');
				refreshContactsList();
			}

			if (err.message === 'INVALID_PHONE_NUMBER') {
				errTitle = lang.get('Submit:Alert:Error:InvalidPhoneNumber:title');
				errMessage = lang.get('Submit:Alert:Error:InvalidPhoneNumber:description');
			}

			window.phone.showAlert({
				title: errTitle,
				description: errMessage,
				buttons: [
					{
						text: `OK`,
						onSelection: ({ dismiss }) => dismiss()
					}
				]
			});

			await logError(`phone.editContact`, err, { editData });

			setSubmitted(false);
		}
	};

	const onCancel = () => {
		if (submitted) return false;
		setSubRoute('contactDetails');
	};

	const isFormValid = () => {
		if (editData.name.length < 1) return false;
		if (editData.number.length < 6) return false;
		return true;
	};

	const passedProps = {
		// Data
		setData: setEditData,
		data: editData,
		// State
		submitted,
		// Callbacks
		validForm: isFormValid(),
		onCancel,
		onSubmit
	};

	return (
		<React.Fragment>
			<Context.Provider value={passedProps}>
				<Header />
				<Avatar name={editData.name || '?'} />
				<div className="categoryLabel">{lang.get('CategoryLabel:information')}</div>
				<Forms />
				<div className="categoryLabel">{lang.get('CategoryLabel:preferences')}</div>
				<Preferences />
				<div className="categoryLabel">{lang.get('CategoryLabel:notes')}</div>
				<Notes />
			</Context.Provider>
		</React.Fragment>
	);
};

export default Component;
