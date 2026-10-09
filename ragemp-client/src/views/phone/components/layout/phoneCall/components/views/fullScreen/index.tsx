import React from 'react';

import * as i18n from '@vmp/i18n';
import LanguagePack from './language';
i18n.createLanguagePack('PHONE_LAYOUT_PHONECALL', LanguagePack);

// Components
import Header from './components/header';
import Options from './components/options';
import Footer from './components/footer/index';
import { ComponentState } from '../../../';

const Component = () => {
	const { switchOverlayTheme } = ComponentState();

	return (
		<React.Fragment>
			<div className="background-blurred"></div>
			<div className="layout-container">
				<Header />
				<Options />
				<Footer />
			</div>
			<div className="closing-area" onClick={switchOverlayTheme}>
				<div className="closing-line"></div>
			</div>
		</React.Fragment>
	);
};

export default Component;
