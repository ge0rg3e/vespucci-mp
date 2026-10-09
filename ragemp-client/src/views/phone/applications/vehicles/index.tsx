import React, { useContext, useEffect, useState, createContext, useRef } from 'react';
import { fakeRPCEventResponse, interpetingRPCEvent, logError } from '@/utils/helpers';
import lodash from 'lodash';

// For local debugging and development on localhost
import { main as FakeResponse } from './responses';

// Screens
import List from './screens/list';
import Menu from './screens/menu';
import Actions from './screens/actions';
import Information from './screens/information';

// Components
import ScreenLoading from '@phone/components/ui/loadingScreen';
import NavigationFooter from '@phone/components/ui/navigationFooter';

// Language

import * as i18n from '@vmp/i18n';
import LanguagePack from './language';

// Language translation

const languagePackId = `PHONE_APP_VEHICLES_ROOT`;
i18n.createLanguagePack(languagePackId, LanguagePack);

import { PhoneState } from '@phone/index';

const mappedScreens: FixableAny = {
	list: (props: ExpectedAny) => <List {...props} />,
	menu: (props: ExpectedAny) => <Menu {...props} />,
	actions: (props: ExpectedAny) => <Actions {...props} />,
	information: (props: ExpectedAny) => <Information {...props} />
};

// Context

const Context = createContext({});
export const AppState: ExpectedAny = () => useContext(Context);

const ExportingComponent = () => {
	const [loadingData, setLoadingData] = useState(false);
	const [screen, setScreen] = useState('list');
	const { uiState, setUiState, closeApplication } = PhoneState();
	const [data, setData] = useState<ExpectedAny>(null);
	const [selectedVehicle, setSelectedVehicle] = useState<ExpectedAny>(undefined);
	const lang = i18n.getLanguagePack(languagePackId, window.language);
	// const lang = i18n.getLanguagePack(languagePackId, 'RO');

	const refs = useRef({
		data,
		selectedVehicle
	});

	useEffect(() => {
		refs.current = {
			data,
			selectedVehicle
		};
	}, [data, selectedVehicle]);

	const updateData = (path: string, value: ExpectedAny) => {
		setData((currentState: ExpectedAny) => {
			const obj = { ...currentState };
			lodash.set(obj, `${path}`, value);
			return obj;
		});
	};

	const loadAppData = async () => {
		try {
			setLoadingData(true);
			setUiState('loading', true);
			fakeRPCEventResponse('Server', 'getVehiclesAppData', 100, FakeResponse);
			const res: ExpectedAny = await interpetingRPCEvent('Server', 'getVehiclesAppData');
			setData(res);
			setSelectedVehicle(0);
			setScreen(res.vehicles.length > 1 ? 'list' : 'menu');
			setUiState('loading', false);
			setLoadingData(false);
		} catch (err) {
			await logError('APP_VEHICLES_LOAD', err);
			setData(undefined);
			closeApplication();
		}
	};

	const refreshAppData = async () => {
		try {
			const res = await interpetingRPCEvent('Server', 'getVehiclesAppData');

			if (res.vehicles.length < 1) {
				closeApplication();
				return false;
			}

			if (refs.current.selectedVehicle !== null) {
				const currentVehicle = refs.current.data
					? refs.current.data.vehicles[refs.current.selectedVehicle]
					: null;

				if (
					currentVehicle &&
					!res.vehicles.find((v: FixableAny) => v.id === currentVehicle.id)
				) {
					setScreen('list');
					setSelectedVehicle(null);
				}
			}

			setData(res);
		} catch (err) {
			await logError(`APP_VEHCILES_REFRESH`, err);
			closeApplication();
		}
	};

	const sendEventServer = async (eventName = '', extraPayload = {}, callInstead = false) => {
		const func = callInstead ? window.rpc.callServer : window.rpc.triggerServer;
		const eventTitle = `onVehicleAction:${eventName}`;

		const payload = JSON.stringify({
			id: data && data.vehicles[selectedVehicle] ? data.vehicles[selectedVehicle].id : null,
			...extraPayload
		});

		if (callInstead) {
			await func(eventTitle, payload);
		} else {
			func(eventTitle, payload);
		}
	};

	useEffect(() => {
		loadAppData();
		window.rpc.on(`requestAppDataUpdate`, refreshAppData);
		return () => {
			window.rpc.off(`requestAppDataUpdate`, refreshAppData);
		};
		// eslint-disable-next-line
	}, []);

	const RenderedComponent = mappedScreens[screen];

	const ContextProps = {
		data,
		vehicleSelected: data ? data.vehicles[selectedVehicle] : null,
		setData,
		setScreen,
		screen,
		updateData,
		setSelectedVehicle,
		sendEventServer,
		lang
	};

	const navigationFooter = [
		{
			icon: `fa-solid fa-house`,
			payload: {
				screen: `menu`
			},
			selected: screen === 'menu' || screen == 'list' ? true : false
		},
		{
			icon: `fa-solid fa-bars`,
			payload: {
				screen: `actions`
			},
			selected: screen === 'actions'
		},
		{
			icon: `fa-solid fa-circle-info`,
			payload: {
				screen: `information`
			},
			selected: screen === 'information'
		}
	];

	const onNavigationSelected = (entry: FixableAny) => {
		if (uiState.loading) return false; // It means the data is not loaded yet and we don't want them to move too fast and crash.
		setScreen(entry.payload.screen);
	};

	const isLoading = data === null || selectedVehicle === undefined || loadingData;

	return (
		<React.Fragment>
			<Context.Provider value={ContextProps}>
				<ScreenLoading loading={isLoading} delayLoadingIcon={500}>
					<RenderedComponent />
					{!isLoading && screen !== 'list' && (
						<NavigationFooter
							variant="icon-only"
							theme="dark"
							items={navigationFooter}
							onItemSelected={onNavigationSelected}
							isSelected={(entry: FixableAny) => entry.selected}
						/>
					)}
				</ScreenLoading>
			</Context.Provider>
		</React.Fragment>
	);
};

export default ExportingComponent;
