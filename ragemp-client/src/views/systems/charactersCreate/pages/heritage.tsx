import React from 'react';
import { CharContext } from '../utils/context';

// Form Elements
import Arrows from '../components/arrows';
import Slider from '../components/slider';
import Subheader from '../components/subheader';

// Lanaguage translation
import * as i18n from '@vmp/i18n';
import LanguagePack from './heritage.language';
const LanguagePackId = `SYSTEM_CHAR_CREATOR_PAGE_HERITAGE`;
i18n.createLanguagePack(LanguagePackId, LanguagePack);

const Step = () => {
	const { data, updateData, changeGender } = CharContext();
	const lang = i18n.getLanguagePack(LanguagePackId, window.language);

	return (
		<React.Fragment>
			<Subheader label={lang.get('Parents')} />
			<Arrows
				label={lang.get(`Mother`)}
				value={data.clothes.motherShape}
				formatValue={(val: number) => lang.get(`SampleNo`, { value: val })}
				onChange={(value: number) => updateData(`clothes.motherShape`, value)}
				min={0}
				max={44}
			/>
			<Arrows
				label={lang.get(`Father`)}
				value={data.clothes.fatherShape}
				formatValue={(val: number) => lang.get(`SampleNo`, { value: val })}
				onChange={(value: number) => updateData(`clothes.fatherShape`, value)}
				min={0}
				max={44}
			/>
			<Subheader label={lang.get('Preferences')} mt={true} />
			<Arrows
				label={lang.get('Gender')}
				value={data.clothes.gender === 'male' ? 0 : 1}
				formatValue={(val: number) =>
					`${val === 0 ? lang.get(`MaleGender`) : lang.get('FemaleGender')}`
				}
				onChange={(value: number) => changeGender(value === 0 ? `male` : `female`)}
				min={0}
				max={1}
			/>
			<Slider
				value={data.clothes.shapeResemblance * 100}
				onChange={(value: number) => updateData('clothes.shapeResemblance', value / 100)}
				min={0}
				max={100}
				label={lang.get('Resemblance')}
			/>
			<Slider
				value={data.clothes.skinResemblance * 100}
				onChange={(value: number) => updateData('clothes.skinResemblance', value / 100)}
				min={0}
				max={100}
				label={lang.get('SkinTone')}
			/>
		</React.Fragment>
	);
};

export default Step;
