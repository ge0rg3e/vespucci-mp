import React, { useContext, useEffect, useState, createContext } from 'react';
import { fakeRPCEventResponse, interpetingRPCEvent, logError } from '@/utils/helpers';
import lodash from 'lodash';

// For local debugging and development on localhost
import { main as FakeResponse } from './responses';

// Language

import * as i18n from '@vmp/i18n';
import LanguagePack from './language';

// Language translation

const languagePackId = `PHONE_APP_MY_HOUSE`;
i18n.createLanguagePack(languagePackId, LanguagePack);

// Screens
import Menu from './screens/menu';
import Information from './screens/information';
import Renting from './screens/renting';
import Upgrades from './screens/upgrades';
import Interiors from './screens/interiors';

// Layout components
import NavigationFooter from '@phone/components/ui/navigationFooter';

import { PhoneState } from '@phone/index';

const mappedScreens: ExpectedAny = {
	menu: (props: ExpectedAny) => <Menu {...props} />,
	information: (props: ExpectedAny) => <Information {...props} />,
	renting: (props: ExpectedAny) => <Renting {...props} />,
	upgrades: (props: ExpectedAny) => <Upgrades {...props} />,
	interiors: (props: ExpectedAny) => <Interiors {...props} />
};

// Context

const Context = createContext({});
export const AppState: ExpectedAny = () => useContext(Context);

const ExportingComponent = () => {
	const lang = i18n.getLanguagePack(languagePackId, window.language);
	// const lang = i18n.getLanguagePack(languagePackId, 'RO');
	const [screen, setScreen] = useState('menu');
	const { uiState, setUiState, closeApplication } = PhoneState();
	const [data, setData] = useState<ExpectedAny>({
		houseData: {},
		houseMeta: {
			garage: null,
			houseAddress: lang.get('LoadingAddress')
		}
	});

	const updateData = (path: string, value: ExpectedAny) => {
		setData((currentState: ExpectedAny) => {
			const obj = { ...currentState };
			lodash.set(obj, `houseData.${path}`, value);
			return obj;
		});

		window.rpc.triggerServer(
			'onHouseAppDataChanges',
			JSON.stringify({
				path,
				value
			})
		);
	};

	const loadHouseData = async () => {
		try {
			setUiState('loading', true);
			fakeRPCEventResponse('Server', 'getHouseAppData', 200, FakeResponse);
			const res = await interpetingRPCEvent('Server', 'getHouseAppData');
			setData(res);
			setUiState('loading', false);
		} catch (err) {
			await logError('APP_HOUSE_LOAD', err);
			setData(undefined);
			closeApplication();
		}
	};

	const refreshHouseData = async () => {
		const res = await interpetingRPCEvent('Server', 'getHouseAppData');
		setData(res);
	};

	useEffect(() => {
		loadHouseData();
		window.rpc.on(`requestAppDataUpdate`, refreshHouseData);
		return () => {
			window.rpc.off(`requestAppDataUpdate`, refreshHouseData);
		};
		// eslint-disable-next-line
	}, []);

	const navigationFooter = [
		{
			label: lang.get('Navigation:Menu'),
			icon: `fa-solid fa-house`,
			payload: {
				screen: `menu`
			},
			selected: screen === 'menu'
		},
		{
			label: lang.get('Navigation:Information'),
			icon: `fa-solid fa-clipboard`,
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

	const RenderedComponent = mappedScreens[screen];

	const ContextProps = {
		data,
		setData,
		setScreen,
		screen,
		lang,
		updateData
	};

	return (
		<React.Fragment>
			<Context.Provider value={ContextProps}>
				<RenderedComponent />
				{navigationFooter.find((x) => x.payload.screen === screen) && (
					<NavigationFooter
						theme="light"
						items={navigationFooter}
						onItemSelected={onNavigationSelected}
						isSelected={(entry: FixableAny) => entry.payload.screen === screen}
					/>
				)}
			</Context.Provider>
		</React.Fragment>
	);
};

export default ExportingComponent;
