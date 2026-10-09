export type DroppedItem = {
	id: string;
	itemId: number;
	quantity: number;
	meta: ExpectedAny;
	expiresAt: Date | null;
	droppedBy: string;
};
