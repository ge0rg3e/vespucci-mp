import React from 'react';
import Clothing from './components/clothing';

// Create the language pack..
import ComponentLanguages from './languages';
import { createComponentLanguage, getComponentLanguage } from '@/utils/helpers';
import { PageState } from '../..';
const TranslationPack = createComponentLanguage('profiles.appearance', ComponentLanguages);

const Component = () => {
	const { data } = PageState();

	const lang = getComponentLanguage(TranslationPack);

	return (
		<React.Fragment>
			<div className="block-appearance">
				<div className="component-card">
					<div className="component-heading">{lang.get('heading')}</div>
					<div className="content">
						<div className="entries left-side grid-appearance">
							{getAppearancesListing('left').map((entry, ix) => (
								<Clothing data={data.clothes} key={ix} type={entry} />
							))}
						</div>

						<div className="ped">
							<div className="image"></div>
						</div>
						<div className="entries right-side grid-appearance">
							{getAppearancesListing('right').map((entry, ix) => (
								<Clothing data={data.clothes} key={ix} type={entry} />
							))}
						</div>
					</div>
				</div>
			</div>
		</React.Fragment>
	);
};

const getAppearancesListing = (side: string) => {
	if (side === 'left') {
		return ['hat', 'mask', 'top', 'undershirt', 'pants', 'shoes'];
	} else {
		return ['glasses', 'earings', 'bracelets', 'watches', 'accessory', 'backpack'];
	}
};

export default Component;
