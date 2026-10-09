import React from 'react';

// Components
import { Select, MenuItem } from '@mui/material';

// Create the language pack..
import ComponentLanguages from './tabs.language';
import { createComponentLanguage, getComponentLanguage } from '@/utils/helpers';
const TranslationPack = createComponentLanguage('homepage.actions.types', ComponentLanguages);

const Component = (props: ExpectedAny) => {
	const lang = getComponentLanguage(TranslationPack);

	const options = ['factions', 'staff'];

	return (
		<React.Fragment>
			<div className="options">
				<Select value={props.value} onChange={(ev) => props.setValue(ev.target.value)} size="small">
					{options.map((entry, ix) => (
						<MenuItem key={ix} value={entry}>
							{lang.get(entry)}
						</MenuItem>
					))}
				</Select>
			</div>
		</React.Fragment>
	);
};

export default Component;
