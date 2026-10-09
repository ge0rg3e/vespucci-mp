export type Video = {
	id: string;
	title: string;
	description: string;
	views: string;
	relativeDate: Date | null;
	likes: number;
	duration: number;
	thumbnail: string;
	author: {
		id: string;
		name: string;
		avatar: string;
		subscribers: string;
	};
};

export type Comment = {
	id: string;
	likes: number;
	relativeDate: Date | null;
	text: string;
	author: {
		id: string;
		avatar: string;
		name: string;
	};
};

export type Channel = {
	author: {
		name: string;
		avatar: string;
		id: string;
		isVerified: boolean;
	};
	banner: string;
	channelHandle: string;
	id: string;
	subscribers: string;
	videos: string;
	description: string;
};
