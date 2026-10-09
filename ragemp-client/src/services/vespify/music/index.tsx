import React, { createContext, useContext } from 'react';

// Dependencies
import { logError, useStateRef } from '@/utils/helpers';
import { clearLoadingToken, createPlayerData, generateLoadingToken, validateLoadingToken } from './utils/functions';

// Types
import { Instance, InstanceContext, createInstanceParams } from './types/context';

// @ts-ignore-next-line -- Is stupid but required.
const Context = createContext<InstanceContext>({});
export const VespifyMusicService = () => useContext(Context);

// Controls context
import Controls from './utils/controls';
import Streams from './streams';
import Callbacks from './utils/callbacks';

const Component = (props: ExpectedAny) => {
	// These are entries of vespify instances going on currently.
	const [instances, setInstances, instancesRef] = useStateRef([]);
	const [speakers, setSpeakers, speakersRef] = useStateRef([]);

	/**
	 *  Creates an instance in our service background that allows us to play a song in the background.
	 * @returns Response and the instance created.
	 */

	const createInstance = async (params: createInstanceParams) => {
		try {
			// We will generate a loading token for this request to keep track of what resource was requested for this instance identifier.
			const token = generateLoadingToken(params.identifier);

			// Get the player data.
			const data = await createPlayerData(params.remoteId, params.type);

			// If while this data was loading, the user already changed  the song, we don't go forward to set the song as loaded since the player (user) did not wait for it to finish.
			if (!validateLoadingToken(params.identifier, token)) return false;

			// Clear loading token now that the loading finished.
			clearLoadingToken(params.identifier);

			// Kill an existing instance if there is any with this identifier
			deleteInstance(params.identifier);

			// Create the instance.
			let newInstance: Instance = {
				// Identifier of this instance
				identifier: params.identifier,
				// Information about the current song playing that will play first.
				currentSong: data.currentSong,
				// The queue of songs that will play.
				queue: data.queue,
				// The recommendations of song that we should play
				recommendations: data.recommendations,
				// Metadata about what's this instance playing
				metadata: data.metadata,
				// Loading the song data
				loading: false,
				// Controls for this instance
				controls: {
					// Default values
					shuffle: false,
					repeat: 'off',
					autoplay: true,
					// Loading the user preferences
					...params.controls
				},
				// Volume pre-set for when song starts
				volume: params.volume
			};

			// Add it to the data array
			setInstances((currentState: Array<Instance>) => [...currentState, newInstance]);

			// Return the data for the front-end
			return { currentSong: data.currentSong, queue: data.queue, metadata: data.metadata };
		} catch (err) {
			await logError(`services.vespify.music.createInstance`, err, { params });
			throw err;
		}
	};

	/**
	 * Deletes the instance from our service and therefore also making the music going away too.
	 * @param identifier ID of the Instance
	 */

	const deleteInstance = async (identifier: string) => {
		try {
			// Make the change
			setInstances((currentState: ExpectedAny) => {
				const newArr = [...currentState];

				// Get the instance if exists.
				const index = currentState.findIndex((c: ExpectedAny) => c.identifier === identifier);
				if (index === -1) return currentState; // Does not exist.

				// Delete it.
				newArr.splice(index, 1);

				return newArr;
			});
		} catch (err) {
			await logError(`services.vespify.music.deleteInstance`, err, { identifier });
			throw err;
		}
	};

	/**
	 * This will give you the instance data from context state.
	 * @param identifier ID of the Instance
	 * @param useRef If ever used inside a addEventListenre is useful to use the ref instead.
	 * @returns An Instance or null (if undefined)
	 */

	const getInstance = (identifier: string, useRef?: boolean) => {
		// Get the instance data source depending if we want to use are a ref or not.
		const sourceData = useRef === true ? instancesRef.current : instances;

		// Find the index
		const index = sourceData.findIndex((c: ExpectedAny) => c.identifier === identifier);

		//If index is not existing..
		if (index === -1) return null;

		// Return data! :)
		return sourceData[index];
	};

	/**
	 * This function is simply updating the data of an instance.
	 * @param identifier Instance unique identifier
	 * @param payload Data you wish to update
	 */

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

			return newState;
		});
	};

	/**
	 * This function is simply updating the controls of an instance.
	 * @param identifier Instance unique identifier
	 * @param payload Data you wish to update
	 */

	const updateControls = (identifier: string, payload: Partial<Instance['controls']>) => {
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
				controls: {
					...currentState[index].controls,
					...payload
				}
			};

			return newState;
		});
	};

	const ContextProps = {
		// Data
		instances,
		instancesRef,
		// Connected speakers
		speakers,
		speakersRef,
		setSpeakers,
		// Functions
		createInstance,
		deleteInstance,
		getInstance,
		updateInstance,
		updateControls
	};

	return (
		<Context.Provider value={ContextProps}>
			<Controls>
				<Streams />
				{props.children}
			</Controls>
			<Callbacks />
		</Context.Provider>
	);
};

export default Component;
