import React, { useState, useEffect } from 'react';
import { PhoneState } from '../..';

interface Props {
	theme?: 'light' | 'dark' | 'system';
	loading: boolean;
	delayLoadingIcon?: number;
	children: ExpectedAny;
}

// Variables
const MAX_LOADING_TIME = 10000;
let timeoutTimer: ExpectedAny = null;
let fallbackTimer: ExpectedAny = null;

const Component = (props: Props) => {
	const [showLoadingIcon, setShowLoadingIcon] = useState(false);
	const { setUiState } = PhoneState();

	const componentTheme =
		props.theme === 'system' || !props.theme ? window.phone.theme : props.theme;

	useEffect(() => {
		// If we have a preferred amount of time to wait until we show the loading icon.
		if (props.delayLoadingIcon) {
			timeoutTimer = setTimeout(() => {
				// Callback
				setShowLoadingIcon(true);

				// Reset timer id
				timeoutTimer = null;
			}, props.delayLoadingIcon);
		} else {
			// if not straight away.
			setShowLoadingIcon(true);
		}

		// In case it didn't load in 30 seconds we turn this off so the player can close the app.
		fallbackTimer = setTimeout(() => {
			// Callback function
			setUiState('loading', false);

			// Reset
			fallbackTimer = null;
		}, MAX_LOADING_TIME);

		return () => {
			if (timeoutTimer !== null) {
				// Clear timeout
				clearTimeout(timeoutTimer);

				// Reset timer id
				timeoutTimer = null;
			}

			if (fallbackTimer !== null) {
				// Clear timeout
				clearTimeout(fallbackTimer);

				// Reset timer id
				fallbackTimer = null;
			}
		};
	}, []);

	// We will set the loading ui state accordingly.
	useEffect(() => {
		setUiState('loading', props.loading);

		// All good now.
		if (props.loading === false && fallbackTimer !== null) {
			// Clear timeout
			clearTimeout(fallbackTimer);

			// Reset variable
			fallbackTimer = null;
		}
	}, [props.loading]);

	// If we're no longer loading..
	if (!props.loading) return props.children;

	return (
		<div className={`app-component-loading-screen ${componentTheme}`}>
			{showLoadingIcon && <div className={`image default ${componentTheme}`}></div>}
		</div>
	);
};

export default Component;
