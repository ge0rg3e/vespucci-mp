import React, { createContext, useContext, useState } from 'react';
import mappedScreens from './utils/maps';

// Context
import { PhoneState } from '../..';

// Context
const Context = createContext({});
export const AppState: ExpectedAny = () => useContext(Context);

const Component = () => {
	// Sub route of this application
	const { route } = PhoneState();
	const [subRoute, setSubRoute] = useState(route.payload.subRoute || 'menu');
	const [search, setSearch] = useState('');

	// Props passed
	const ContextProps = {
		subRoute,
		setSubRoute,

		search,
		setSearch
	};

	// Get rendered component
	const RenderedComponent = mappedScreens[subRoute];

	return (
		<React.Fragment>
			<Context.Provider value={ContextProps}>
				<div className={`component-view ${subRoute}`}>
					<RenderedComponent />
				</div>
			</Context.Provider>
		</React.Fragment>
	);
};

export default Component;
