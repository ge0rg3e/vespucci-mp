import React, { useContext, useEffect, useState, createContext } from 'react';
import { fakeRPCEventResponse, interpetingRPCEvent, logError } from '@/utils/helpers';
import lodash from 'lodash';

// For local debugging and development on localhost
import { main as FakeResponse } from './responses';

// Language

import * as i18n from '@vmp/i18n';
import LanguagePack from './language';

// Language translation

const languagePackId = `PHONE_APP_MY_RENT`;
i18n.createLanguagePack(languagePackId, LanguagePack);

// Screens
import Menu from './screens/menu';

// Layout components

import { PhoneState } from '@phone/index';

const mappedScreens: ExpectedAny = {
	menu: (props: ExpectedAny) => <Menu {...props} />
};

// Context

const Context = createContext({});
export const AppState: ExpectedAny = () => useContext(Context);

const ExportingComponent = () => {
	const lang = i18n.getLanguagePack(languagePackId, window.language);
	// const lang = i18n.getLanguagePack(languagePackId, 'RO');
	const [data, setData] = useState<ExpectedAny>({
		houseData: {},
		houseMeta: {
			garage: null,
			houseAddress: lang.get('LoadingAddress')
		}
	});

	const [screen, setScreen] = useState('menu');
	const { setUiState, closeApplication } = PhoneState();

	const updateData = (path: string, value: ExpectedAny) => {
		setData((currentState: ExpectedAny) => {
			const obj = { ...currentState };
			lodash.set(obj, `houseData.${path}`, value);
			return obj;
		});
	};

	const loadRentData = async () => {
		try {
			setUiState('loading', true);
			fakeRPCEventResponse('Server', 'getRentAppData', 400, FakeResponse);
			const res = await interpetingRPCEvent('Server', 'getRentAppData');
			setData(res);
			setUiState('loading', false);
		} catch (err) {
			await logError('APP_RENT_LOAD', err);
			setData(undefined);
			closeApplication();
		}
	};

	useEffect(() => {
		loadRentData();
		// eslint-disable-next-line
	}, []);

	const refreshHouseData = async () => {
		const res = await interpetingRPCEvent('Server', 'getRentAppData');
		setData(res);
	};

	useEffect(() => {
		window.rpc.on(`requestAppDataUpdate`, refreshHouseData);
		return () => {
			window.rpc.off(`requestAppDataUpdate`, refreshHouseData);
		};
		// eslint-disable-next-line
	}, []);

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
			</Context.Provider>
		</React.Fragment>
	);
};

export default ExportingComponent;
