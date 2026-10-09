import { getLanguagePack } from '@vmp/i18n';
import { AppState } from '../../..';
import { ViewState } from '..';
import React from 'react';

const Component = () => {
	const { filter, setFilter, editing, setEditing, clearEntries } = ViewState();
	const lang = getLanguagePack('PHONE_APP_PHONE_RECENTCALLS', window.language);

	const { recentCalls } = AppState();

	const entries = ['all', 'missed'];

	return (
		<React.Fragment>
			<div className="component-app-header">
				{editing && recentCalls.length > 0 && (
					<div className="left-side">
						<div className={`entry`} onClick={clearEntries}>
							<div className="label">{lang.get('Header.left-side')}</div>
						</div>
					</div>
				)}

				<div className="filters">
					{entries.map((key, ix) => (
						<div
							key={ix}
							className={`--entry ${filter === key && 'active'}`}
							onClick={() => setFilter(key)}
						>
							{lang.get(`Header.filters.${key}`)}
						</div>
					))}
				</div>
				<div className="right-side">
					{((!editing && recentCalls.length > 0) || editing) && (
						<React.Fragment>
							<div className={`entry`} onClick={() => setEditing(!editing)}>
								<div className="label">
									{lang.get('Header.right-side', { editing })}
								</div>
							</div>
						</React.Fragment>
					)}
				</div>
			</div>
		</React.Fragment>
	);
};

export default Component;
