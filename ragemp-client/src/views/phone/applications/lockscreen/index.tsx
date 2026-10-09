import React from 'react';

import TimeAndDate from './components/time';
import Notifications from './components/notifications';
import Music from './components/music';

// Context
import { PhoneState } from '@phone/index';

// Language
import * as i18n from '@vmp/i18n';
import LanguagePack from './language';
const languageKey = `PHONE_APP_LOCKSCREEN`;
i18n.createLanguagePack(languageKey, LanguagePack);

const ExportingComponent = () => {
	const { setRoute, setUiState, notifications } = PhoneState();
	const lang = i18n.getLanguagePack(languageKey, window.language);

	const unlockPhone = () => {
		const app = document.getElementsByClassName('device-content')[0];
		const parent: UndefinedAny = app.parentElement;
		if (!app || !parent) return false;

		// Starting the fading so everything is blurred
		setUiState('fading', true);

		// Creating a clone
		const clone: UndefinedAny = app.cloneNode(true);
		clone.className += ' app-lockscreen-opening-phone';

		// Setting route to home so now we are on home screen and now home is blurred
		setRoute('home');

		// Adding the cloned on top of the original one and starting the animation
		parent.appendChild(clone);

		setTimeout(() => {
			setUiState('fading', false);
			clone.remove();
		}, 340);
	};

	return (
		<React.Fragment>
			<TimeAndDate />
			<Music />
			<Notifications lang={lang} />
			<div className="unlock-area">
				<div className="button" onClick={unlockPhone}>
					<i className="icon fa-solid fa-fingerprint"></i>
					<span className="text">{lang.get('UnlockMessage')}</span>
				</div>
			</div>
		</React.Fragment>
	);
};

export default ExportingComponent;
