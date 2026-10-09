import React, { useState, useEffect } from 'react';
import { TextField, InputAdornment, Switch } from '@mui/material';

// Dependencies
import { ComponentState } from '../..';

// Variables
let searchTimer: UndefinedAny = null;

// Language
import { createLanguagePack, getLanguagePack } from '@vmp/i18n';
import LanguagePack from './search.language';
const LanguageSystemId = 'clothesManagement:List:Search';
createLanguagePack(LanguageSystemId, LanguagePack);

const Component = () => {
	const [inputValue, setInputValue] = useState('');
	const [open, setOpen] = useState(false);
	const { category, setSearchValue, filters, setFilters } = ComponentState();
	const lang = getLanguagePack(LanguageSystemId, window.language);

	const onSearchChanged = (newValue: string) => {
		setInputValue(newValue);

		if (searchTimer !== null) {
			// Clear timeout
			clearTimeout(searchTimer);

			// Reset timer id
			searchTimer = null;
		}

		searchTimer = setTimeout(() => {
			// Callback function
			setSearchValue(newValue);

			// Reset timer id.
			searchTimer = null;
		}, 200);
	};

	// eslint-disable-next-line
	useEffect(() => {
		return () => {
			if (searchTimer !== null) {
				// Clear timeout
				clearTimeout(searchTimer);

				// Reset timer id
				searchTimer = null;
			}
		};
	}, []);

	useEffect(() => {
		setInputValue('');
		setSearchValue('');
	}, [category]);

	const showFilters = () => {
		setOpen((previousOpen) => !previousOpen);
	};

	return (
		<React.Fragment>
			<div className="search-container">
				<TextField
					className="search-input"
					value={inputValue}
					fullWidth={true}
					variant="outlined"
					onChange={(e) => onSearchChanged(e.target.value)}
					placeholder={lang.get('Placeholder')}
					InputProps={{
						endAdornment: (
							<InputAdornment position="end">
								<div
									className={`icon ${
										Object.values(filters).filter((x) => x === true).length >
											0 && 'active'
									}`}
									onClick={showFilters}
								>
									<i className="fa-solid fa-filter-list"></i>
								</div>
							</InputAdornment>
						)
					}}
				/>
			</div>
			{open && (
				<div className="search-filters">
					<div className="switch">
						<Switch
							checked={filters.inStore}
							onChange={() => setFilters({ ...filters, inStore: !filters.inStore })}
						/>
						<div className="label">{lang.get('InStore')}</div>
					</div>
					<div className="switch">
						<Switch
							checked={filters.vipOnly}
							onChange={() => setFilters({ ...filters, vipOnly: !filters.vipOnly })}
						/>
						<div className="label">{lang.get('VIPOnly')}</div>
					</div>
					<div className="switch">
						<Switch
							checked={filters.addonsOnly}
							onChange={() =>
								setFilters({ ...filters, addonsOnly: !filters.addonsOnly })
							}
						/>
						<div className="label">{lang.get('AddonsOnly')}</div>
					</div>
				</div>
			)}
		</React.Fragment>
	);
};

export default Component;
