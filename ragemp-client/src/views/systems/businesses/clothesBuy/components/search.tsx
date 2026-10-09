import React, { useEffect, useState } from 'react';
import { ComponentState } from '..';

// Components
import { TextField, InputAdornment, Switch } from '@mui/material';

let searchTimer: ExpectedAny = null;

// Language
import { createLanguagePack, getLanguagePack } from '@vmp/i18n';
import LanguagePack from './search.language';
const LanguageSystemId = 'buyClothes:search';
createLanguagePack(LanguageSystemId, LanguagePack);

const Component = () => {
	const { search, setSearch, category } = ComponentState();
	const [searchInput, setSearchInput] = useState(search.text);
	const [displayFilters, setDisplayFilters] = useState(false);
	const lang = getLanguagePack(LanguageSystemId, window.language);

	useEffect(() => {
		if (searchTimer !== null) {
			// Clear timeout
			clearTimeout(searchTimer);

			// Reset timer id
			searchTimer = null;
		}
		searchTimer = setTimeout(() => {
			// Callback function
			setSearch((currentState: ExpectedAny) => ({ ...currentState, text: searchInput }));

			// Reset timer id
			searchTimer = null;
		}, 500);

		return () => {
			if (searchTimer !== null) {
				// Clear timoeut
				clearTimeout(searchTimer);

				// Reset timer id
				searchTimer = null;
			}
		};
	}, [searchInput]);

	useEffect(() => {
		setSearchInput('');
	}, [category]);

	const updateFilter = (key: string, value: ExpectedAny) => {
		const newSearch: ExpectedAny = { ...search };

		newSearch.filters[key] = value;

		setSearch(newSearch);
	};

	return (
		<React.Fragment>
			<div className="comp-search">
				<div className="comp-content">
					<TextField
						variant="outlined"
						fullWidth={true}
						placeholder={lang.get('searchPlaceholder')}
						value={searchInput}
						onChange={(ev) => setSearchInput(ev.target.value)}
						InputProps={{
							endAdornment: (
								<InputAdornment position="end">
									<div
										className={`icon ${
											Object.values(search.filters).filter((x) => x === true)
												.length > 0 && 'active'
										}`}
										onClick={() => setDisplayFilters(!displayFilters)}
									>
										<i className="fa-solid fa-filter-list"></i>
									</div>
								</InputAdornment>
							)
						}}
					/>
				</div>
			</div>
			{displayFilters && (
				<div className="comp-filters">
					<div className="entry">
						<div className="label">VIP</div>
						<Switch
							checked={search.filters.vipOnly}
							onChange={() => updateFilter('vipOnly', !search.filters.vipOnly)}
						/>
					</div>
					<div className="entry">
						<div className="label">Addon</div>
						<Switch
							checked={search.filters.addonOnly}
							onChange={() => updateFilter('addonOnly', !search.filters.addonOnly)}
						/>
					</div>

					<div className="entry">
						<div className="label">{lang.get('WithinMyBudget')}</div>
						<Switch
							checked={search.filters.withinBudget}
							onChange={() =>
								updateFilter('withinBudget', !search.filters.withinBudget)
							}
						/>
					</div>
				</div>
			)}
		</React.Fragment>
	);
};

export default Component;
