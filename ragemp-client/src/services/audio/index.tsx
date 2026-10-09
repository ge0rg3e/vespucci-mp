import React, { useRef, useContext, createContext } from 'react';

// Dependencies
import { logError, useStateRef } from '@/utils/helpers';
import { v4 as uuidv4 } from 'uuid';

// Components
import API from './components/api';
import Callbacks from './components/callbacks';
import Controls from './components/controls';

// Types
import { AudioServiceContext, Instance, PlayAudioOptions } from './utils/types';
import Audio from './components/audio';
import { dispatchAudioEvent } from './utils/functions';

// @ts-ignore-next-line -- Is stupid but required.
const Context = createContext<AudioServiceContext>({});
export const AudioService = () => useContext(Context);

const Component = (props: ExpectedAny) => {
	// Creating the audio context.
	const audioContext = useRef(new window.AudioContext());

	// The audio instances..
	const [instances, setInstances, instancesRef] = useStateRef([]);

	const playAudio = async (sourcePath: string, options: PlayAudioOptions = {}) => {
		try {
			// The identifier used by this audio in case we want to control it.
			const identifier = options.identifier || uuidv4();

			// Delete the instance if it already exists.
			stopAudio(identifier);

			// Get the preferences
			const {
				autoplay = true,
				loop = false,
				preventCleanup = false,
				pan = 0,
				biquadFilter = undefined,
				spatialSound = undefined,
				reactiveCurrentTime = false,
				startTime = undefined,
				muted = false
			} = options;

			// We need this like this to make sure a volume like 0.07 init will not be auto set to 1.
			const volume = options.volume !== undefined ? options.volume : 1;

			// Create the audio instance
			const audio = new Audio({
				// Details
				identifier,
				audioContext: audioContext.current,
				audioUrl: sourcePath,
				// Preferences..
				volume: options.volume !== undefined ? options.volume : 1,
				loop,
				autoplay,
				muted,
				// Effects
				pan,
				biquadFilter,
				// The current time if we want to start the song at a specific time
				startTime
			});

			// Creating the instance..
			let entry: Instance = {
				// Instance details
				identifier,

				// The source playing
				sourcePath,

				// Controller of the sound
				controller: audio,

				// Current time
				currentTime: 0,

				// Duration (will be updated later)
				duration: 0,

				// To keep track if song is loaded
				loaded: false,

				// Spatial sound in-game
				spatialSound,

				// If our interface will update the hook state with current time
				// @Reminder: Not all sounds need to have a hook state with current time.
				reactiveCurrentTime,

				// The controls
				preferences: {
					muted,
					volume,
					paused: autoplay ? false : true,
					loop,
					preventCleanup
				}
			};

			// Saving the instance in the array
			setInstances((prevSounds: ExpectedAny) => [...prevSounds, entry]);

			// Dispatch audio event
			dispatchAudioEvent(identifier, `created`, {
				instance: entry
			});

			return entry;
		} catch (err) {
			logError(`services.audio.playAudio`, err);
			return null;
		}
	};

	const stopAudio = (identifier: string) => {
		try {
			// Get the instance
			const instance = getInstance(identifier, true);

			// If it doesn't exist..
			if (!instance) return false;

			// Dispatch audio event
			dispatchAudioEvent(identifier, `deleted`);

			// Destroy audio to save memory ram.
			instance.controller.destroy();

			// Delete it from the array
			setInstances((currentState: ExpectedAny) => {
				let newState = [...currentState];

				// Get index of current instance
				const instanceIndex = currentState.findIndex((c: Instance) => c.identifier === identifier);
				if (instanceIndex === -1) return currentState;

				// Delete
				newState.splice(instanceIndex, 1);

				// Update.
				return [...newState];
			});

			return true;
		} catch (err) {
			logError(`services.audio.stopAudio`, err, { identifier });
			return false;
		}
	};

	const getInstance = (identifier: string, useRef?: boolean) => {
		try {
			// Data source accordingly
			const src = useRef ? instancesRef.current : instances;

			// Find an audio with this identifier
			const match: Instance | undefined = src.find((c: Instance) => c.identifier === identifier);

			return match || null;
		} catch (err) {
			logError(`services.audio.getInstance`, err);
			return null;
		}
	};

	const updatePreferences = (identifier: string, payload: Partial<Instance['preferences']>) => {
		// Update instance..
		setInstances((currentState: Array<Instance>) => {
			let newState = [...currentState];

			// Does this identifier actually exists?
			const index = newState.findIndex((c: ExpectedAny) => c.identifier === identifier);

			// If the state is no longer here..
			if (!currentState[index]) return currentState; // It seems it's no longer here.

			// Update data..
			newState[index] = {
				...currentState[index],
				preferences: {
					...currentState[index].preferences,
					...payload
				}
			};

			// Dispatch event
			dispatchAudioEvent(identifier, 'updated', { payload });

			return newState;
		});
	};

	const updateInstance = (identifier: string, payload: Partial<Instance>) => {
		// Update instance..
		setInstances((currentState: Array<Instance>) => {
			let newState = [...currentState];

			// Does this identifier actually exists?
			const index = newState.findIndex((c: ExpectedAny) => c.identifier === identifier);

			// If the state is no longer here..
			if (!currentState[index]) return currentState; // It seems it's no longer here.

			// Update data..
			newState[index] = {
				...currentState[index],
				...payload
			};

			// Dispatch event
			dispatchAudioEvent(identifier, 'updated', { payload });

			return newState;
		});
	};

	const PassedProps = {
		// Data,
		instances,
		instancesRef,
		setInstances,
		updateInstance,
		// Functions
		playAudio,
		stopAudio,
		getInstance,
		updatePreferences
	};

	return (
		<Context.Provider value={PassedProps}>
			<API />
			<Callbacks />
			<Controls>{props.children}</Controls>
		</Context.Provider>
	);
};

export default Component;
