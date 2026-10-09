import React from 'react';

// Components
import Header from './components/header';
import List from './components/list';

// Language
import * as i18n from '@vmp/i18n';
import LanguagePack from './components/language';
i18n.createLanguagePack('PHONE_APP_PHONE_LISTCONTACTS', LanguagePack);

const Component = () => (
	<React.Fragment>
		<Header />
		<List />
	</React.Fragment>
);

export default Component;
