import React from 'react';
import { CharContext } from '../utils/context';

// Form Elements
import Arrows from '../components/arrows';
import Slider from '../components/slider';
import Subheader from '../components/subheader';
import { femaleHairStylesCreator, maleHairStylesCreator } from '../utils/enums';

// Lanaguage translation
import * as i18n from '@vmp/i18n';
import LanguagePack from './face.language';
const LanguagePackId = `SYSTEM_CHAR_CREATOR_PAGE_FACE`;

i18n.createLanguagePack(LanguagePackId, LanguagePack);

const Step = () => {
	const { data, updateData } = CharContext();
	const lang = i18n.getLanguagePack(LanguagePackId, window.language);

	const getMaxHairStyles = () => {
		const index = data.gender === 'male' ? maleHairStylesCreator : femaleHairStylesCreator;
		return Object.keys(index).length - 1;
	};

	const getHairPack = () => {
		const index = data.gender === 'male' ? maleHairStylesCreator : femaleHairStylesCreator;
		return index;
	};

	return (
		<React.Fragment>
			<Subheader label={lang.get('Hair')} />
			<Arrows
				label={lang.get('Style')}
				value={data.meta.hairModel}
				formatValue={(val: number) =>
					val === 0 ? lang.get(`Bald`) : ` Model ${data.meta.hairModel}`
				}
				onChange={(value: number) => {
					updateData(`clothes.hairModel`, getHairPack()[value]);
					updateData(`meta.hairModel`, value);
				}}
				min={0}
				max={getMaxHairStyles()}
			/>
			<Slider
				label={lang.get('PrimaryColor')}
				value={data.clothes.hairColor1}
				onChange={(value: number) => updateData(`clothes.hairColor1`, value)}
				max={63}
				min={0}
			/>
			<Slider
				label={lang.get('SecondaryColor')}
				value={data.clothes.hairColor2}
				onChange={(value: number) => updateData(`clothes.hairColor2`, value)}
				max={63}
				min={0}
			/>
			{data.gender === 'male' && (
				<React.Fragment>
					<Subheader label={lang.get('Beard')} />
					<Arrows
						label={lang.get('Style')}
						value={data.clothes.beardModel === 255 ? -1 : data.clothes.beardModel}
						formatValue={(val: number) =>
							val === -1 ? lang.get('NoBeard') : `Model ${val + 1}`
						}
						onChange={(value: number) =>
							updateData(`clothes.beardModel`, value === -1 ? 255 : value)
						}
						min={-1}
						max={28}
					/>
					<Slider
						label={lang.get('Color')}
						value={data.clothes.beardColor}
						onChange={(value: number) => updateData(`clothes.beardColor`, value)}
						min={0}
						max={63}
					/>
				</React.Fragment>
			)}
			<Subheader label={lang.get('Eyes')} />
			<Slider
				label={lang.get('Color')}
				value={data.clothes.eyeColor}
				onChange={(value: number) => updateData(`clothes.eyeColor`, value)}
				min={0}
				max={13}
			/>
			<Slider
				label={lang.get('Size')}
				value={data.clothes.eyeSize * 100}
				onChange={(value: number) => updateData(`clothes.eyeSize`, value / 100)}
				min={-100}
				max={100}
			/>
			<Subheader label={lang.get('Eyebrows')} />
			<Arrows
				label={lang.get('Style')}
				value={data.clothes.eyebrows}
				formatValue={(val: number) => `Model ${val + 1}`}
				onChange={(value: number) => updateData(`clothes.eyebrows`, value)}
				max={33}
				min={0}
			/>
			<Slider
				label={lang.get(`Color`)}
				value={data.clothes.eyebrowsColor}
				onChange={(value: number) => updateData(`clothes.eyebrowsColor`, value)}
				min={0}
				max={63}
			/>
			<Slider
				label={lang.get('BrowHeight')}
				value={data.clothes.browHeight * 100}
				onChange={(value: number) => updateData(`clothes.browHeight`, value / 100)}
				min={-100}
				max={100}
			/>
			<Slider
				label={lang.get('BrowWidth')}
				value={data.clothes.browWidth * 100}
				onChange={(value: number) => updateData(`clothes.browWidth`, value / 100)}
				min={-100}
				max={100}
			/>
		</React.Fragment>
	);
};

export default Step;
