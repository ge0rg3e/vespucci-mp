import React from 'react';

// Contexts
import { AppContext } from '@/utils/context';
import { PauseState } from '../..';

// Language
import { createLanguagePack, getLanguagePack } from '@vmp/i18n';
import LanguagePack from './language';
const LanguageSystemId = 'pause.menu';
createLanguagePack(LanguageSystemId, LanguagePack);

const Component = () => {
	const { isDarkEnvironment } = AppContext();
	const { screen, setScreen } = PauseState();

	const lang = getLanguagePack(LanguageSystemId, window.language);

	const showPauseMenu = (page: 'map' | 'settings') => {
		window.rpc.triggerClient(`pause:showPauseMenu`, JSON.stringify({ pageId: page === 'map' ? -1 : 6 }));
	};

	const resumeGame = () => window.rpc.triggerClient(`pause:resumeGame`);
	const quitGame = () => window.rpc.triggerClient(`pause:quit`);

	const setNewScreen = (screenId: string) => {
		setScreen(screen === screenId ? null : screenId);
	};

	const getEntries = () => {
		const arr = [];

		arr.push({
			label: lang.get('option:serverSettings'),
			selected: screen == 'settings' ? true : false,
			onClick: () => setNewScreen('settings')
		});
		arr.push({ label: lang.get(`option:gameSettings`), onClick: () => showPauseMenu('settings') });
		arr.push({ label: lang.get(`option:gameMap`), onClick: () => showPauseMenu('map') });
		arr.push({ label: lang.get('option:resume'), onClick: resumeGame });
		arr.push({ label: lang.get('option:quit'), onClick: quitGame });

		return arr;
	};

	return (
		<React.Fragment>
			<div className={`component-menu ${isDarkEnvironment && 'night'}`}>
				<div className="header">
					<div className="logo"></div>
				</div>
				<div className="entries">
					{getEntries().map((c, ix) => (
						<div className={`entry ${c.selected && 'selected'}`} key={ix} onClick={c.onClick}>
							{c.label}
						</div>
					))}
				</div>
			</div>
		</React.Fragment>
	);
};

export default Component;
