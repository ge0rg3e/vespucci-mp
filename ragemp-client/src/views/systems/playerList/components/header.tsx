import React, { useState } from 'react';
import { ComponentState } from '..';

// Components
import { TextField } from '@mui/material';

const Header = () => {
	const { getPlayers, tab, lang, search, setSearch } = ComponentState();

	const [isSearching, setIsSearching] = useState(false);

	return (
		<React.Fragment>
			<div className="header">
				<div className="left-side">
					{isSearching === true ? (
						<TextField
							placeholder={lang.get('SearchInput')}
							value={search}
							onChange={(ev) => setSearch(ev.target.value)}
							fullWidth={true}
							variant="standard"
							id="search-bar"
							autoFocus={true}
						/>
					) : (
						<React.Fragment>
							<div className="text">{lang.get('PlayersOnline')}</div>
							<div className="count">
								{lang.get('CountPlayers', { value: getPlayers(tab).length, tab })}
							</div>
						</React.Fragment>
					)}
				</div>
				<div
					key={`key-${isSearching ? `glass` : `xmark`}`}
					className="icon-container"
					onClick={() => {
						setIsSearching(!isSearching);

						setSearch('');
						if (!isSearching === true) {
							const doc = document.getElementById('search-bar');
							if (doc) {
								doc.focus();
							}
						}
					}}
				>
					<i
						className={`elm fa-solid ${
							isSearching === false ? `fa-magnifying-glass` : `fa-xmark`
						}`}
					/>
				</div>
			</div>
		</React.Fragment>
	);
};

export default Header;
