import React from 'react';

// Create the language pack..
import ComponentLanguages from './index.languages';
import { createComponentLanguage, getComponentLanguage } from '@/utils/helpers';
const TranslationPack = createComponentLanguage('profiles.inventoryStats', ComponentLanguages);

const Component = () => {
	const lang = getComponentLanguage(TranslationPack);

	return (
		<React.Fragment>
			<div className="block-inventory-info">
				<div className="component-card">
					<div className="component-heading">{lang.get('heading')}</div>
					<div className="entries">
						<div className="entry">
							<div className="icon">
								<i className="fa-regular fa-table-cells-large elm"></i>
							</div>
							<div className="label">{lang.get('pagesUnlocked')}</div>
							<div className="value">1/5</div>
						</div>

						<div className="entry">
							<div className="icon">
								<i className="fa-solid fa-box elm"></i>
							</div>
							<div className="label">{lang.get('itemSlots')}</div>
							<div className="value">23/50</div>
						</div>
					</div>
				</div>
			</div>
		</React.Fragment>
	);
};

export default Component;
