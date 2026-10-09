import { fakeAwait, logError, makeVespifyRequest } from '@/utils/helpers';
import { SearchTypes } from '../types/definitions';
import { GetAlbumResponse, GetArtistResponse, GetSongResponse } from '../types/basic';
import { Instance } from '../types/context';
import { v4 as uuidv4 } from 'uuid';

export function dispatchMusicEvent(eventName: string, identifier: string, payload = {}) {
	document.dispatchEvent(
		new CustomEvent(`services.vespify.music@${eventName}`, {
			detail: { identifier, payload }
		})
	);
}

/**
 * This function will get a realistic home feed of sections of songs..
 * @returns The Vespify home feed of songs for you to watch next.
 */

export const getHomeFeed = async () => {
	try {
		const response = await makeVespifyRequest({
			path: `/music/getHomeFeed`,
			method: 'POST',
			payload: {}
		});
		return response;
	} catch (err) {
		await logError(`services.vespify.music@getHomeFeed`, err);
		throw err;
	}
};

/**
 * Search for content on Vespify Music.
 * @param type - The type of content to search for: 'all', 'song', 'album', 'playlist', 'artist'.
 * @param query - The search query as a string.
 * @returns - The search results in a format based on the specified type.
 */

export const searchMusic = async (type: SearchTypes, query: string) => {
	try {
		const response = await makeVespifyRequest({
			path: `/music/search`,
			method: 'POST',
			payload: {
				type,
				query
			}
		});
		return response;
	} catch (err) {
		await logError(`services.vespify.music@searchMusic`, err);
		throw err;
	}
};

/**
 * Fetches song data and its streaming link based on the provided ID.
 * @param id - The ID of the song entity.
 * @returns - Data including information about the song and its streaming link.
 */

export const getSong = async (id: string) => {
	try {
		const response: GetSongResponse = await makeVespifyRequest({
			path: `/music/getSong`,
			method: 'POST',
			payload: {
				id
			}
		});
		return response;
	} catch (err) {
		await logError(`services.vespify.music@getSong`, err);
		throw err;
	}
};

/**
 * Fetches album data based on the provided ID.
 * @param id - The ID of the album entity.
 * @returns - Data including information about the album.
 */

export const getAlbum = async (id: string) => {
	try {
		const response: GetAlbumResponse = await makeVespifyRequest({
			path: `/music/getAlbum`,
			method: 'POST',
			payload: {
				id
			}
		});
		return response;
	} catch (err) {
		await logError(`services.vespify.music@getAlbum`, err);
		throw err;
	}
};

/**
 * Fetches playlist data based on the provided ID.
 * @param id - The ID of the playlist entity.
 * @returns - Data including information about the playlist.
 */

export const getPlaylist = async (id: string) => {
	try {
		const response: GetAlbumResponse = await makeVespifyRequest({
			path: `/music/getPlaylist`,
			method: 'POST',
			payload: {
				id
			}
		});
		return response;
	} catch (err) {
		await logError(`services.vespify.music@getPlaylist`, err);
		throw err;
	}
};

/**
 * Fetches artist data based on the provided ID.
 * @param id - The ID of the artist.
 * @returns - Data including information about the artist.
 */

export const getArtist = async (id: string) => {
	try {
		const response: GetArtistResponse = await makeVespifyRequest({
			path: `/music/getArtist`,
			method: 'POST',
			payload: {
				id
			}
		});
		return response;
	} catch (err) {
		await logError(`services.vespify.music@getArtist`, err);
		throw err;
	}
};

/**
 * Creates player data for a song, playlist, or album based on the given type and ID.
 * @param id - ID of the entity (song, playlist, or album).
 * @param type - The type: 'song', 'playlist', or 'album'.
 * @returns Initial player data for the instance.
 */

export const createPlayerData = async (id: string, type: 'song' | 'playlist' | 'album') => {
	try {
		// If type is song..
		if (type === 'song') {
			// Retrieve song data.
			const songData = await getSong(id);

			// Create the current song object.
			const currentSong: Instance['currentSong'] = {
				id: songData.information.id,
				albumId: songData.information.album?.id || null,
				artistId: songData.information.artists[0].id
			};

			// Create the queue of songs.
			const queue: Instance['queue'] = [
				{
					id: songData.information.id,
					title: songData.information.title,
					thumbnail: songData.information.thumbnail,
					artist: songData.information.artists.map((c) => c.name).join(', '),
					duration: songData.information.duration
				}
			];

			// Generate recommendations of songs
			const recommendations: Instance['recommendations'] = songData.nextSongs.map((song) => ({
				id: song.id,
				title: song.title,
				thumbnail: song.thumbnail,
				artist: song.artists.map((c) => c.name).join(', '),
				duration: song.duration || 0
			}));

			// Create metadata for the instance.
			const metadata: Instance['metadata'] = {
				type: 'song',
				remoteId: songData.information.id,
				title: songData.information.title,
				thumbnail: songData.information.thumbnail || null
			};

			return { currentSong, queue, recommendations, metadata };
		}

		// If type is playlist or album (they're fairly similar in data structure)
		if (type === 'playlist' || type === 'album') {
			// Get entry data for the playlist or album.
			const entry = type === 'album' ? await getAlbum(id) : await getPlaylist(id);

			// Check if data is available.
			if (!entry || entry.songs.length < 1) {
				throw new Error(`No data available for this ${type}.`);
			}

			// Get data for the first song in the playlist or album.
			const firstSongData = await getSong(entry.songs[0].id);

			// Create the current song object.
			const currentSong: Instance['currentSong'] = {
				id: firstSongData.information.id,
				albumId: firstSongData.information.album?.id || null,
				artistId: firstSongData.information.artists[0].id
			};

			// Create the queue of songs.
			let queue: Instance['queue'] = entry.songs.map((song: ExpectedAny) => {
				// Get the thumbnail (Album has an issue - songs don't have thumbnail there so we'll default to the album's thumbnail)
				const thumbnail = type === 'album' ? entry.information.thumbnail : song.thumbnail!;

				// Album doesn't return artist.
				const artists = type === 'album' ? [entry.information.artist] : song.artists;

				// Return the data formatted.
				return {
					id: song.id,
					title: song.title,
					thumbnail,
					artist: artists.map((c: ExpectedAny) => c.name).join(', '),
					duration: song.duration
				};
			});

			// Generate recommendations of songs
			const recommendations: Instance['recommendations'] = firstSongData.nextSongs.map((song) => ({
				id: song.id,
				title: song.title,
				thumbnail: song.thumbnail,
				artist: song.artists.map((c) => c.name).join(', '),
				duration: song.duration || 0
			}));

			// Create metadata for the instance.
			const metadata: Instance['metadata'] = {
				remoteId: entry.information.id,
				type,
				title: entry.information.title,
				thumbnail: entry.information.thumbnail
			};

			return { currentSong, queue, metadata, recommendations };
		}

		throw new Error(`Failed to return any valid response.`);
	} catch (err) {
		await logError(`services.vespify.music@createPlayerData`, err);
		throw err;
	}
};

/**
 * Shuffles an index within the range [0, totalSongs) while ensuring it's not equal to the current index.
 *
 * @param currentIndex - The current index to avoid.
 * @param totalSongs - The total number of songs in the list.
 * @returns A shuffled index that is not equal to the current index.
 */

export function shuffleIndexOfSongs(currentIndex: number, totalSongs: number): number {
	if (totalSongs <= 1) {
		return 0; // If there's only one song, return 0.
	}

	let randomIndex: number;
	do {
		randomIndex = Math.floor(Math.random() * totalSongs);
	} while (randomIndex === currentIndex);

	return randomIndex;
}

// Variables
let FetchingTokens: ExpectedAny = {};

/**
 *
 * It will simply clear the token from the browser's memory.
 * @param identifier
 */

export const clearLoadingToken = (identifier: string) => {
	delete FetchingTokens[identifier];
};

/**
 * It will simply  genearte a token for this identifier and save it in the browser of the browser.
 */

export const generateLoadingToken = (identifier: string) => {
	// We generate it.
	let uuid = uuidv4();

	// Save it in variables
	FetchingTokens[identifier] = uuid;

	return uuid;
};

/**
 * We check if this token is the latest resource token used for this identifier.
 */

export const validateLoadingToken = (identifier: string, token: string) => {
	if (!FetchingTokens[identifier]) return false;
	if (FetchingTokens[identifier] !== token) return false;
	return true;
};
