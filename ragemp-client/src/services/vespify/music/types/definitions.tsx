export type Song = {
	id: string;
	title: string;
	duration: number | null;
	artists: Array<{
		name: string;
		channelId: string;
	}>;
	thumbnail: string;
	album: {
		name: string;
		id: string;
	} | null;
};

export type Album = {
	id: string;
	title: string;
	year: string | null;
	thumbnail: string;
	artist: string;
};

export type Artist = {
	id: string;
	name: string;
	thumbnail: string;
};

export type Playlist = {
	id: string;
	title: string;
	author: string;
	thumbnail: string;
};

export type SearchTypes = 'all' | 'song' | 'album' | 'playlist' | 'artist';
