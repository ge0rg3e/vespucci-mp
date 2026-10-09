import React, { useState } from 'react';

// Context
import { AppState } from '../../..';
import { ScreenState } from '..';
import { key } from '@/definitions/keys';
import { getLanguagePack } from '@vmp/i18n';

const Component = (props: Props) => {
	const lang = getLanguagePack('phone.vespifyMusic.home', window.language);

	// Context needed
	const { pushScreen } = AppState();
	const { loading } = ScreenState();

	// Variables
	const [inputValue, setInputValue] = useState('');
	const [searching, setSearching] = useState(false);

	const submitSearch = () => {
		// If they haven't written anything.
		if (inputValue.trim().length < 1) return false;

		// Move to the other screen to start search.
		pushScreen(`search`, { query: inputValue, type: 'all' });
	};

	const showSearchBar = () => {
		if (loading === true) return false;

		setSearching(true);
	};

	const closeSearchBar = () => {
		if (loading === true) return false;

		setSearching(false);
	};

	// If we are searching
	if (searching === true) {
		return (
			<React.Fragment>
				<div className="app-bar searching">
					<div className="cancel-button" onClick={closeSearchBar}>
						<i className="icon fa-regular fa-xmark"></i>
					</div>
					<div className="input-container">
						<input
							onChange={(ev) => setInputValue(ev.target.value)}
							placeholder={lang.get('AppBar.Search')}
							value={inputValue}
							onKeyDown={(e) => {
								if (key(e, 'Enter')) return submitSearch();
							}}
						/>
					</div>
				</div>
			</React.Fragment>
		);
	}

	return (
		<React.Fragment>
			<div className={`app-bar ${props.disabled && 'disabled'}`}>
				<div className="logo">
					<div className="image"></div>
					<div className="text">Music</div>
				</div>
				<div className="buttons">
					<div className="entry" onClick={showSearchBar}>
						<i className="elm fa-solid fa-magnifying-glass"></i>
					</div>
				</div>
			</div>
		</React.Fragment>
	);
};

type Props = {
	disabled?: boolean;
};

export default Component;
