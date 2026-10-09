import { itemCallbackMeta } from '@server/natives/items/components/types';
import { Languages } from '@vmp/i18n';

export type UseFoodItemParams = {
	identifier: string;
	item: itemCallbackMeta;
	type: 'eat' | 'drink';
	points: number;
};

declare global {
	type CreateShopItem = {
		id: string /* For now an string such as: phone, tablet in the future uuid. */;
		type: 'item' | 'shopItem' /* An item for sale can be either an in-game item or an shop only item aka is not visible in the inventory. */;
		data: {
			itemId?: number /* If is item then we need an item id. */;
			meta?: Record<string, ExpectedAny> /* Item Meta */;
			stockAvailable?: number /* What is the stock available? */ /* TO BE IMPLEMENTED LATER */;
			prices: {
				cash: number;
				beachCoins?: number;
			};
			restrictions?: {
				maxOwned?: number /* How many a player can own. */;
				minimumLevel?: number /* What is the minimum level they must have to buy this. */;
				minimumDonor?: number /* What is the minimum donor level.. (TO BE IMPLEMENTED LATER.)*/;
			};
		};
		/* Details must be manually inputted only for type: details. */
		details?: {
			name: Languages;
			image: string;
			description: Languages;
			properties?: Array<{ label: Languages; value: Languages }>;
		};
	};

	type ShopItem = {
		id: string /* For now an string such as: phone, tablet in the future uuid. */;
		type: 'item' | 'shopItem' /* An item for sale can be either an in-game item or an shop only item aka is not visible in the inventory. */;
		data: CreateShopItem['data'];
		// The Meta is now filled in as per the right language.
		details: {
			name: string;
			image: string;
			description: string;
			properties: Array<{ label: string; value: string }>;
		};
	};

	interface PlayerVariables {
		shop: {
			id: string;
			title: {
				EN: string;
				RO: string;
			};
			payload: Partial<{
				business: {
					id: number;
				};
			}>;
		} | null;
	}
}

export {};
