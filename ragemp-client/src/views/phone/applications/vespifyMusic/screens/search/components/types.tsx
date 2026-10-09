import React from 'react';

// Dependencies
import { getLanguagePack } from '@vmp/i18n';

//  Context
import { ScreenState } from '..';
import { AppState } from '../../..';

const Component = (props: Props) => {
	const { data, executeSearch, loading } = ScreenState();
	const { updateScreenPayload } = AppState();

	// Types..
	const types = ['all', 'song', 'album', 'playlist', 'artist'];

	// Language pack
	const lang = getLanguagePack('phone.vespifyMusic.search', window.language);

	const changeTypeTo = (value: ExpectedAny) => {
		if (loading) return false;

		// Search entries with this new type
		executeSearch(value);

		// Update screen payload..
		updateScreenPayload({ type: value });
	};

	return (
		<React.Fragment>
			<div className={`component-searchType ${props.disabled && 'disabled'}`}>
				{types.map((id, ix) => (
					<div className={`entry ${id === data.type ? 'active' : ''}`} onClick={() => changeTypeTo(id)} key={ix}>
						<div className="content">{lang.get(`Types.${id}`)}</div>
					</div>
				))}
			</div>
		</React.Fragment>
	);
};

type Props = {
	disabled?: boolean;
};

export default Component;
