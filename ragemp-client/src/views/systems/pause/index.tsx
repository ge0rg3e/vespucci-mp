import React, { createContext, useContext, useState } from 'react';

// Components
import API from './components/api';
import MappedScreens from './screens/mappedScreens';
import Menu from './components/menu';

// Contexts
import { AppContext } from '@/utils/context';

// Context
const Context = createContext({});
export const PauseState: ExpectedAny = () => useContext(Context);

const Component = () => {
	const { isDarkEnvironment } = AppContext();
	const [screen, setScreen] = useState(null);
	const [settings, setSettings] = useState<ExpectedAny>(null);

	const ScreenComponent = screen ? MappedScreens[screen] : null;

	const updateSettings = (payload: ExpectedAny) => {
		setSettings((currentState: ExpectedAny) => ({ ...currentState, ...payload }));
	};

	const PassedVariables = {
		// Screen
		screen,
		setScreen,
		// Settigns
		settings,
		setSettings,
		updateSettings
	};

	return (
		<React.Fragment>
			<Context.Provider value={PassedVariables}>
				<div className={`system-pause ${isDarkEnvironment && 'night'}`}>
					<div className="component-container">
						<Menu />
						{/* If this screen has an active screen to see */}
						{screen && MappedScreens[screen] && (
							<div className="component-screen-container">
								<div className={`component-screen screen-${screen} ${isDarkEnvironment && 'night'}`}>
									<ScreenComponent />
								</div>
							</div>
						)}
					</div>
					<API />
				</div>
			</Context.Provider>
		</React.Fragment>
	);
};

export default Component;
