import React, { useEffect, useState } from 'react';

// Dependencies
import { key } from '@/definitions/keys';
import { logError } from '@/utils/helpers';

// Context
import { AppState } from '../../..';

// Language
import * as i18n from '@vmp/i18n';
import LanguagePack from './searchBar.lang';

// Language translation
const languagePackId = `phone.vespify.appBar`;
i18n.createLanguagePack(languagePackId, LanguagePack);

// Variables needed
let timeoutCooldownId: ExpectedAny = null;

const Component = () => {
	const { screen, setScreen, search, setSearch } = AppState();
	const [cooldown, setCooldown] = useState(false);

	// Get translation
	const lang = i18n.getLanguagePack(languagePackId, window.language);

	const startSearch = async () => {
		try {
			if (search.inputValue.trim().length < 1) return false;

			// If they're in cooldown.
			if (cooldown) return false;

			// Set the new screen
			if (screen.id !== 'search') {
				setScreen({
					id: 'search',
					payload: {
						query: search.inputValue
					}
				});
			}

			// If they're on this scren..
			if (screen.id === 'search') {
				// Scroll up if needed
				const doc = document.getElementById(`screen-scroll-container`);

				if (doc) {
					doc.scrollTop = 0;
				}
			}

			// Execute event
			document.dispatchEvent(
				new CustomEvent(`phone.vespify@executeSearch`, {
					detail: {
						query: search.inputValue
					}
				})
			);

			setCooldown(true);

			timeoutCooldownId = setTimeout(() => {
				setCooldown(false);
			}, 1000);
		} catch (err) {
			await logError(`phone.vespify@appBar.search`, err);
		}
	};

	useEffect(() => {
		return () => {
			if (timeoutCooldownId !== null) {
				// Clear
				clearTimeout(timeoutCooldownId);

				// Reset variable
				timeoutCooldownId = null;
			}
		};
	}, []);

	return (
		<React.Fragment>
			<div className={`component-search-bar`}>
				<input
					type="text"
					className="input"
					value={search.inputValue}
					onChange={(ev) =>
						setSearch((currentState: ExpectedAny) => ({
							...currentState,
							inputValue: ev.target.value
						}))
					}
					placeholder={lang.get('InputPlaceholder')}
					onKeyDown={(e) => {
						if (key(e, 'Enter')) return startSearch();
					}}
				/>
				<div className="icon-appendment" onClick={startSearch}>
					<div className="elm">
						<i className="fa-solid fa-magnifying-glass"></i>
					</div>
				</div>
			</div>
		</React.Fragment>
	);
};

export default Component;
