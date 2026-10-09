import React, { useContext, createContext } from 'react';
import { ControlContextTypes } from '../types/context';
import { VespifyService } from '..';

// @ts-ignore-next-line -- Is stupid but required.
const Context = createContext<ControlContextTypes>({});
export const VespifyControls = () => useContext(Context);

const Component = (props: ExpectedAny) => {
	const { updateControls } = VespifyService();

	/**
	 * It simply sets the volume level for the video.
	 * @param identifier Instance indentifier
	 * @param volume A number between 0 and 100
	 */

	const setVolume = async (identifier: string, volume: number) => {
		// Get elm
		const video: ExpectedAny = getVideoElement(identifier);
		if (!video) return false;

		// Set volume level
		video.volume = volume / 100;

		// Update controls
		updateControls(identifier, {
			volume
		});
	};

	/**
	 *
	 * This function will roll the video forward or backward.
	 * @param identifier Instance indentifier
	 * @param direction Where the video should go towards`
	 */

	const rollTime = (identifier: string, direction: 'forward' | 'backward') => {
		// Get elm
		const video: ExpectedAny = getVideoElement(identifier);
		if (!video) return false;

		// Get the current playback position
		let currentTime = video.currentTime;

		// Define the seek amount (10 seconds)
		const seekAmount = 10;

		// Calculate the new playback position based on the direction
		if (direction === 'forward') {
			currentTime += seekAmount;
		} else if (direction === 'backward') {
			currentTime -= seekAmount;
		}

		// Ensure the new time is within valid bounds (0 to video duration)
		currentTime = Math.max(0, Math.min(currentTime, video.duration));

		// Set the new playback position
		video.currentTime = currentTime;
	};

	/**
	 * This will update the pause state of the video source.
	 * @param identifier Instance indentifier
	 * @param state
	 */

	const setPaused = (identifier: string, state: boolean) => {
		// Get elm
		const elm: ExpectedAny = getVideoElement(identifier);
		if (!elm) return false;

		// Do the action: If is NOT paused now..
		if (state === false) {
			elm.play();
		} else {
			elm.pause();
		}

		// Update controls
		updateControls(identifier, {
			paused: state
		});
	};

	/**
	 * This will update the muted state of the video source.
	 * @param identifier Instance indentifier
	 * @param state
	 */

	const setMuted = (identifier: string, state: boolean) => {
		// Get elm
		const elm: ExpectedAny = getVideoElement(identifier);
		if (!elm) return false;

		// Do the action: If is NOT paused now..
		elm.muted = state;

		// Update controls
		updateControls(identifier, {
			muted: state
		});
	};

	/**
	 *
	 * @param identifier Instance indentifier
	 * @returns The video element or  null
	 */

	const getVideoElement = (identifier: string) => {
		const elementId = `global-component::ytb-video-source-${identifier}`;
		const elm = document.getElementById(elementId);
		if (!elm) return null;
		return elm;
	};

	const PassedFunctions = {
		// Controls
		setVolume,
		rollTime,
		setPaused,
		setMuted,
		// Functions
		getVideoElement
	};

	return <Context.Provider value={PassedFunctions}>{props.children}</Context.Provider>;
};

export default Component;
