import React from 'react';

// Context
import { WalkieContext } from '../../..';

// Language
import Language from './mainContent.lang';
import { createLanguagePack, getLanguagePack } from '@vmp/i18n';
createLanguagePack(`walkieTalkie.mainContent`, Language);

const Component = () => {
	const { frequency, enabled, setScreen, changeEnabled } = WalkieContext();
	const lang = getLanguagePack('walkieTalkie.mainContent', window.language);

	const formatFrequency = () => {
		if (frequency === null) return '';
		return frequency.split('-')[1];
	};

	// If is turned off
	if (enabled === false) {
		return (
			<React.Fragment>
				<div className="instruction" onClick={changeEnabled}>
					<div className="line1">{lang.get('TurnedOffLine1')}</div>
					<div className="line2">{lang.get('TurnedOffLine2')}</div>
				</div>
			</React.Fragment>
		);
	}

	// If we are on a frequency
	if (frequency !== null) {
		return (
			<div className="channel">
				<div className="prefix">CH</div>
				<div className="suffix">{formatFrequency()}</div>
			</div>
		);
	}

	if (frequency === null) {
		return (
			<div className="instruction" onClick={() => setScreen('setFrequency')}>
				<div className="line1">{lang.get('NotSetLine1')}</div>
				<div className="line2">{lang.get('NotSetLine2')}</div>
			</div>
		);
	}

	// Default is null.
	return null;
};

export default Component;
