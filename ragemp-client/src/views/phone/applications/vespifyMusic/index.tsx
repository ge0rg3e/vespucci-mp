import React, { createContext, useContext, useState } from 'react';

// Dependencies
import MappedScreens from './screens';

// Context
const Context = createContext({});
export const AppState: ExpectedAny = () => useContext(Context);

// PHone State
import { PhoneState } from '../..';

const Component = () => {
	const { route } = PhoneState();

	// We determinate the initial screen..
	const initialScreen = { id: route.payload.player ? 'player' : 'home', payload: route.payload.player ? route.payload.player : {} };

	// Set the initial screens
	const [screens, setScreens] = useState([initialScreen]);

	const pushScreen = (id: string, payload: Record<string, ExpectedAny>) => {
		// Push the new screen in.
		setScreens((currentState: ExpectedAny) => [...currentState, { id, payload }]);
	};

	const goToPreviousScreen = () => {
		// Replace the current screen
		setScreens((currentState: ExpectedAny) => {
			// Formatting the new Arr;
			let newArr: ExpectedAny = [...currentState];

			// Remove last one
			newArr.pop();

			// If there's nothing to go back to we go home. (Ex: when player comes from lockscreen)
			if (newArr.length < 1) {
				newArr.push({ id: 'home', payload: {} });
			}

			return newArr;
		});
	};

	const updateScreenPayload = (payload: ExpectedAny) => {
		if (screens.length < 1) return false; // Nothing to update.

		// Replace the current screen
		setScreens((currentState: ExpectedAny) => {
			// Preparing the new arr.
			let newArr: ExpectedAny = [...currentState];

			// Get the current screen
			const currentScreen = newArr[newArr.length - 1];

			// Update curent screen payload.
			newArr[newArr.length - 1] = {
				id: currentScreen.id,
				payload: {
					...currentScreen.payload,
					...payload
				}
			};

			return newArr;
		});
	};

	const ContextProps = {
		// Screen
		screen: screens[screens.length - 1],
		screens,
		updateScreenPayload,
		pushScreen,
		goToPreviousScreen
	};

	const CurrentScreen = screens[screens.length - 1] || null;
	const RenderedComponent = MappedScreens[CurrentScreen.id];

	return (
		<React.Fragment>
			<Context.Provider value={ContextProps}>
				<div className={`component-view screen-${CurrentScreen.id}`}>
					<RenderedComponent />
				</div>
			</Context.Provider>
		</React.Fragment>
	);
};

export default Component;
