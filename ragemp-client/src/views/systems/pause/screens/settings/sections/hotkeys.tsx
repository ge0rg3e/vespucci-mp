import React from 'react';

// Components
import Heading from '../components/heading';
import Option from '../components/option';

// Forms
import Keybind from '../components/forms/keybind';
import Boolean from '../components/forms/boolean';

// Contextt
import { PauseState } from '../../..';

// Language
import { createLanguagePack, getLanguagePack } from '@vmp/i18n';
import LanguagePack from './hotkeys.lang';
const LanguageSystemId = 'pause.sections.hotkeys';
createLanguagePack(LanguageSystemId, LanguagePack);

const Component = () => {
	const { settings, updateSettings } = PauseState();
	const lang = getLanguagePack(LanguageSystemId, window.language);

	const getControls = () => {
		return [
			'chat',
			'mapZoom',
			'openMap',
			'voiceChat',
			'inventory',
			'phone',
			'profile',
			'playersList',
			'vehicleLock',
			'vehicleSeatbelt',
			'vehicleEngine'
		];
	};

	return (
		<React.Fragment>
			<div className="component-section">
				<Heading
					icon="fa-regular fa-keyboard"
					title={lang.get('HeadingLabel')}
					description={lang.get('HeadingDescription')}
				/>
				<div className="component-options">
					{getControls().map((control, ix) => (
						<Option
							key={ix}
							label={lang.get(`KeyLabel:${control}`)}
							component={
								<Keybind
									currentKey={settings.hotkeys[control]}
									onChange={(value: boolean) =>
										updateSettings({
											hotkeys: {
												...settings.hotkeys,
												[control]: value
											}
										})
									}
								/>
							}
						/>
					))}
				</div>
			</div>
		</React.Fragment>
	);
};

export default Component;
