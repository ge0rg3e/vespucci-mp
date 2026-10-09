import React from 'react';

// Dependencies
import { formatNumber, getComponentLanguage, createComponentLanguage } from '@/utils/helpers';
import ComponentLanguages from './headerStats.language';

// Create the language pack..
const TranslationPack = createComponentLanguage('homepage.headerStats', ComponentLanguages);

// Page context
import { PageState } from '../../..';

const Component = () => {
	const { metrics } = PageState();
	const lang = getComponentLanguage(TranslationPack);

	return (
		<React.Fragment>
			<div className="label">{lang.get('StatsHeading')}</div>
			<div className="header">
				<div className="entry">
					<div className="value">{formatNumber(metrics.accountsRegistered)}</div>
					<div className="label">{lang.get('AccountsRegistered')}</div>
				</div>

				<div className="entry">
					<div className="value">{formatNumber(metrics.playersOnline.today)}</div>
					<div className="label">{lang.get('playersToday')}</div>
				</div>

				<div className="entry">
					<div className="value">{formatNumber(metrics.playersOnline.thisWeek)}</div>
					<div className="label">{lang.get('playersThisWeek')}</div>
				</div>

				<div className="entry">
					<div className="value">{formatNumber(metrics.playersRecord.value)}</div>
					<div className="label">{lang.get('playersRecord')}</div>
				</div>
			</div>
		</React.Fragment>
	);
};

export default Component;
