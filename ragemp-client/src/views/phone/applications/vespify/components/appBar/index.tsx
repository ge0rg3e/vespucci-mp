import React, { useState } from 'react';

// Components
import SearchBar from './components/searchBar';
import Logo from './components/logo';

// Context
import { AppState } from '../../';

const Component = (props: Props) => {
	const { screen, search, setSearch } = AppState();

	const expandSearch = () => {
		if (props.loading) return false;

		setSearch((currentState: ExpectedAny) => ({
			...currentState,
			expanded: true
		}));
	};

	// If is enabled search mode it's gonna look different
	if (search.expanded) {
		return (
			<div className="component-appbar searchMode">
				<div
					className="component-btn-cancel-search"
					onClick={() =>
						setSearch((currentState: ExpectedAny) => ({
							...currentState,
							expanded: false
						}))
					}
				>
					<i className="fa-solid fa-arrow-left"></i>
				</div>
				<SearchBar />
			</div>
		);
	}

	const isSearchResultsMode = !search.expanded && screen.id === 'search';

	// If they aren't in search mode & they're on a screen of interest and also searched for something.
	if ((!search.expanded && screen.id === 'search') || isSearchResultsMode) {
		return (
			<div className="component-appbar withSearchBar">
				<Logo withText={false} />
				<SearchBar />
			</div>
		);
	}

	return (
		<React.Fragment>
			<div className={`component-appbar`}>
				<Logo withText={true} disableRedirect={props.loading} />
				<div className="buttons">
					<div className="entry" onClick={expandSearch}>
						<div className="icon">
							<i className="elm fa-solid fa-magnifying-glass"></i>
						</div>
					</div>
				</div>
			</div>
		</React.Fragment>
	);
};

type Props = {
	loading?: boolean;
};

export default Component;
