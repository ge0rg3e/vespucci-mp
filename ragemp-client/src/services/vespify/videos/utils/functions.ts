import { logError, makeVespifyRequest } from '@/utils/helpers';
import { GetChannelResponse, GetVideoResponse, SearchResponse } from '../types/responses';

/**
 *
 * @param query - The string to search.
 * @returns Search results from vespify api.
 */

export const searchVideo = async (query: string) => {
	try {
		const response: Array<SearchResponse> = await makeVespifyRequest({
			path: `/videos/search`,
			method: 'POST',
			payload: {
				query
			}
		});

		return response;
	} catch (err) {
		await logError(`services.vespify@search`, err, { query });
		throw err;
	}
};

/**
 * This function will get a realistic home feed of videos..
 * @returns The vespify home feed of videos for you to watch next.
 */

export const getHomeFeed = async () => {
	try {
		const response: Array<VideoCard> = await makeVespifyRequest({
			path: `/videos/getHomeFeed`,
			method: 'POST',
			payload: {}
		});
		return response;
	} catch (err) {
		await logError(`services.vespify@getHomeFeed`, err);
		throw err;
	}
};

/**
 *
 * @param id Id of the video
 * @returns All the data needed to render the video page.
 */

export const getVideo = async (id: string) => {
	try {
		const response: GetVideoResponse = await makeVespifyRequest({
			path: `/videos/getVideo`,
			method: 'POST',
			payload: { id }
		});
		return response;
	} catch (err) {
		await logError(`services.vespify@getVideo`, err);
		throw err;
	}
};

/**
 * This function will get you the channel information plus a few videos.
 * @param id Id of the channel
 * @returns Last 30 videos from that channel.
 */

export const getChannel = async (id: string) => {
	try {
		const response: GetChannelResponse = await makeVespifyRequest({
			path: `/videos/getChannel`,
			method: 'POST',
			payload: { id }
		});
		return response;
	} catch (err) {
		await logError(`services.vespify@getChannel`, err);
		throw err;
	}
};
