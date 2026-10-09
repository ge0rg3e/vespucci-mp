import { createContext, useContext, useState } from 'react';

// Language
import * as i18n from '@vmp/i18n';
import LanguagePack from './language';
i18n.createLanguagePack(`PHONE_APP_MESSAGES_LIST`, LanguagePack);

// Components
import Header from './components/header';
import SubHeader from './components/subheader';
import List from './components/list';

// View Context
const Context = createContext({});
export const ViewState: ExpectedAny = () => useContext(Context);

const Component = () => {
	const [deleting, setDeleting] = useState(false);
	const [deletingParticipants, setDeletingParticipants] = useState([]);

	const [searchValue, setSearchValue] = useState('');

	const ContextProps = {
		// Search
		searchValue,
		setSearchValue,
		// Deleting
		deleting,
		setDeleting,
		deletingParticipants,
		setDeletingParticipants
	};

	return (
		<Context.Provider value={ContextProps}>
			<Header />
			<SubHeader />
			<List />
		</Context.Provider>
	);
};

export default Component;
