import React, { useContext, createContext } from 'react';

// Types
import { AudioControlsContext } from '../utils/types';
import { AudioService } from '..';

// Dependencies
import { logError } from '@/utils/helpers';
import { dispatchAudioEvent } from '../utils/functions';

// @ts-ignore-next-line -- Is stupid but required.
const Context = createContext<AudioControlsContext>({});
export const AudioControls = () => useContext(Context);

const Component = (props: ExpectedAny) => {
	const { updateInstance, getInstance, updatePreferences } = AudioService();

	const getController = (identifier: string, useRef?: boolean) => {
		try {
			const match = getInstance(identifier, useRef);
			return match ? match.controller : null;
		} catch (err) {
			logError(`services.audio.controls.getAudio`, err);
			return null;
		}
	};

	const setVolume = async (identifier: string, volume: number) => {
		try {
			// If instance does not exist.
			const instance = getInstance(identifier, true);
			if (!instance) return false;

			// If the sound is not loaded is gonna throw an error due to missing context.
			if (!instance.loaded) return false;

			// Update volume
			instance.controller.setVolume(volume);

			// Update state to keep track
			updatePreferences(identifier, { volume });

			// Dispatch event
			dispatchAudioEvent(identifier, `volumeChanged`, { volume });
		} catch (err) {
			logError(`services.audio.controls.setVolume`, err, { identifier, volume });
			return false;
		}
	};

	const setMuted = async (identifier: string, state: boolean) => {
		try {
			// If instance does not exist.
			const instance = getInstance(identifier, true);
			if (!instance) return false;

			// If the sound is not loaded is gonna throw an error due to missing context.
			if (!instance.loaded) return false;

			// Update muted state
			instance.controller.setMuted(state);

			// Dispatch event
		} catch (err) {
			logError(`services.audio.controls.setMuted`, err, { identifier, state });
			return false;
		}
	};

	const setPaused = (identifier: string, state: boolean) => {
		try {
			// If instance does not exist.
			const instance = getInstance(identifier, true);
			if (!instance) return false;

			// If the sound is not loaded is gonna throw an error due to missing context.
			if (!instance.loaded) return false;

			// Action
			if (state === true) {
				instance.controller.pause();
			} else {
				instance.controller.play();
			}

			// Update state to keep track
			updatePreferences(identifier, { paused: state });
		} catch (err) {
			logError(`services.audio.controls.setPaused`, err, { identifier, state });
			return false;
		}
	};

	const setCurrentTime = (identifier: string, seconds: number) => {
		try {
			// If instance does not exist.
			const instance = getInstance(identifier, true);
			if (!instance) return false;

			// If the sound is not loaded is gonna throw an error due to missing context.
			if (!instance.loaded) return false;

			instance.controller.setCurrentTime(seconds);

			// Update instance
			updateInstance(identifier, { currentTime: seconds });
		} catch (err) {
			logError(`services.audio.controls.setCurrentTime`, err, { identifier, seconds });
			return false;
		}
	};

	const PassedProps = {
		getController,
		setVolume,
		setPaused,
		setCurrentTime,
		setMuted
	};

	return <Context.Provider value={PassedProps}>{props.children}</Context.Provider>;
};

export default Component;
