import React, { createContext, useContext, useState } from 'react';

// Dependencies
import MappedScreens from './screens';
import API from './utils/api';
import { useStateRef } from '@/utils/helpers';

// Context
const Context = createContext({});
export const AppState: ExpectedAny = () => useContext(Context);

const Component = () => {
	const [data, setData, dataRef] = useStateRef({
		permissions: {
			keepVideoInBackground: false
		}
	});
	const [screen, setScreen] = useState({ id: 'home', payload: {} });
	const [search, setSearch] = useState({
		expanded: false,
		inputValue: ''
	});

	const ContextProps = {
		// Screen
		screen,
		setScreen,
		// Search through app
		search,
		setSearch,
		// Data of the user
		data,
		dataRef,
		setData
	};

	const RenderedComponent = MappedScreens[screen.id];

	return (
		<React.Fragment>
			<Context.Provider value={ContextProps}>
				<div className={`component-view screen-${screen.id}`}>
					<RenderedComponent />
				</div>
				<API />
			</Context.Provider>
		</React.Fragment>
	);
};

export default Component;
