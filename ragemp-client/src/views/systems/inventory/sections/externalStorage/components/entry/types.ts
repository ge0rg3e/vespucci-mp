export type SeparatedItem = {
	id: string;
	itemId: number;
	slotId: number;
	quantity: number;
	meta: ExpectedAny;
	expiresAt: Date | null;
};
