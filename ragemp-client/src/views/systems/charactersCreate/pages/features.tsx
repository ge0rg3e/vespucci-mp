import React from 'react';
import { CharContext } from '../utils/context';

// Form Elements
import Arrows from '../components/arrows';
import Subheader from '../components/subheader';

// Lanaguage translation
import * as i18n from '@vmp/i18n';
import LanguagePack from './features.language';
const LanguagePackId = `SYSTEM_CHAR_CREATOR_PAGE_FEATURES`;

i18n.createLanguagePack(LanguagePackId, LanguagePack);

const Step = () => {
	const { data, updateData } = CharContext();
	const lang = i18n.getLanguagePack(LanguagePackId, window.language);

	return (
		<React.Fragment>
			<Subheader label={lang.get('Skin')} />
			<Arrows
				label={lang.get('Moles')}
				value={data.clothes.moles === 255 ? -1 : data.clothes.moles}
				formatValue={(val: number) =>
					val === -1 ? lang.get('None') : lang.get('Variant', { value: val })
				}
				onChange={(value: number) =>
					updateData(`clothes.moles`, value === -1 ? 255 : value)
				}
				min={-1}
				max={17}
			/>
			<Arrows
				label={lang.get('Blemishes')}
				value={data.clothes.blemishes === 255 ? -1 : data.clothes.blemishes}
				formatValue={(val: number) =>
					val === -1 ? lang.get('None') : lang.get('Variant', { value: val })
				}
				onChange={(value: number) =>
					updateData(`clothes.blemishes`, value === -1 ? 255 : value)
				}
				min={-1}
				max={11}
			/>
			<Arrows
				label={lang.get('Ageing')}
				value={data.clothes.ageing === 255 ? -1 : data.clothes.ageing}
				formatValue={(val: number) =>
					val === -1 ? lang.get('None') : lang.get('Variant', { value: val })
				}
				onChange={(value: number) =>
					updateData(`clothes.ageing`, value === -1 ? 255 : value)
				}
				min={-1}
				max={14}
			/>
			<Subheader label={lang.get('Chest')} />

			<Arrows
				label={lang.get('ChestHair')}
				value={data.clothes.chestHair === 255 ? -1 : data.clothes.chestHair}
				formatValue={(val: number) =>
					val === -1 ? lang.get('None') : lang.get('Variant', { value: val })
				}
				onChange={(value: number) =>
					updateData(`clothes.chestHair`, value === -1 ? 255 : value)
				}
				min={-1}
				max={16}
			/>
		</React.Fragment>
	);
};

export default Step;
