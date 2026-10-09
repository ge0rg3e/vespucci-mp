import { Input } from '@mui/material';
import React from 'react';
import InputAdornment from '@mui/material/InputAdornment';

// Language
import * as i18n from '@vmp/i18n';
import Language from './search.lang';
import { DealershipState } from '..';
const languagePackId = `SYSTEM_DEALERSHIP_CATEGORIES_SEARCH`;
i18n.createLanguagePack(languagePackId, Language);

const Component = () => {
	const lang = i18n.getLanguagePack(languagePackId, window.language);

	const { setSearching, search } = DealershipState();

	return (
		<React.Fragment>
			<div className="search-bar">
				<Input
					startAdornment={
						<InputAdornment position="start">
							<div className="icon">
								<i className="elm fa-solid fa-magnifying-glass"></i>
							</div>
						</InputAdornment>
					}
					fullWidth={true}
					placeholder={lang.get('Placeholder')}
					value={search}
					onChange={(e) => setSearching(e.target.value)}
				/>
			</div>
		</React.Fragment>
	);
};

export default Component;
