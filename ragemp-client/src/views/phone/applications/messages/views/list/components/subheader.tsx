import { getLanguagePack } from '@vmp/i18n';
import { ViewState } from '..';
import React from 'react';

const Component = () => {
	const lang = getLanguagePack('PHONE_APP_MESSAGES_LIST', window.language);
	const { searchValue, setSearchValue } = ViewState();

	return (
		<React.Fragment>
			<div className="component-sub-header">
				<div className="heading">{lang.get('Subheader.heading')}</div>
				<input
					placeholder={lang.get('Subheader.search-bar.placeholder')}
					onChange={(ev) => setSearchValue(ev.target.value)}
					className="search-bar"
					value={searchValue}
					type="text"
				/>
			</div>
		</React.Fragment>
	);
};

export default Component;
