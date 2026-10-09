export type InventoryItem = {
	id: string;
	pageId: number;
	itemId: number;
	slotId: number;
	quantity: number;
	meta: ExpectedAny;
	expiresAt: Date | null;
};
