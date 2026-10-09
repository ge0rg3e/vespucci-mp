import { Channel, Video } from './basic';

export type SearchResponse = {
	type: 'channel' | 'video';
	data: VideoCard | ChannelCard;
};

// This is what the API getVideo ret urns.
export type GetVideoResponse = {
	stream: string;
	information: Video;
	nextVideos: Array<VideoCard>;
	comments: {
		total: number;
		entries: Array<Comment>;
	};
};

export type GetChannelResponse = {
	information: Channel;
	videos: Array<ChannelCard>;
};
