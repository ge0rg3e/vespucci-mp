import { ComponentState } from '../..';
import React from 'react';

// Components
import Controls from '../../components/controls';
import Special from './types/special';
import Normal from './types/normal';

// Language
import { createLanguagePack, getLanguagePack } from '@vmp/i18n';
const LanguageSystemId = 'tunning:paintLabels';
import LanguagePack from './index.language';
createLanguagePack(LanguageSystemId, LanguagePack);

const ScreensMap: ExpectedAny = {
	normal: Normal,
	'special:metallic': () => <Special type="metallic" />,
	'special:matte': () => <Special type="matte" />,
	'special:premium': () => <Special type="premium" />
};

const Component = () => {
	const { option } = ComponentState();
	const ScreenComponent = option !== null && ScreensMap[option] ? ScreensMap[option] : null;

	const controlsLang = getLanguagePack('tunning:controlsLabels', window.language);

	const getControls = () => {
		const arr = [];

		arr.push({
			label: controlsLang.get('navigate'),
			key: 'A & D'
		});

		arr.push({
			label: controlsLang.get('back'),
			key: <i className="icon large fa-solid fa-delete-left"></i>
		});

		arr.push({
			label: controlsLang.get('select'),
			key: <i className="icon fa-solid fa-arrow-turn-down-left"></i>
		});

		return arr;
	};

	return (
		<React.Fragment>
			{ScreenComponent && <ScreenComponent />}
			{option === null && <Controls keys={getControls()} />}
		</React.Fragment>
	);
};

export default Component;
