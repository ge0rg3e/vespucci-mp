export type SubEntry = {
	id: string;
	onClick?: onClick;
};

export type onClick = {
	action: string;
	payload: ExpectedAny;
};

export type Entry = {
	id: string;
	icon: string;
	onClick?: onClick;
	entries?: Array<SubEntry>;
};

export type Category = {
	id: string;
	entries: Array<Entry>;
};
