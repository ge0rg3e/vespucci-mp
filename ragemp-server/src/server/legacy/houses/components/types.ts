import { HousesAttributes } from '@modules/database/game/houses/model/types';
import { Languages } from '@vmp/i18n';

declare global {
	interface SeparatedInventory {
		id: string;
		title: Languages;
		items: Array<SeparatedItem>;
		payload: Record<string, ExpectedAny>;
	}
	interface PlayerVariables {
		houseEntered: number | null;
		sleeping: boolean;
		separateInventory: null | SeparatedInventory;
	}

	type SeparatedItem = {
		id: string;
		itemId: number;
		slotId: number;
		quantity: number;
		meta: Record<string, ExpectedAny>;
		expiresAt: Date | null;
	};

	type HouseInventory = {
		username: string;
		items: Array<SeparatedItem>;
	};

	interface House extends Omit<HousesAttributes, 'coords' | 'inventories' | 'tenants'> {
		coords: Vector3;
		inventories: Array<HouseInventory>;
		tenants: Array<{
			name: string;
			meta: {
				canUseGarage: boolean;
			};
		}>;
	}
}

export {};
