import moment from 'moment';
import React, { useState, useEffect, createContext, useContext } from 'react';
import { getDeviceInfo, interpetingRPCEvent, isDevServer, logError, useStateRef } from './helpers';

const Context = createContext({});
export const AppContext: ExpectedAny = () => useContext(Context);

// Demo
import { AccountData } from '@/views/systems/profile/response';
import { getGameSettings } from '@/views/systems/pause/components/functions';

const SimulatedAccount = {
	...AccountData,
	username: __DEV_USERNAME__ === 'undefined' ? 'N/A' : __DEV_USERNAME__
};

// Check to know when to show them by default for developers
const isDeveloping = window.location.pathname === '/' && window.mp.fake && isDevServer() ? true : false;

let timingInterval: ExpectedAny = null;

const ExportingComponent = ({ children }: ExpectedAny) => {
	const [account, setAccount, accountRef] = useStateRef(window.mp.fake ? SimulatedAccount : null);
	const [gameHudHidden, setGameHudHidden, gameHudHiddenRef] = useStateRef(isDeveloping ? false : true);
	const [isDarkEnvironment, setIsDarkEnvironment] = useState(
		window.mp.fake && window.location.href.includes('?time=night') ? true : false
	);
	const [language, setLanguage] = useState('EN');
	const [takingScreenshotInGame, setTakingScreenshotInGame, takingScreenshotInGameRef] = useStateRef(false);

	const [uiGame, setUiGame] = useState({
		phoneRaised: false
	});

	const [gameSettings, setGameSettings] = useState({});

	const [minimapAnchor, setMinimapAnchor] = useState({
		leftX: 0,
		rightX: 0,
		topY: 0,
		bottomY: 0,
		width: 0,
		height: 0
	});

	const [gameTime, setGameTime] = useState(0);
	const [phoneCall, setPhoneCall, phoneCallRef] = useStateRef(null);
	const [speedometerVisible, setSpeedometerVisible] = useState(false);
	const [alerts, setAlerts] = useState([]);
	const [dialogVisible, setDialogVisible] = useState(false);
	const [phoneVisible, setPhoneVisible] = useState(false);
	const [chatVisible, setChatVisible] = useState(true);
	const [minimapEnlarged, setMinimapEnlarged] = useState(false);
	const [walkieTalkieVisible, setWalkieTalkieVisible] = useState(false);

	const updateFrequentHud = async () => {
		if (window.mp.fake === true) return false;
		const { hour } = !window.mp.fake ? await interpetingRPCEvent(`Client`, `getGameClientTime`) : { hour: 12 };
		const minimapRes: ExpectedAny = await interpetingRPCEvent(`Client`, `getMinimapAnchor`);
		setGameTime(hour);
		setMinimapAnchor(minimapRes);
		setIsDarkEnvironment(checkIsNight(hour));

		// Also set the game settings.
		fetchAndSetGameSettings();
	};

	const checkIsNight = (gameTimePassed = null) => {
		if (window.mp.fake) {
			return true;
		}
		return [0, 1, 2, 3, 4, 5, 20, 21, 22, 23].includes(gameTimePassed ? gameTimePassed : gameTime) ? true : false;
	};

	const onAccountUpdate = (args: ExpectedAny) => {
		const obj = JSON.parse(args);

		setAccount((st: ExpectedAny) => {
			const currentState = st !== null ? st : {};
			return { ...currentState, ...obj };
		});
	};

	const onMinimapEnlarged = async (args: string) => {
		try {
			const { value } = JSON.parse(args);
			setMinimapEnlarged(value);
		} catch (err) {
			await logError(`onMinimapEnlarged`, err);
		}
	};

	useEffect(() => {
		window.account = account;
	}, [account]);

	const fetchAndSetGameSettings = async () => {
		if (!accountRef.current) return false;

		const settings = await getGameSettings();

		if (!settings) return false;

		setGameSettings(settings);
	};

	useEffect(() => {
		timingInterval = setInterval(updateFrequentHud, 5000);
		setTimeout(updateFrequentHud, 2000); // otherwise is gonna look bad

		window.rpc.on(`account:update`, onAccountUpdate);
		window.rpc.on(`minimap:setMinimapEnlarged`, onMinimapEnlarged);
		window.rpc.on(`settings:refreshGameSettings`, fetchAndSetGameSettings);

		return () => {
			if (timingInterval !== null) {
				// Clear interval
				clearInterval(timingInterval);

				// Reset timer id
				timingInterval = null;
			}

			window.rpc.off(`account:update`, onAccountUpdate);
			window.rpc.off(`minimap:setMinimapEnlarged`, onMinimapEnlarged);
			window.rpc.off(`settings:refreshGameSettings`, fetchAndSetGameSettings);
		};
	}, []);

	const passedProps = {
		account,
		accountRef,
		setAccount,
		isDarkEnvironment,
		setIsDarkEnvironment,
		gameHudHidden,
		gameHudHiddenRef,
		setUiGame,
		uiGame,
		language,
		takingScreenshotInGame,
		takingScreenshotInGameRef,
		gameTime,
		minimapAnchor,
		// Phone Call
		phoneCall,
		phoneCallRef,
		setPhoneCall,
		// Speedometer
		speedometerVisible,
		setSpeedometerVisible,
		// Alerts
		alerts,
		setAlerts,
		// Dialog
		dialogVisible,
		setDialogVisible,
		// Phone
		setPhoneVisible,
		phoneVisible,
		// Chat
		chatVisible,
		setChatVisible,
		// Minimap enlarged?
		minimapEnlarged,
		setMinimapEnlarged,
		// Walkie talkie
		walkieTalkieVisible,
		setWalkieTalkieVisible,
		// Game Settings
		gameSettings
	};

	const updateClientDeviceMeta = async () => {
		if (window.mp.fake) {
			return;
		}

		const client_location = await getDeviceInfo();
		const cef_version = __CLIENT_VERSION__;

		window.rpc.callServer(
			'updateClientMeta',
			JSON.stringify({
				client_location,
				cef_version
			})
		);
	};

	const onSetLanguage = (args: ExpectedAny) => {
		const { language } = JSON.parse(args);
		window.language = language;
		moment.locale(language.toLocaleLowerCase());
		setLanguage(window.language);
	};

	const onHudChange = async (args: ExpectedAny) => {
		const { boolean } = JSON.parse(args);
		setGameHudHidden(boolean);
	};

	const onLog = (args: ExpectedAny) => {
		const { title, payload } = JSON.parse(args);
		console.info(`[Log Browser - ${title || 'Unnamed'}]`, payload);
	};

	const onTakingScreenshots = (args: string) => {
		const { boolean } = JSON.parse(args);
		setTakingScreenshotInGame(boolean);
	};

	const onSetDarkEnvironment = (args: ExpectedAny) => {
		const { boolean } = JSON.parse(args);
		setIsDarkEnvironment(boolean);
	};

	useEffect(() => {
		window.rpc.on('takingScreenshotIngame', onTakingScreenshots);
		window.rpc.on('onSetDarkEnvironment', onSetDarkEnvironment);
		window.rpc.on('setLanguage', onSetLanguage);
		window.rpc.on('hideGameHud', onHudChange);
		window.rpc.on(`logBrowser`, onLog);

		updateClientDeviceMeta();

		if (window.mp.fake) {
			// Setting this to default cause otherwise it will undefined
			const predefinedLang: string = __DEV_LANGUAGE__;

			onSetLanguage(JSON.stringify({ language: predefinedLang !== 'undefined' ? predefinedLang : 'EN' }));
		}

		return () => {
			window.rpc.off('takingScreenshotIngame', onTakingScreenshots);
			window.rpc.off('onSetDarkEnvironment', onSetDarkEnvironment);
			window.rpc.off('hideGameHud', onHudChange);
			window.rpc.off('setLanguage', onSetLanguage);
			window.rpc.off(`logBrowser`, onLog);
		};
	}, []);

	return (
		<Context.Provider value={passedProps}>
			<React.Fragment>{children}</React.Fragment>
		</Context.Provider>
	);
};

export default ExportingComponent;

declare global {
	interface Window {
		toasts: FixableAny;
		account: FixableAny;
		language: 'RO' | 'EN';
		phone: Phone;
	}

	interface Mp {
		fake: boolean;
	}
}
