import React from 'react';
import { ComponentContext } from '../../..';

// Language
import * as i18n from '@vmp/i18n';
import LanguagePack from './muteWarning.lang';

// Language translation
const languagePackId = `services.vespify.muteWarning`;
i18n.createLanguagePack(languagePackId, LanguagePack);

const Component = () => {
	const { instance, showControls } = ComponentContext();

	// Get translation
	const lang = i18n.getLanguagePack(languagePackId, window.language);

	return (
		<React.Fragment>
			{instance.controls.muted && !showControls && (
				<div className="mute-warning">
					<div className="icon">
						<i className="elm fa-solid fa-volume-slash"></i>
					</div>
					<div className="text">{lang.get('Muted')}</div>
				</div>
			)}
		</React.Fragment>
	);
};

export default Component;
