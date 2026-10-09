export type Song = {
	id: string;
	title: string;
	duration: number | null;
	artists: Array<{
		name: string;
		id: string;
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

export type GetSongResponse = {
	stream: string;
	information: {
		id: string;
		title: string;
		duration: number;
		thumbnail: string | null;
		viewCount: number;
		description: string;
		artists: Array<{ id: string; name: string }>;
		album: { id: string; name: string } | null;
	};
	nextSongs: Array<Song>;
};

export type GetAlbumResponse = {
	information: {
		id: string;
		title: string;
		year: string;
		songsCount: string;
		totalDuration: string;
		thumbnail: string;
		artist: {
			name: string;
			id: string;
		};
		album: { id: string; name: string } | null;
	};

	songs: Array<{
		id: string;
		title: string;
		duration: number;
		artists: Array<{ name: string; id: string }>;
	}>;
};

export type GetPlaylistResponse = {
	information: {
		id: string;
		title: string;
		year: string;
		songsCount: string;
		totalDuration: string;
		thumbnail: string;
		author: {
			name: string;
			id: string;
		};
	};

	songs: Array<{
		id: string;
		title: string;
		duration: number;
		thumbnail: string;
		album: { id: string; name: string } | null;
		artists: Array<{ name: string; id: string }>;
	}>;
};

export type GetArtistResponse = {
	information: {
		title: string;
		description: string;
		thumbnail: string;
	};
	sections: Array<{
		title: string;
		contents: Array<{
			type: 'song' | 'playlist' | 'album' | 'artist';
			data:
				| Song
				| Playlist
				| Album
				| {
						// The artists are a bit weird here.
						name: string;
						id: string;
						thumbnail: string;
				  };
		}>;
	}>;
};
