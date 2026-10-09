export type GroupObject = {
	id: string;
	getTitle: (opts: getTitleProperties) => string;
	permissions: Array<string>;
	meta: Record<string, ExpectedAny>;
};

export type getTitleProperties = {
	scope?: 'chatTitle' | 'groupName' | 'singular';
	meta?: {
		includeLevel?: boolean;
	};
};

export type CreateGroupObject = {
	id: string;
	getTitle: (opts: getTitleProperties) => string;
	inheritance?: Array<string>;
	permissions: Array<string>;
	permissionsInheritedFilteredOut?: Array<string>;
	meta?: Record<string, ExpectedAny>;
};

export {};
