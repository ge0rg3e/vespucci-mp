import React from 'react';

// Language
import Language from './index.lang';
import { createLanguagePack, getLanguagePack } from '@vmp/i18n';
createLanguagePack(`walkieTalkie.menu`, Language);

// Context
import { WalkieContext } from '../..';

const Component = () => {
	const { setScreen } = WalkieContext();

	const lang = getLanguagePack('walkieTalkie.menu', window.language);

	const disabledForNow = async () =>
		window.toast({ type: 'info', message: `This feature will be added later` });

	return (
		<div className="container menu">
			<div className="header">{lang.get('Menu')}</div>

			<div className="options">
				<div className="entry" onClick={() => setScreen('setFrequency')}>
					{lang.get('SetFrequency')}
				</div>
				<div className="entry" onClick={disabledForNow}>
					{lang.get('SwitchToFaction')}
				</div>
				<div className="entry" onClick={disabledForNow}>
					{lang.get('Radio')}
				</div>
			</div>
		</div>
	);
};

export default Component;
