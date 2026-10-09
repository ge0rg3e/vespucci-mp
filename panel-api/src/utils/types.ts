declare global {
	// eslint-disable-next-line
	type ExpectedAny = any;

	// eslint-disable-next-line
	type UndefinedAny = any;

	// eslint-disable-next-line
	type FixableAny = any;

	type AccountLanguage = 'RO' | 'EN';

	export type InventoryItem = {
		id: string;
		pageId: number;
		itemId: number;
		slotId: number;
		quantity: number;
		meta: Record<string, ExpectedAny>;
		expiresAt: Date | null;
	};
}

export {};
