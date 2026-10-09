import React from 'react';

// Components
import Controls from '../components/controls';

// Language
import { createLanguagePack, getLanguagePack } from '@vmp/i18n';
import LanguagePack from './unableToTune.language';
const LanguageSystemId = 'tunning:unabletoTune';
createLanguagePack(LanguageSystemId, LanguagePack);

const Component = () => {
	const controlsLang = getLanguagePack('tunning:controlsLabels', window.language);
	const lang = getLanguagePack(LanguageSystemId, window.language);

	const getControls = () => {
		const arr = [];

		arr.push({
			label: controlsLang.get('back'),
			key: <i className="icon large fa-solid fa-delete-left"></i>
		});

		return arr;
	};

	return (
		<React.Fragment>
			<div className="layout-dialog">
				<div className="content">
					<div className="title">{lang.get('title')}</div>
					<div className="description more-expanded">{lang.get('description')}</div>
				</div>
			</div>
			<Controls keys={getControls()} />
		</React.Fragment>
	);
};
export default Component;
