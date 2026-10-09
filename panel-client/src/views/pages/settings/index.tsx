import React, { createContext, useContext, useEffect, useState } from 'react';
import lodash from 'lodash';

// Dependencies
import Container from '@/views/layout/core/container';

// Components
import Password from './components/password';
import Email from './components/email';
import TwoFactorAuth from './components/twoFactorAuth';

// Context
import { AppContext } from '@/utils/context';

// Create the language pack..
import ComponentLanguages from './languages';
import { createComponentLanguage, getComponentLanguage } from '@/utils/helpers';
import { createAmplitudeEvent } from '@/utils/amplitude';

const TranslationPack = createComponentLanguage('settings.main', ComponentLanguages);

const Context = createContext({});
export const PageState: ExpectedAny = () => useContext(Context);

const Component = () => {
	const lang = getComponentLanguage(TranslationPack);

	const { account } = AppContext();

	const [data, setData] = useState({
		email: account.email,
		currentPassword: '',
		codeNewEmail: '',
		codeOldEmail: '',
		newPassword: ''
	});

	const [draftData, setDraftData] = useState<FixableAny>({ ...data });
	const [tab, setTab] = useState('general');
	const [submitted, setSubmitted] = useState(false);

	const updateDraftData = (path: string, value: ExpectedAny) => {
		setDraftData((currentState: FixableAny) => {
			const newData = { ...currentState };
			lodash.set(newData, path, value);
			return newData;
		});
	};

	useEffect(() => {
		if (JSON.stringify(draftData) !== JSON.stringify(data)) {
			setDraftData({ ...data });
		}
		// eslint-disable-next-line
	}, [tab]);

	const passedProps = {
		tab,
		setTab,
		// @Data - The original data from the server.
		data,
		setData,
		// @Draft data - The data that the user keeps changing.
		draftData,
		setDraftData,
		updateDraftData,
		submitted,
		setSubmitted
	};

	const breadcrumbs = [
		{
			shortcut: 'home'
		},
		{
			label: lang.get('breadcrumb'),
			icon: 'fa-solid fa-gear',
			href: '/settings'
		}
	];

	useEffect(() => {
		createAmplitudeEvent(`Settings`);
	}, []);

	return (
		<Container title={lang.get('seoTitle')} classNames="page-settings" breadcrumbs={breadcrumbs}>
			<Context.Provider value={passedProps}>
				<div className="page-layout">
					<div className="page-content">
						<Password />
						<Email />
						<TwoFactorAuth />
					</div>
				</div>
			</Context.Provider>
		</Container>
	);
};

export default Component;
