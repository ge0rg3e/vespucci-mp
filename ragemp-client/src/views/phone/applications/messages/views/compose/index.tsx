import React, { useState, createContext, useContext } from 'react';

// Components
import Header from './components/header';
import Recipients from './components/recipients';
import Instructions from './components/instructions';

import Footer from '../converastion/components/footer';
import { AppState } from '../..';

// Language
import * as i18n from '@vmp/i18n';
import LanguagePack from './language';
i18n.createLanguagePack(`PHONE_APP_MESSAGES_COMPOSE`, LanguagePack);

// View Context
const Context = createContext({});
export const ViewState: ExpectedAny = () => useContext(Context);

const Component = () => {
	const [recipients, setRecipients] = useState([]);
	const { data, sendMessage, setSubRoute, setSelectedParticipants } = AppState();
	const lang = i18n.getLanguagePack('PHONE_APP_MESSAGES_COMPOSE', window.language);

	const ContextProps = {
		recipients,
		setRecipients,
		lang
	};

	const onSendMessage = (inputText: string) => {
		// Not valid.
		if (recipients.length < 1 || inputText.length < 1) return false;

		// Send message
		sendMessage(recipients, {
			type: 'text',
			data: inputText
		});

		// Move to view
		setSubRoute('conversation');

		// Set participants
		setSelectedParticipants([data.phoneNumber, ...recipients].sort());
	};

	return (
		<Context.Provider value={ContextProps}>
			<Header />
			<Recipients />
			<Instructions />
			<Footer onSendMessage={onSendMessage} disabled={recipients.length < 1} />
		</Context.Provider>
	);
};

export default Component;
