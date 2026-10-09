import React, { useState, createContext, useContext, useEffect } from 'react';
import { Account } from './context.types';

const Context = createContext({});
export const AppContext: ExpectedAny = () => useContext(Context);

const ExportingComponent = (props: ExpectedAny) => {
	const [account, setAccount] = useState<Account | null>(props.sessionData);
	const [language, setLanguage] = useState('EN'); // Server-side default rendering language.

	useEffect(() => {
		// @Bugfix: We need to set the languages on useEffect to avoid errors from next.js due to different server-side content.
		const storageLanguage = window.localStorage.getItem('language');
		setLanguage(storageLanguage ? storageLanguage : language);
		// eslint-disable-next-line
	}, []);

	useEffect(() => {
		window.account = account;
		window.language = language;
	}, [account, language]);

	const passedVariables = {
		account,
		setAccount,
		language,
		setLanguage
	};

	return <Context.Provider value={passedVariables}>{props.children}</Context.Provider>;
};

declare global {
	interface Window {
		account: ExpectedAny | null;
		language: ExpectedAny;
	}
}

export default ExportingComponent;
