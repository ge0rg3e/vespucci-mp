import React, { useState, createContext, useContext } from 'react';

// Language
import * as i18n from '@vmp/i18n';
import LanguagePack from './language';
i18n.createLanguagePack('PHONE_APP_PHONE_RECENTCALLS', LanguagePack);

// Components
import Header from './components/header';
import List from './components/list';
import { AppState } from '../..';

// Phone Context
const Context = createContext({});
export const ViewState: ExpectedAny = () => useContext(Context);

const Component = () => {
	const lang = i18n.getLanguagePack('PHONE_APP_PHONE_RECENTCALLS', window.language);
	const { deleteContactLogs, deleteContactLog } = AppState();
	const [editing, setEditing] = useState(false);
	const [filter, setFilter] = useState('all');

	const clearEntries = () => {
		window.phone.showAlert({
			title: lang.get('clearEntries.Alert.title'),
			description: lang.get('clearEntries.Alert.description'),
			buttons: [
				{
					text: lang.get('no'),
					color: 'blue',
					onSelection: ({ dismiss }) => {
						dismiss();
					}
				},

				{
					text: lang.get('yes'),
					color: 'red',
					onSelection: ({ dismiss }) => {
						deleteContactLogs();
						setEditing(false);
						dismiss();
					}
				}
			]
		});
	};

	const deleteEntry = (uuid: string) => deleteContactLog(uuid);

	const PassedProps = {
		filter,
		setFilter,
		editing,
		setEditing,
		clearEntries,
		deleteEntry
	};

	return (
		<Context.Provider value={PassedProps}>
			<Header />
			<div className="component-heading">
				<div className="text">{lang.get('recents')}</div>
			</div>
			<List />
		</Context.Provider>
	);
};

export default Component;
