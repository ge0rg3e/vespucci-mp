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
import Notes from './components/notes';
import { logError } from '@/utils/helpers';

// Language
import * as i18n from '@vmp/i18n';
import LanguagePack from './components/language';
i18n.createLanguagePack('PHONE_APP_PHONE_CREATECONTACT', LanguagePack);

const Component = () => {
	const lang = i18n.getLanguagePack('PHONE_APP_PHONE_CREATECONTACT', window.language);
	const { defaultCreateContactData, setSelectedContactId, setSubRoute } = AppState();
	const [submitted, setSubmitted] = useState(false);
	const [contactData, setContactData] = useState({
		name: defaultCreateContactData?.name || '',
		number: defaultCreateContactData?.number || '',
		notes: defaultCreateContactData?.notes || ''
	});

	const onSubmit = async () => {
		try {
			if (submitted) return false;
			setSubmitted(true);

			// Ask the server to create this new contact for us..
			const response = await window.rpc.callServer(`phone:contacts.add`, JSON.stringify(contactData));

			// If the number is already in contacts
			if (response === 'NUMBER_ALREADY_EXISTS') throw new Error('NUMBER_ALREADY_EXISTS');

			// If the phone number is invalid.
			if (response === 'INVALID_PHONE_NUMBER') throw new Error(`INVALID_PHONE_NUMBER`);

			// Or if we're facing server difficulties
			if (response === false) throw new Error(`SERVER_DIFFICULTIES`);

			// All good now let's just redirect him to the newly created id.
			setSelectedContactId(response.id);

			// Redirect view
			setSubRoute('contactDetails');
		} catch (err: ExpectedAny) {
			let errTitle = lang.get('Submit:Alert:Error:title');
			let errMessage = lang.get('Submit:Alert:Error:description');

			if (err.message === 'INVALID_PHONE_NUMBER') {
				errTitle = lang.get('Submit:Alert:Error:InvalidPhoneNumber:title');
				errMessage = lang.get('Submit:Alert:Error:InvalidPhoneNumber:description');
			}

			if (err.message === 'NUMBER_ALREADY_EXISTS') {
				errTitle = lang.get('Submit:Alert:Error:NumberAlreadyExists:title');
				errMessage = lang.get('Submit:Alert:Error:NumberAlreadyExists:description');
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

			await logError(`phone.createContact`, err, {
				contactData
			});

			setSubmitted(false);
		}
	};

	const onCancel = () => {
		if (submitted) return false;
		setSubRoute('listContacts');
	};

	const isFormValid = () => {
		if (contactData.name.length < 1) return false;
		if (contactData.number.length < 6) return false;
		return true;
	};

	const passedProps = {
		// Data
		setData: setContactData,
		data: contactData,
		// Callbacks
		onSubmit,
		onCancel,
		validForm: isFormValid(),
		// States
		submitted
	};

	return (
		<React.Fragment>
			<Context.Provider value={passedProps}>
				<Header />
				<Avatar name={contactData.name || '?'} />
				<div className="categoryLabel">{lang.get('CategoryLabel:information')}</div>
				<Forms />
				<div className="categoryLabel">{lang.get('CategoryLabel:notes')}</div>
				<Notes />
			</Context.Provider>
		</React.Fragment>
	);
};

export default Component;
