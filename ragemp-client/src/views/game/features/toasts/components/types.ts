type Params = {
	heading?: string;
	message: string;
	type: 'success' | 'error' | 'warning' | 'info';
	seconds?: number;
	silent?: boolean;
};
declare global {
	interface Window {
		toast(params: Params): void;
		clearToasts: FixableAny;
	}
}

export type EntryProps = {
	data: ExpectedAny;
	index: number;
	onDelete: () => void;
};

export {};
