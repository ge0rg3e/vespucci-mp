import React from 'react';

// Components
import Entry from './components/entry';

// Create the language pack..
import ComponentLanguages from './languages';
import { createComponentLanguage, getComponentLanguage } from '@/utils/helpers';
const TranslationPack = createComponentLanguage('profiles.skills', ComponentLanguages);

const Component = () => {
	const lang = getComponentLanguage(TranslationPack);

	const entries = [
		{
			label: 'Farmer',
			level: 1,
			currentAmount: 10,
			targetAmount: 100
		},
		{
			label: 'Trucker',
			level: 1,
			currentAmount: 10,
			targetAmount: 500
		},
		{
			label: 'Bus Driver',
			level: 1,
			currentAmount: 10,
			targetAmount: 12200
		},
		{
			label: 'Pizza Boy',
			level: 1,
			currentAmount: 10,
			targetAmount: 4200
		}
		// {
		// 	label: 'Garbage Man',
		// 	level: 1,
		// 	experience: 40,
		// 	currentAmount: 10,
		// 	targetAmount: 433
		// }
	];
	return (
		<div className="block-skills">
			<div className="component-card">
				<div className="component-heading">{lang.get('heading')}</div>
				<div className="entries">
					{entries.map((entry, ix) => (
						<Entry data={entry} key={ix} />
					))}
				</div>
			</div>
		</div>
	);
};

export default Component;
