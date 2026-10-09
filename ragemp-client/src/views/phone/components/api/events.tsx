import React, { useEffect, useLayoutEffect } from 'react';

// Context
import { PhoneState } from '@phone/index';
import { AppContext } from '@/utils/context';

// Dependencies
import AppsMapping from '../../utils/map';
import { key } from '@/definitions/keys';
import { isObject } from 'lodash';

const Component = () => {
	const { setRoute, setVisible, setRaised, setApplications } = PhoneState();
	const { closeApplication, uiStateRef, routeRef, raisedRef } = PhoneState();
	const { route, raised, loadApplications, theme } = PhoneState();
	const { setUiGame, setPhoneVisible } = AppContext();

	/**
	 * An event invoked by the server when we must mark the phone as visible or not.
	 */

	const onEventIsVisible = (args: ExpectedAny) => {
		const { boolean } = JSON.parse(args);
		setVisible(boolean);
	};

	/**
	 * An event invoked by the server when we raise the phone down or not.
	 */

	const onEventIsRaised = (args: ExpectedAny) => {
		const { boolean } = isObject(args) ? args : JSON.parse(args);
		setRaised(boolean);
		if (boolean === false) {
			if (document.activeElement instanceof HTMLElement) {
				document.activeElement.blur();
			}
		}
	};

	/**
	 * An event invoked by the server when we must remove the user's access to a phone app.
	 */

	const onEventRemoveApplication = (args: ExpectedAny) => {
		const { appId } = JSON.parse(args);

		setApplications((currentState: ExpectedAny) => {
			const curr = [...currentState];
			curr.forEach((app: FixableAny, index) => {
				if (app.appKey === appId) {
					curr.splice(index, 1);
				}
			});
			return curr;
		});
	};

	/**
	 * An event invoked by the server when we must give the user access to a phone app.
	 */

	const onEventAddApplication = (args: ExpectedAny) => {
		const { appId } = JSON.parse(args);
		setApplications((currentState: ExpectedAny) => {
			const curr = [...currentState];
			curr.push(appId);
			return curr;
		});
	};

	/**
	 * An event invoked by the server when we must open a phone app.
	 */

	const openPhoneApp = (args: string) => {
		// Extract arguments
		const { id, payload = {} } = JSON.parse(args);

		// Set them..
		setRoute(id, payload);
	};

	/**
	 * An event invoked by the server when we must close a phone app.
	 */

	const closePhoneApp = () => {
		if (routeRef.current.id === 'home') return false;
		closeApplication();
	};

	/**
	 * This listens to the user's keyboard events and if is a specific key we perform different actions.
	 */

	const onKeyboardKeysDetected = (e: KeyboardEvent) => {
		// Is not raised the phone..

		const isPhoneRaised = raisedRef.current;

		// We check if we're focusing on an input..
		const activeElm = document.activeElement;
		const isFocusOnInput =
			activeElm && ['input', 'textarea'].includes(activeElm.localName) ? true : false;

		// If they're not focusing on an input (Aka writing and deleting) and pressing Delete.
		if (!isFocusOnInput && key(e, 'Delete') && isPhoneRaised) {
			// We can't close it right now.
			if (getPhoneAppRunning() === 'lockscreen' || uiStateRef.current.blurred === true)
				return false;

			// Close the app.
			closePhoneApp();
			return false;
		}

		// Bugfixed MP-501
		if (key(e, 'Tab') && !isPhoneRaised) {
			e.preventDefault();
			return false;
		}
	};

	// When the phone is raised we must inform the overall game hud.
	useEffect(() => {
		setUiGame((currentState: ExpectedAny) => ({
			...currentState,
			phoneRaised: raised
		}));
	}, [raised]);

	/**
	 *
	 * @returns The theme according to the app's setting and user's settings.
	 */

	const getCurrentTheme = () => {
		const userTheme = theme;
		const appTheme: 'light' | 'dark' | 'system' = AppsMapping[route.id].theme;

		// If current theme is "system" means whatever user's theme is.
		if (appTheme === 'system') return userTheme;

		// Return the result..
		return appTheme;
	};

	useEffect(() => {
		setPhoneVisible(raised ? true : false);
	}, [raised]);

	useEffect(() => {
		// Loading the apps whenever the phone is raised or when route change
		loadApplications();

		// Set the phone new theme whenever the route changes.
		window.phone.theme = getCurrentTheme();

		// eslint-disable-next-line
	}, [route, raised]);

	// A simple callback to let the server know what app is opened.
	const getPhoneAppRunning = () => routeRef.current.id;

	useEffect(() => {
		window.rpc.on('onPhoneIsRaised', onEventIsRaised);
		window.rpc.on('onPhoneIsVisible', onEventIsVisible);

		// Events: Control what applications he has access
		window.rpc.on('onPhoneAddApplication', onEventAddApplication);
		window.rpc.on('onPhoneRemoveApplication', onEventRemoveApplication);

		// Events: Control what apps are opened
		window.rpc.on('openPhoneApp', openPhoneApp);
		window.rpc.on('closePhoneApp', closePhoneApp);

		// RPC Registers
		window.rpc.register(`getPhoneAppRunning`, getPhoneAppRunning);

		// Others..
		window.raisePhone = onEventIsRaised;
		document.addEventListener('keydown', onKeyboardKeysDetected);

		return () => {
			window.rpc.off('onPhoneIsRaised', onEventIsRaised);
			window.rpc.off('onPhoneIsVisible', onEventIsVisible);

			// Events: Control what applications he has access
			window.rpc.off('onPhoneAddApplication', onEventAddApplication);
			window.rpc.off('onPhoneRemoveApplication', onEventRemoveApplication);

			// Events: Control what apps are opened
			window.rpc.on('openPhoneApp', openPhoneApp);
			window.rpc.on('closePhoneApp', closePhoneApp);

			// RPC Registers
			window.rpc.unregister(`getPhoneAppRunning`);

			// Others
			window.raisePhone = undefined;
			document.removeEventListener('keydown', onKeyboardKeysDetected);
		};
	}, []);

	// When the phone fully mounted.
	useLayoutEffect(() => window.rpc.triggerClient('onPhoneMounted'), []);

	return null;
};

export default Component;
