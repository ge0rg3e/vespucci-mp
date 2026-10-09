export type InventoryItem = {
	id: string;
	pageId: number;
	itemId: number;
	slotId: number;
	quantity: number;
	meta: Record<string, ExpectedAny>;
	expiresAt: Date | null;
};

export type InventoryPage = {
	id: number;
	available: boolean;
};

declare global {
	interface PlayerInfo {
		inventory: Array<InventoryItem>;
	}
}

declare global {
	interface PlayerVariables {
		remoteInventoryId: number | null;
		invetoryLastPosition: Vector3;
		inventoryOpened: boolean;
	}
}

export {};
