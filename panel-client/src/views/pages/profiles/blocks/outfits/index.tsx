import React from 'react';

// Create the language pack..
import ComponentLanguages from './index.languages';
import { createComponentLanguage, getComponentLanguage } from '@/utils/helpers';
const TranslationPack = createComponentLanguage('profiles.outfits', ComponentLanguages);

const Component = () => {
	const lang = getComponentLanguage(TranslationPack);

	return (
		// Idee:
		// sa listam cateva outfits cu niste poze din joc chiar si apoi cand dai click pe outfit, in stanga la inventar sa se puna outfit peste tine. si sa ai maxim 5 outfits.
		<React.Fragment>
			<div className="block-outfits">
				<div className="component-card">
					<div className="component-heading">{lang.get('heading')}</div>
					<div className="component-no-entries">
						<div className="image"></div>
						<div className="label">{lang.get('noOutfits')}</div>
						<div className="description">{lang.get('noOutfits:description')}</div>
					</div>
				</div>
			</div>
		</React.Fragment>
	);
};

export default Component;
