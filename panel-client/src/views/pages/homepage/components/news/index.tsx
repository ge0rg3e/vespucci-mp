import React from 'react';

// Dependencies
import { getComponentLanguage, createComponentLanguage } from '@/utils/helpers';
import ComponentLanguages from './language';

// Create the language pack..
const TranslationPack = createComponentLanguage('homepage.rankings', ComponentLanguages);

const Component = () => {
	const lang = getComponentLanguage(TranslationPack);

	return (
		<React.Fragment>
			<div className="news">
				<div className="heading">{lang.get('Heading')}</div>
				<div className="nothing-news">{lang.get('NothingNews')}</div>
			</div>
		</React.Fragment>
	);
};

export default Component;
