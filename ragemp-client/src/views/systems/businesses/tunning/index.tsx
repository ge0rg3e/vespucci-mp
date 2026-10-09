import React, { createContext, useContext, useEffect, useState } from 'react';

// Dependencies
import { fakeAwait, logError, useStateRef } from '@/utils/helpers';
import Response from './response';

// Context
const Context = createContext({});
export const ComponentState: ExpectedAny = () => useContext(Context);

// Components
import Controls from './components/controls';
import Balance from './components/balance';
import Menu from './components/menu';

// Screens
import UnableToTune from './screens/unableToTune';
import XenonLights from './screens/xenonLights';
import TireSmoke from './screens/tireSmoke';
import Wheels from './screens/wheels';
import Repair from './screens/repair';
import Paint from './screens/paint';
import Plate from './screens/plate';
import Mods from './screens/mods';
import Neon from './screens/neon';

// Mapping
const ScreensMap: ExpectedAny = {
	unableToTune: UnableToTune,
	xenonLights: XenonLights,
	tireSmoke: TireSmoke,
	wheels: Wheels,
	repair: Repair,
	paint: Paint,
	plate: Plate,
	mods: Mods,
	neon: Neon
};

// Language
import { createLanguagePack, getLanguagePack } from '@vmp/i18n';
import LanguagePack from './components/controls.language';
const LanguageSystemId = 'tunning:controlsLabels';
createLanguagePack(LanguageSystemId, LanguagePack);

const Component = () => {
	const [secondaryOption, setSecondaryOption, secondaryOptionRef] = useStateRef(null);
	const [screen, setScreen, screenRef] = useStateRef(null);
	const [option, setOption, optionRef] = useStateRef(null);
	const [data, setData, dataRef] = useStateRef(null);
	const [loadedControlsImage, setLoadedControlsImage] = useState(false);

	const controlsLang = getLanguagePack(LanguageSystemId, window.language);

	const getSystemData = async () => {
		try {
			if (window.mp.fake) {
				await fakeAwait(800);
				setData({ ...Response });
				return false;
			}

			// Get the data from the server..
			const res = await window.rpc.callServer('tunning:getSystemData');

			setData(res);
		} catch (err) {
			await logError(`tunning:loadData`, err);
		}
	};

	const onKeyDown = ({ key }: ExpectedAny) => {
		// @bugfix: preventing any issue with scrolls.
		const inputFocused = document.activeElement;
		if (inputFocused && ['input', 'textarea'].includes(inputFocused.localName)) return true;

		const KEY = key.toLowerCase();

		// Shortcut so we can do it faster..
		if ([' ', 'r', 't'].includes(KEY) && dataRef.current.isDriver === true) {
			const mappedKeys: ExpectedAny = {
				' ': 'onPurchase',
				r: 'onRemove',
				t: 'onTest'
			};

			document.dispatchEvent(new CustomEvent(`tunning:${mappedKeys[KEY]}`));
		}

		if (key === 'Escape' && screenRef.current === null) {
			leaveSystem();
		}
	};

	const onUpdateSystemData = async (args: ExpectedAny) => {
		try {
			const res = JSON.parse(args);
			setData({ ...dataRef.current, ...res });
		} catch (err) {
			await logError(`tunning:onUpdateSystemData`, err);
		}
	};

	useEffect(() => {
		// Load system data to show up this interface..
		getSystemData();

		// Set up listeners for RAGE:MP
		window.rpc.on('tunning:updateSystemData', onUpdateSystemData);

		// Set up the listeners required for the CEF
		document.addEventListener('keyup', onKeyDown);

		// When dismounting this page we stop listening..
		return () => {
			window.clearToasts();
			document.removeEventListener('keyup', onKeyDown);
			window.rpc.off('tunning:requestUpdateData', onUpdateSystemData);
		};
	}, []);

	const leaveSystem = () => {
		window.rpc.triggerServer(`tunning:leave`);
	};

	const isCurrentMod = (modKey: string, modId: number) => {
		const modIds = data.mods.ids;
		const currentMod = data.vehicle.modifications.mods[modIds[modKey]];
		return currentMod === modId ? true : false;
	};

	const getCurrentMod = (modKey: string, useRef = false) => {
		const val = useRef ? dataRef.current : data;
		const modIds = val.mods.ids;
		const currentMod = val.vehicle.modifications.mods[modIds[modKey]];
		return currentMod;
	};

	const getDefaultControls = () => {
		const arr = [];

		if (data.isDriver) {
			arr.push({
				label: controlsLang.get('navigate'),
				key: 'A & D'
			});

			arr.push({
				label: controlsLang.get('exit'),
				key: 'ESC'
			});

			arr.push({
				label: controlsLang.get('select'),
				key: <i className="icon fa-solid fa-arrow-turn-down-left"></i>
			});
		} else {
			arr.push({
				label: controlsLang.get(data.isVehicle ? 'exit' : 'exitAsPassenger'),
				key: 'ESC'
			});
		}

		return arr;
	};

	const passedVariables = {
		// Data..
		data,
		setData,
		dataRef,
		// Screen
		screen,
		setScreen,
		screenRef,
		// Option selected
		option,
		setOption,
		optionRef,
		// Secondary options
		secondaryOption,
		setSecondaryOption,
		secondaryOptionRef,
		// Dependencies
		isCurrentMod,
		getCurrentMod,
		leaveSystem,
		loadedControlsImage,
		setLoadedControlsImage
	};

	const ScreenComponent = screen && ScreensMap[screen.type] ? ScreensMap[screen.type] : null;

	if (data === null) return null;

	return (
		<React.Fragment>
			<Context.Provider value={passedVariables}>
				<div className="system-tunning">
					<div className="layout-content-area">
						{data.isDriver === true && (
							<React.Fragment>
								<div className="layout-header">
									<div className="wrapper">
										<Menu />
										<Balance />
									</div>
									<div className="component-shadow">
										<img
											className="hidden-img-loader"
											style={{ display: 'none' }}
											src="/assets/images/systems/businesses/tunning/header.png"
											alt=""
											onLoad={(ev: UndefinedAny) =>
												(ev.target.parentNode.className += ` loaded`)
											}
										/>
									</div>
								</div>
								{ScreenComponent && (
									<div className="layout-screen">
										<ScreenComponent />
									</div>
								)}
							</React.Fragment>
						)}
						{screen === null && <Controls keys={getDefaultControls()} />}
					</div>
				</div>
			</Context.Provider>
		</React.Fragment>
	);
};

export default Component;
