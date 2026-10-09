import { fakeRPCEventResponse, interpetingRPCEvent, logError } from '@/utils/helpers';
import React, { useContext, useState, createContext, useEffect } from 'react';
import lodash from 'lodash';

// For local debugging and development on localhost
import FakeResponse from './responses';

// Language
import * as i18n from '@vmp/i18n';
import LanguagePack from './language';

// Language translation
const languagePackId = `PHONE_APP_BETA_TESTING`;
i18n.createLanguagePack(languagePackId, LanguagePack);

// Screens
import Menu from './screens/menu';

// Layout components
import { PhoneState } from '@phone/index';

const mappedScreens: FixableAny = {
	menu: (props: ExpectedAny) => <Menu {...props} />
};

// Context
const Context = createContext({});
export const AppState: ExpectedAny = () => useContext(Context);

const ExportingComponent = () => {
	const lang = i18n.getLanguagePack(languagePackId, window.language);
	const [screen] = useState('menu');

	const [data, setData] = useState<ExpectedAny>({
		teleports: [],
		currentValues: {}
	});

	const { setUiState, closeApplication } = PhoneState();

	const loadApplicationData = async () => {
		try {
			setUiState('loading', true);
			fakeRPCEventResponse('Server', 'getTesterToolkitAppData', 400, FakeResponse);
			const res = await interpetingRPCEvent('Server', 'getTesterToolkitAppData');
			setData(res);
			setUiState('loading', false);
		} catch (err) {
			await logError('APP_TESTER_TOOLKIT_LOAD', err);
			setData(undefined);
			closeApplication();
		}
	};

	const onInterfaceDataUpdated = (data: string) => {
		const { path, value } = JSON.parse(data);

		setData((currentState: ExpectedAny) => {
			const newState = { ...currentState };
			lodash.set(newState, path, value);
			return newState;
		});
	};

	const triggerToolkitEvent = (eventName: string, value: ExpectedAny) => {
		window.rpc.triggerServer(`onTesterToolkitAction:${eventName}`, JSON.stringify(value));
	};

	useEffect(() => {
		loadApplicationData();
		window.rpc.on('updateTesterToolkitData', onInterfaceDataUpdated);
		return () => {
			window.rpc.off('updateTesterToolkitData', onInterfaceDataUpdated);
		};
		// eslint-disable-next-line
	}, []);

	const RenderedComponent = mappedScreens[screen];

	const ContextProps = {
		data,
		setData,
		mainLang: lang,
		triggerToolkitEvent
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
