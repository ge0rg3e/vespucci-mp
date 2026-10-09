import React from 'react';

// Context
import { AppState } from '../..';

// Componnets
import Header from './components/header';
import Actions from './components/actions';
import Fields from './components/fields';
import Options from './components/options';
import Avatar from './components/avatar';

// Language
import * as i18n from '@vmp/i18n';
import LanguagePack from './components/language';
i18n.createLanguagePack('PHONE_APP_PHONE_CONTACTDETAILS', LanguagePack);

const Component = () => {
	const { contactSelected } = AppState();

	// If no contact  data is loaded we don't render anything.
	if (contactSelected === null) return null;

	return (
		<React.Fragment>
			<Header />
			<div className="component-details">
				<div className="--component-container">
					<Avatar name={contactSelected.name} />
					<div className="name">{contactSelected.name}</div>
					<Actions />
					<Fields />
					<Options />
				</div>
			</div>
		</React.Fragment>
	);
};

export default Component;
