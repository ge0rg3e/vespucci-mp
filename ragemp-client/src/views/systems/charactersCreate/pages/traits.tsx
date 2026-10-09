import React from 'react';
import { CharContext } from '../utils/context';

// Form Elements
import Slider from '../components/slider';
import Subheader from '../components/subheader';

// Lanaguage translation
import * as i18n from '@vmp/i18n';
import LanguagePack from './traits.language';
const LanguagePackId = `SYSTEM_CHAR_CREATOR_PAGE_TRAITS`;

i18n.createLanguagePack(LanguagePackId, LanguagePack);

const Step = () => {
	const { data, updateData } = CharContext();
	const lang = i18n.getLanguagePack(LanguagePackId, window.language);

	return (
		<React.Fragment>
			<Subheader label={lang.get('Nose')} />
			<Slider
				label={lang.get('Width')}
				value={data.clothes.noseWidth * 100}
				onChange={(value: number) => updateData(`clothes.noseWidth`, value / 100)}
				min={-100}
				max={100}
			/>
			<Slider
				label={lang.get('Height')}
				value={data.clothes.noseHeight * 100}
				onChange={(value: number) => updateData(`clothes.noseHeight`, value / 100)}
				min={-100}
				max={100}
			/>
			<Slider
				label={lang.get('Length')}
				value={data.clothes.noseLength * 100}
				onChange={(value: number) => updateData(`clothes.noseLength`, value / 100)}
				min={-100}
				max={100}
			/>
			<Slider
				label={lang.get('NoseBridge')}
				value={data.clothes.noseBridge * 100}
				onChange={(value: number) => updateData(`clothes.noseBridge`, value / 100)}
				min={-100}
				max={100}
			/>
			<Slider
				label={lang.get('NoseTip')}
				value={data.clothes.noseTip * 100}
				onChange={(value: number) => updateData(`clothes.noseTip`, value / 100)}
				min={-100}
				max={100}
			/>
			<Slider
				label={lang.get('NoseShift')}
				value={data.clothes.noseBridgeShift * 100}
				onChange={(value: number) => updateData(`clothes.noseBridgeShift`, value / 100)}
				min={-100}
				max={100}
			/>
			<Subheader label={lang.get('Jaw')} />
			<Slider
				label={lang.get('Height')}
				value={data.clothes.jawHeight * 100}
				onChange={(value: number) => updateData(`clothes.jawHeight`, value / 100)}
				min={-100}
				max={100}
			/>
			<Slider
				label={lang.get('Width')}
				value={data.clothes.jawWidth * 100}
				onChange={(value: number) => updateData(`clothes.jawWidth`, value / 100)}
				min={-100}
				max={100}
			/>
			<Subheader label={lang.get('Chin')} />
			<Slider
				label={lang.get('Length')}
				value={data.clothes.chinLength * 100}
				onChange={(value: number) => updateData(`clothes.chinLength`, value / 100)}
				min={-100}
				max={100}
			/>
			<Slider
				label={lang.get('Width')}
				value={data.clothes.chinWidth * 100}
				onChange={(value: number) => updateData(`clothes.chinWidth`, value / 100)}
				min={-100}
				max={100}
			/>
			<Slider
				label={lang.get('Position')}
				value={data.clothes.chinPosition * 100}
				onChange={(value: number) => updateData(`clothes.chinPosition`, value / 100)}
				min={-100}
				max={100}
			/>
			<Slider
				label={lang.get('Shape')}
				value={data.clothes.chinShape * 100}
				onChange={(value: number) => updateData(`clothes.chinShape`, value / 100)}
				min={-100}
				max={100}
			/>
			<Subheader label={lang.get('Cheekbone')} />
			<Slider
				label={lang.get('Height')}
				value={data.clothes.cheekboneHeight * 100}
				onChange={(value: number) => updateData(`clothes.cheekboneHeight`, value / 100)}
				min={-100}
				max={100}
			/>
			<Slider
				label={lang.get('Width')}
				value={data.clothes.cheekboneWidth * 100}
				onChange={(value: number) => updateData(`clothes.cheekboneWidth`, value / 100)}
				min={-100}
				max={100}
			/>
			<Slider
				label={lang.get('CheeksWidth')}
				value={data.clothes.cheeksWidth * 100}
				onChange={(value: number) => updateData(`clothes.cheeksWidth`, value / 100)}
				min={-100}
				max={100}
			/>
			<Subheader label={lang.get('Neck')} />
			<Slider
				label={lang.get('Width')}
				value={data.clothes.neckWidth * 100}
				onChange={(value: number) => updateData(`clothes.neckWidth`, value / 100)}
				min={-100}
				max={100}
			/>
			<Subheader label={lang.get('Mouth')} />
			<Slider
				label={lang.get('Size')}
				value={data.clothes.mouthSize * 100}
				onChange={(value: number) => updateData(`clothes.mouthSize`, value / 100)}
				min={-100}
				max={100}
			/>
		</React.Fragment>
	);
};

export default Step;
