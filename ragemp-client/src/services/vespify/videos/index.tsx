import React, { createContext, useContext } from 'react';

// Components
import Streams from './streams';
import Controls from './utils/controls';
// Dependencies
import { logError, useStateRef } from '@/utils/helpers';
import { getVideo } from './utils/functions';

// Types
import { Instance, InstanceContext, CreateInstanceParams } from './types/context';

// @ts-ignore-next-line -- Is stupid but required.
const Context = createContext<InstanceContext>({});
export const VespifyService = () => useContext(Context);

const Component = (props: ExpectedAny) => {
	// These are entries of vespify instances going on currently.
	const [instances, setInstances, instancesRef] = useStateRef([]);

	/**
	 *  Creates an instance in our service background that allows us to play a video or audio in the background.
	 * @returns Response and the instance created.
	 */

	const createInstance = async (params: CreateInstanceParams) => {
		try {
			// Get the video from vespify
			const response = await getVideo(params.remoteId);

			// Kill an existing instance if there is any with this identifier
			deleteInstance(params.identifier);

			// Format the new instance..
			const newInstance: Instance = {
				// Identifier uniquely know across our app.
				identifier: params.identifier,

				// The stream url from the back-end response.
				stream: response.stream,

				// The next entry we'll play after this instance is finished
				nextEntryId: response.nextVideos.length > 0 ? response.nextVideos[0].id : null,

				// If maybe they want to render the player / audio somewhere.
				elementIdDestination: params.elementIdDestination || null,

				// Controls for the player
				controls: {
					// Loading default options
					miniPlayer: false,
					paused: false,
					volume: 100, // @TBD: to fetch last settings
					muted: false,
					loop: false,
					loaded: false, // If this streaming media is loaded and ready.
					error: false, // If the streaming media has failed to load due to an error.
					// In case we have preferences given.
					...params.controls
				},
				// Callbacks if any
				callbacks: params.callbacks || {},
				// Metadata about the video
				metadata: {
					id: response.information.id,
					title: response.information.title,
					thumbnail: response.information.thumbnail,
					author: {
						name: response.information.author.name
					}
				}
			};

			// Save this instance.
			setInstances((currentState: ExpectedAny) => [...currentState, newInstance]);

			// Response for the front-ends so they can do their parts.
			return { response, instance: newInstance };
		} catch (err) {
			await logError(`services.vespify@createInstance`, err, { params });
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
			await logError(`services.vespify@deleteInstance`, err, { identifier });
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

			// Invoke callback if present
			if (newState[index].callbacks.onControlsUpdated) {
				try {
					newState[index].callbacks.onControlsUpdated!(newState[index].controls);
				} catch (err) {
					logError(`services.vespify.callbacks.onControlsUpdated`, err);
				}
			}
			return newState;
		});
	};

	/**
	 * This will play the next in queue for the video when it ends.
	 * @param identifier Identifier of instance
	 */

	const playNextVideo = async (identifier: string) => {
		try {
			// Get the instance
			const instance = getInstance(identifier);
			if (!instance) return false;

			// Get the video from vespify api
			const response = await getVideo(instance.nextEntryId);

			// Update current instance
			updateInstance(identifier, {
				// The stream url from the back-end response.
				stream: response.stream,

				// The next entry we'll play after this instance is finished
				nextEntryId: response.nextVideos.length > 0 ? response.nextVideos[0].id : null,

				// Metadata about the video
				metadata: {
					id: response.information.id,
					title: response.information.title,
					thumbnail: response.information.thumbnail,
					author: {
						name: response.information.author.name
					}
				}
			});

			// Dispatch event so vespify app and others can update their interface
			document.dispatchEvent(
				new CustomEvent(`services.vespify@onNextVideoStarted`, {
					detail: {
						response,
						// Getting instance fresh after changing..
						instance: getInstance(identifier)
					}
				})
			);
		} catch (err) {
			await logError(`services.vespify@playNextVideo`, err);
			return false;
		}
	};

	const ContextProps = {
		// Data
		instances,
		instancesRef,
		// Functions
		createInstance,
		deleteInstance,
		getInstance,
		updateInstance,
		updateControls,
		playNextVideo
	};

	return (
		<Context.Provider value={ContextProps}>
			<Controls>
				<React.Fragment>{props.children}</React.Fragment>
				{/* The streams is where the music comes from lol */}
				<Streams />
			</Controls>
		</Context.Provider>
	);
};

export default Component;
