import React from 'react';

// Context
import { WalkieContext } from '../../..';

// Language
import Language from './header.lang';
import { createLanguagePack, getLanguagePack } from '@vmp/i18n';
createLanguagePack(`walkieTalkie.header`, Language);

const Component = () => {
	const lang = getLanguagePack('walkieTalkie.header', window.language);

	const { frequency } = WalkieContext();

	const getType = () => {
		if (frequency === null) return lang.get(`None`);
		if (frequency.split('-')[0] === 'WT') return lang.get(`General`); // WT-50 = walkie talkie general
		if (frequency.split('-')[0] === 'FC') return lang.get(`Faction`); // FC-1 = Faction PD.
		return 'Unknown';
	};

	return (
		<React.Fragment>
			<div className="header">
				<div className="signalBars">
					{frequency === null ? (
						<i className="icon fa-sharp fa-solid fa-signal-slash"></i>
					) : (
						<i className="icon fa-sharp fa-solid fa-signal"></i>
					)}
				</div>
				<div className="type">{getType()}</div>
			</div>
		</React.Fragment>
	);
};

export default Component;
