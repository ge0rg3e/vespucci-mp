declare global {
	type VideoCard = {
		id: string;
		title: string;
		thumbnail: string;
		relativeDate: Date | null;
		views: string;
		duration: string;
		author: {
			id: string;
			avatar: string;
			name: string;
		};
	};

	type ChannelCard = {
		id: string;
		description: string;
		author: {
			id: string;
			name: string;
			avatar: string;
			subscribers: string;
			tag: string;
		};
	};
}

export {};
