import { useState, useEffect, createContext, useContext, useRef } from 'react';

// Components
import Mockup from '@phone/components/layout/device/body';
import AppsMapping from './utils/map';

// APIs
import NotificationsAPI from '@/views/phone/components/api/notifications';
import EventsAPI from '@phone/components/api/events';

// Dependencies
import { createAmplitudeEvent, fakeRPCEventResponse, interpetingRPCEvent } from '@/utils/helpers';
import { isNativePhoneRoute, isPhoneDevelopment } from '@phone/utils/helpers';
import { logError, useStateRef } from '@/utils/helpers';

// Phone Context
const Context = createContext({});
export const PhoneState: ExpectedAny = () => useContext(Context);

const PhoneComponent = () => {
	// Applications
	const [applicationsSorting, setApplicationsSorting] = useState({});
	const [applications, setApplications, applicationsRef] = useStateRef([
		'home',
		'lockscreen',
		`settings`,
		'phone'
	]);

	// Behavior
	const [visible, setVisible] = useState(isPhoneDevelopment() ? true : false);
	const [raised, setRaised, raisedRef] = useStateRef(isPhoneDevelopment() ? true : false);

	// Important
	const [notifications, setNotifications] = useState([]);
	const [route, setNativeRoute, routeRef] = useStateRef({ id: 'lockscreen', payload: {} });

	// Appearance..
	const [theme, setTheme] = useState<FixableAny>('light');
	const [uiState, _setUiState, uiStateRef] = useStateRef({
		loading: false,
		blurred: false,
		opening: false,
		closeLineVisible: true
	});

	/**
	 * A simple shortcut func created to set the values for those uiStates easier.
	 * @param key the string key
	 * @param val the value
	 */

	const setUiState = (key: Phone['uiStates'], val: boolean) => {
		_setUiState((currentState: ExpectedAny) => {
			const newState = { ...currentState };
			newState[key] = val;
			return newState;
		});
	};

	const openApplication = (appSelected: { route: string; payload?: ExpectedAny }) => {
		const app = document.getElementsByClassName('device-content')[0];
		const parent: UndefinedAny = app.parentElement;
		if (!app || !parent) return false;

		// Avoiding double clicks
		if (uiStateRef.current.opening === true) return false;

		// Creating a clone
		const clone: UndefinedAny = app.cloneNode(true);
		clone.className += ' app-ghost';

		// Adding the clone
		parent.appendChild(clone);

		// Setting route to the app but it will be under the ghost.
		setRoute(appSelected.route, appSelected.payload || {});

		setUiState('opening', true);
		createAmplitudeEvent('Opened an application on his phone', {
			...appSelected
		});

		setTimeout(() => {
			setUiState('opening', false);
			clone.remove();
		}, 160);
	};

	/**
	 *
	 * This function closes the current application loaded with a nice fading animation.
	 */

	const closeApplication = async (slower = false) => {
		try {
			// Get the current application screen
			const appScreen = document.getElementsByClassName('device-content')[0];

			// Get the device's screen that contains the app screen.
			const device: UndefinedAny = appScreen.parentElement;
			if (!appScreen || !device) return false;

			// Starting the fading so everything is blurred
			setUiState('blurred', true);

			// Creating a clone
			const appScreenClone: UndefinedAny = appScreen.cloneNode(true);
			appScreenClone.className += ` app-closing ${slower ? `slower` : `faster`}`;
			const animationTimerSeconds = slower ? 1 : 0.5;

			// Trigger and inform the server..
			window.rpc.triggerServer(
				`onPhoneAppClosed`,
				JSON.stringify({ closedAppId: `${routeRef.current.id}` })
			);

			// Setting route to home so now we are on home screen and now home is blurred
			setRoute('home');

			// Adding the cloned on top of the original one and starting the animation
			device.appendChild(appScreenClone);

			// Creating the timer to stop the animation
			setTimeout(() => {
				// Informing that the blur is gone.
				setUiState('blurred', false);

				// Deleting the clone.
				appScreenClone.remove();
			}, animationTimerSeconds * 1000 - 30);
		} catch (err) {
			await logError(`phone.closeApplication`, err, { slower, route });
		}
	};

	/**
	 *  This function is called when a new array of phone applications is loaded.
	 */

	const sortApplications = async (apps: ExpectedAny | null) => {
		try {
			// Now we need to know which apps have preferred sorting numbers.
			const appsWithSorting = apps.filter((x: FixableAny) => x.sortNumber !== null);

			// Variable to hold them
			const newSorting: FixableAny = {};

			// Iterate through each app and map it to the object by key.
			appsWithSorting.forEach((app: FixableAny) => {
				newSorting[app.id] = app.sortNumber;
			});

			// Save it..
			setApplicationsSorting(newSorting);
		} catch (err) {
			await logError(`phone.sortApplications`, err);
		}
	};

	/**
	 * This function will load the phone apps that the player has access to.
	 */

	const loadApplications = async () => {
		try {
			// If we're developing on the phone we will load simulated list of phone app.s
			if (window.mp.fake) {
				// Get a simulated list of phone apps (not natives)
				const simulatedResponse = Object.keys(AppsMapping)
					.filter((x) => !isNativePhoneRoute(x))
					.map((key) => ({
						// This is the format they will come from the server
						id: key,
						sortNumber: null
					}));

				// This will trigger a simulated response
				fakeRPCEventResponse(
					'Server',
					'getPhoneInstalledApplications',
					200,
					simulatedResponse
				);
			}

			// Get the list of phone applications.
			const data = await interpetingRPCEvent('Server', 'getPhoneInstalledApplications');

			// Format the new list of applications
			const natives = Object.keys(AppsMapping).filter((x) => isNativePhoneRoute(x)); // we need to know which ones are natives.
			const passedIds = data.map((x: FixableAny) => x.id); // the ids passed by the server.
			const apps = [...natives, ...passedIds]; // the new array formatted right.

			// Setting them..
			setApplications(apps);

			// We just lost the access to the current application.
			if (!apps.includes(route.id)) {
				closeApplication();
			}

			// Callbacks
			sortApplications(data);
		} catch (err) {
			await logError(`phone.loadApplications`, err);
		}
	};

	/**
	 *	This function sets the route of the current application.
	 *  Also checks and makes sure they have access to it.
	 */

	const setRoute = async (id: string, payload = {}) => {
		try {
			// If he does not have permission to access this application.
			if (!applicationsRef.current.includes(id) && window.mp.fake !== true) {
				// Log to amplitude
				createAmplitudeEvent('Having Difficulties', {
					reason: `Tried to access a phone route that's not in his phone memory.`,
					route: route
				});

				// Mark this in localStorage
				localStorage[`@missingPhoneRoute`] = route;

				// Set the route to not found
				setNativeRoute({ id: 'notFound', payload: {} });

				return false;
			}

			// If everything is fine..
			setNativeRoute({ id, payload });
		} catch (err) {
			await logError(`phone.setRoute`, err, { id, payload });
		}
	};

	// Context passed to components..
	const PassedContext = {
		setRoute,
		route,
		routeRef,
		// Applications
		applications,
		applicationsRef,
		// Raised
		raised,
		raisedRef,
		setRaised,
		// Visible
		visible,
		setVisible,
		// Notifications
		notifications,
		setNotifications,
		// UI State
		uiState,
		uiStateRef,
		setUiState,
		// Natives
		loadApplications,
		applicationsSorting,
		openApplication,
		closeApplication,
		// Theme
		setTheme,
		theme
	};

	// The component that must be rendered.
	const RouteComponent: FixableAny = AppsMapping[route.id].component;

	return (
		<Context.Provider value={PassedContext}>
			<Mockup>
				<RouteComponent />
			</Mockup>
			<NotificationsAPI />
			<EventsAPI />
		</Context.Provider>
	);
};

export default PhoneComponent;
