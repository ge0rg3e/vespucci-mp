import { getLanguagePack } from '@vmp/i18n';
import { AppState } from '../../..';
import React from 'react';

// Components
import { ViewState } from '..';
import Entry from './entry';

const Component = () => {
	const lang = getLanguagePack('PHONE_APP_PHONE_RECENTCALLS', window.language);
	const { recentCalls } = AppState();
	const { filter } = ViewState();

	const filteredCalls = recentCalls.filter((c: RecentCall) => {
		if (filter === 'all') return true;

		if (filter === 'missed') return c.callMissed ? true : false;

		return false;
	});

	const sortedCalls = filteredCalls
		.sort((a: ExpectedAny, b: ExpectedAny) => b.date - a.date)
		.reverse();

	return (
		<React.Fragment>
			<div className="component-list">
				<div className="--container">
					{sortedCalls.map((c: RecentCall, ix: number) => (
						<Entry key={ix} data={c} />
					))}

					{filteredCalls.length < 1 && (
						<div className="no-entries">
							<div className="icon">
								<i className="elm fa-solid fa-phone-xmark"></i>
							</div>
							<div className="heading">{lang.get('List.no-entries.heading')}</div>
							<div className="subheading">
								{lang.get('List.no-entries.subheading')}
							</div>
						</div>
					)}
				</div>
			</div>
		</React.Fragment>
	);
};

export default Component;
