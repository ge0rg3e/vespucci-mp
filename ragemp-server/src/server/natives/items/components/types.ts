import { InventoryItem } from '@server/legacy/inventory/components/types';
import { Languages } from '@vmp/i18n';

export type itemCallbackMeta = { data: InventoryItem; item: itemObject; actioner: PlayerMp; target: PlayerMp; separated?: boolean };
export type itemCallback = (player: PlayerMp, meta: itemCallbackMeta) => void;
export type itemCallbackExtended = (
	player: PlayerMp,
	itemSource: 'inventory' | 'separated',
	meta: { data: InventoryItem | SeparatedItem; item: itemObject; actioner: PlayerMp; target: PlayerMp; separated?: boolean }
) => void;

// This will help us.
// Real life exampple: We have hats, torso, pants. All are different Ids.
// But they're all Type 2. So we know they can be "worn"

export type itemTypes =
	| 1 // General
	| 2; // Clothes

export type itemCallbackTypes = 'use' | 'destroy' | 'dropped' | 'traded';

export type itemCallbacks = {
	use?: itemCallback;
	destroy?: itemCallback;
	dropped?: itemCallback;
	traded?: itemCallback;
	expired?: itemCallbackExtended;
};

export type itemObject = {
	id: number;
	callbacks: itemCallbacks;
	type: itemTypes;
	limit?: number;
	usable: boolean;
	droppable?: boolean;
	dispensable?: boolean;
	tradable?: boolean;
	stackable?: boolean;
	notDepositable?: boolean;
	unDestroyable?: boolean;
	getProperties?: (params: { player: PlayerMp; meta: ExpectedAny; shopId: string | null; itemData?: ExpectedAny; lang?: LanguageCallback }) => Array<{ label: string; value: string }> | undefined;
};

export type createItemObject = {
	id: number;
	name: Languages;
	description: Languages;
	callbacks: itemCallbacks;
	type?: itemTypes;
	limit?: number;
	usable?: boolean;
	droppable?: boolean /** Can this item be dropped */;
	dispensable?: boolean /** Can this item be destroyed */;
	tradable?: boolean /** Can this item be traded */;
	stackable?: boolean;
	notDepositable?: boolean;
	unDestroyable?: boolean;
	getProperties?: itemObject['getProperties'];
	languages?: Record<string, Languages> /* If we need to define quickly other language components for example for items properties. */;
};

export type CreateDroppedItem = {
	itemId: number;
	quantity: number;
	meta: Record<string, ExpectedAny>;
	expiresAt: Date | null;
	droppedBy: string;
	position: Vector3;
	dimension: number;
	droppedAt: Date;
};

export interface DroppedItem extends CreateDroppedItem {
	id: string;
	droppedAt: Date;
}

export type DroppedItemMarker = {
	id: string;
	position: Vector3;
	items: Array<string>;
	dimension: number;
};
