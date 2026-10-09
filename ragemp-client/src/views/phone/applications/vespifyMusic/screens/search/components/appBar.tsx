import React, { useState } from 'react';

// Dependencies
import { key } from '@/definitions/keys';

// Contexts
import { ScreenState } from '..';
import { AppState } from '../../..';

const Component = (props: Props) => {
	const { searchInput, setSearchInput, data, loading, executeSearch } = ScreenState();
	const { goToPreviousScreen } = AppState();

	// A simple anti spam.
	const [antiSpam, setAntiSpam] = useState(false);

	const goBack = () => {
		if (loading) return false;

		goToPreviousScreen();
	};

	const searchNow = () => {
		if (antiSpam) return true;

		// Check..
		executeSearch(data.type);

		// Anti spam.
		setAntiSpam(true);
		setTimeout(() => {
			setAntiSpam(false);
		}, 1000);
	};

	return (
		<React.Fragment>
			<div
				className={`component-search-bar ${props.disabled && 'disabled'}`}
				style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}
			>
				<div className="go-back" onClick={goBack}>
					<i className="icon fa-light fa-arrow-left"></i>
				</div>
				<div className="input-container">
					<input
						disabled={loading}
						value={searchInput}
						onChange={(ev) => setSearchInput(ev.target.value)}
						onKeyDown={(e) => {
							if (key(e, 'Enter')) return searchNow();
						}}
					/>
				</div>
			</div>
		</React.Fragment>
	);
};

type Props = {
	disabled?: boolean;
};

export default Component;
