import React, { useContext, createContext, useEffect, useRef } from 'react';

//  Dependencies
import { isDevServer } from '@/utils/helpers';
import { AppContext } from '@/utils/context';

// Components
import API from './components/api';

// Game Features
import Speedometer from './features/speedometer';
import InteractiveButton from './features/interactionButton';
import CopyrightScreenshots from './features/copyrightScreenshots';
import Chat from './features/chat';
import Dialog from './features/dialog';
import Phone from '../phone';
import ProgressBar from './features/progressBar';

// Game Systems that need to be overlay.
import Systems from './systems';

// HUD

import Player from './hud/player';
import Server from './hud/server';
import Calendar from './hud/calendar';
import Location from './hud/location';

// Context
const Context = createContext({});
export const HudState: ExpectedAny = () => useContext(Context);

const Hud = () => {
	// Refs.. @TBD: to remove it fromm the code.
	const refs = useRef({});

	// Variables needed
	const { isDarkEnvironment, gameHudHidden, uiGame } = AppContext();
	const { takingScreenshotInGame, minimapAnchor } = AppContext();

	// Variables calculated
	const showScreenshotScreen =
		window.location.pathname === '/' && gameHudHidden && takingScreenshotInGame ? true : false;

	// For when we work on a different pathname.
	if (window.location.pathname !== '/' && window.mp.fake && isDevServer()) return null;

	// to be cleared later..
	useEffect(() => {
		refs.current = { gameHudHidden };
	}, [gameHudHidden]);

	const passedVariables = {
		isDarkEnvironment,
		minimapAnchor,
		gameHudHidden,
		refs,
		phoneIsRaised: uiGame.phoneRaised
	};

	return (
		<React.Fragment>
			<Context.Provider value={passedVariables}>
				<div className={`game-screen ${gameHudHidden ? `hidden` : `not-hidden`}`}>
					<div className="game-hud">
						{/* Features */}
						<Chat />
						<Player />
						<Speedometer />
						<Dialog />
						<InteractiveButton />
						<ProgressBar />

						{/* HUD */}
						<Server />
						<Calendar />
						<Location />

						{/* Game Systems */}
						<Systems />
					</div>
					<Phone />
				</div>

				{showScreenshotScreen ? <CopyrightScreenshots /> : null}
				<API />
			</Context.Provider>
		</React.Fragment>
	);
};

export default Hud;
