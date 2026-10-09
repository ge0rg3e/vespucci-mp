import React, { useState, createContext, useContext } from 'react';

// Dependencies
import { conditionalClassNames } from '@/utils/helpers';

// Components
import API from './components/api';
import MockupBody from './components/mockupBody';
import Buttons from './components/buttons';
import MappedScreens from './screens';

// Context
const Context = createContext({});
export const WalkieContext: ExpectedAny = () => useContext(Context);

// For development
const isDevelopment = window.location.href.includes('?simulatedWalkieTalkie') ? true : false;

const Component = () => {
	const [screen, setScreen] = useState('home');
	const [enabled, setEnabled] = useState(true); // By default is on..
	const [usable, setUsable] = useState(window.mp.fake && isDevelopment ? true : false);
	const [raised, setRaised] = useState(window.mp.fake && isDevelopment ? true : false);
	const [frequency, setFrequency] = useState(null);
	const [antiStateSpam, setAntiStateSpam] = useState({
		enabled: false,
		setFrequency: false
	});

	const putDeviceDown = () => {
		window.rpc.triggerClient(`walkieTalkie:putDown`);
	};

	const changeEnabled = () => {
		if (antiStateSpam.enabled) return false;

		const newState = !enabled;

		// Turn off
		setEnabled(newState);

		// Switch to home so they can see the is turned off message
		if (newState === false) {
			setScreen('home');
		}

		// Inform server
		window.rpc.triggerServer(`walkieTalkie:setEnabled`, JSON.stringify({ enabled: newState }));

		// Prevent spamming the server
		setAntiStateSpam((currentState) => ({ ...currentState, enabled: true }));
		setTimeout(() => {
			setAntiStateSpam((currentState) => ({ ...currentState, enabled: false }));
		}, 1000);
	};

	const PassedContext = {
		// Usable
		usable,
		setUsable,
		// Enabled
		enabled,
		setEnabled,
		// Raised
		raised,
		setRaised,
		// Frequency
		frequency,
		setFrequency,
		// Screen
		screen,
		setScreen,
		// Functions
		changeEnabled,
		// Anti spam
		antiStateSpam,
		setAntiStateSpam
	};

	// Get the class name
	const className = conditionalClassNames(`walkieTalkie`, [
		{
			class: 'visible',
			if: usable && raised
		},
		{
			class: 'raised',
			if: raised
		}
	]);

	// The screne we're rendering
	const ScreenComponent = MappedScreens[screen];

	return (
		<React.Fragment>
			<Context.Provider value={PassedContext}>
				{usable && (
					<div className={className}>
						<div className="component-container">
							<MockupBody />
							<div className="component-closing-area" onClick={putDeviceDown}></div>
							<div className="component-screen">
								<ScreenComponent />
							</div>
							<Buttons />
						</div>
					</div>
				)}
				<API />
			</Context.Provider>
		</React.Fragment>
	);
};

export default Component;
