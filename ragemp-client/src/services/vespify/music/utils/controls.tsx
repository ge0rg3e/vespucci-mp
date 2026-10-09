import { useContext, createContext } from 'react';

// Dependencies
import { logError } from '@/utils/helpers';
import { ControlsContext } from '../types/context';

// Context
import { VespifyMusicService } from '..';
import { AudioControls } from '@/services/audio/components/controls';

//  Dependencies
import { createPlayerData, dispatchMusicEvent, getSong } from './functions';
import { GetSongResponse } from '../types/basic';
import { AudioService } from '@/services/audio';

// @ts-ignore-next-line -- Is stupid but required.
const Context = createContext<ControlsContext>({});
export const VespifyMusicControls = () => useContext(Context);

const Component = (props: ExpectedAny) => {
	const { getInstance, updateInstance } = VespifyMusicService();
	const { setPaused } = AudioControls();
	const { getInstance: getAudioInstance } = AudioService();

	/**
	 * Get song details from the queue.
	 *
	 * @param identifier - Instance identifier.
	 * @returns Song details from the queue.
	 */

	const getCurrentSongFromQueue = (identifier: string) => {
		try {
			// Get instance
			const instance = getInstance(identifier, false);
			if (!instance) return null;

			// Get the current song details from the queue.
			const match = instance.queue.find((c) => c.id === instance.currentSong.id);

			return match || null;
		} catch (err) {
			logError(`vespify.music.controls.getCurrentSong`, err);
			return null;
		}
	};

	/**
	 * Change the current song in the music instance.
	 *
	 * @param identifier - Instance identifier.
	 * @param id - YouTube Music song ID.
	 * @details Updates the currently playing song in the instance.
	 */

	const changeSong = async (identifier: string, id: string) => {
		try {
			// Get music instance
			const instance = getInstance(identifier, true);
			if (!instance) return null;

			// Getting audio instance
			const audio = getAudioInstance(`vespify.music@${identifier}`, true);
			if (!audio) return null;

			// Update music instance
			updateInstance(instance.identifier, { loading: true }); // This will be set to false by an event callback.

			// Pause current music cause we need to give the effect of "is loading"
			setPaused(`vespify.music@${instance.identifier}`, true);

			// Get new audio data...
			const data = await getSong(id);
			if (!data) return null;

			// Format the new song data
			let newCurrentSong = {
				id: data.information.id,
				artistId: data.information.artists[0].id,
				albumId: data.information.album ? data.information.album.id : null
			};

			// We need to update these recommendations and queue..
			const newRecommendations = [...instance.recommendations];
			const newQueue = [...instance.queue];

			// If this new song is in the recommendations remove it.
			const existingRecIndex = newRecommendations.findIndex((c) => c.id === data.information.id);

			// We remove it from recommendations..
			if (existingRecIndex !== -1) {
				newRecommendations.splice(existingRecIndex, 1);
			}

			// Add it to queue if not present.
			const existingQueueIndex = newQueue.findIndex((c) => c.id === data.information.id);

			// If not existing we add it.
			if (existingQueueIndex === -1) {
				newQueue.push({
					id: data.information.id,
					title: data.information.title,
					artist: data.information.artists[0].name,
					thumbnail: data.information.thumbnail,
					duration: data.information.duration
				});
			}

			// Update music instance
			updateInstance(instance.identifier, {
				currentSong: newCurrentSong,
				queue: newQueue,
				recommendations: newRecommendations
			});

			// Stop current audio
			dispatchMusicEvent(`stopMusic`, instance.identifier);

			// Play next audio
			dispatchMusicEvent(`startMusic`, instance.identifier, {
				currentSong: newCurrentSong,
				volume: audio.preferences.volume
			});

			return data;
		} catch (err) {
			await logError(`vespify.music.controls.changeSong`, err, { identifier, id });
			return null;
		}
	};

	/**
	 * Get the next or previous song based on the direction.
	 *
	 * @param identifier - Instance identifier.
	 * @param direction - 'forward' for the next song, 'backward' for the previous song.
	 * @details For 'forward': Returns next queue song or recommends one if the queue is empty.
	 */

	const getSongByDirection = (identifier: string, dir: 'forward' | 'backward') => {
		try {
			// Get music instance
			const instance = getInstance(identifier, true);
			if (!instance) return null;

			// Get current song index
			const cIndex = instance.queue.findIndex((c) => c.id === instance.currentSong.id);
			if (cIndex == -1) return null;

			// Get next song from the queue
			let queuedSong = instance.queue[dir === 'forward' ? cIndex + 1 : cIndex - 1];

			// If there's is a next or previous song we return it if not null
			let songReturned = queuedSong || null;

			// If the queue is empty but we have recommendations and is direction forwad.
			if (queuedSong === undefined && instance.controls.autoplay && dir === 'forward') {
				songReturned = instance.recommendations[0];
			}

			return songReturned;
		} catch (err) {
			logError(`vespify.music.controls.getSongByDirection`, err, {
				identifier,
				dir
			});

			return null;
		}
	};

	/**
	 * Refresh the queue and fetch a recommendation based on the last song in the queue.
	 *
	 * @param identifier - Identifier of the Vespify music instance.
	 * @param song - Response from the getSong API representing the last played song.
	 */

	const refreshRecommendations = async (identifier: string, song: GetSongResponse) => {
		try {
			// Get data
			const instance = getInstance(identifier, true);
			if (!instance) return false;

			// Get player data
			const { recommendations } = await createPlayerData(song.information.id, 'song');

			// Update queue..
			updateInstance(identifier, { recommendations });

			return true;
		} catch (err) {
			await logError(`services.audio.api.updateQueueForSong`, err);
			return false;
		}
	};

	const PassedFunctions = {
		getCurrentSongFromQueue,
		changeSong,
		getSongByDirection,
		refreshRecommendations
	};

	return <Context.Provider value={PassedFunctions}>{props.children}</Context.Provider>;
};

export default Component;
