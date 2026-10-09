import { Businesses } from '@server/legacy/businesses/components/core';
import { logError } from '@server/utils/helpers';
import { getLanguagePack } from '@vmp/i18n';
import { iterateQuantity } from '../../generalStore/components/functions';

/**
 * This will show the ammu nation main dialog.
 * @param player
 * @param meta
 */

export const showBuyDialog = async (player: PlayerMp, meta: { businessId: number; actionId: string }) => {
	try {
		// Get the language
		const lang = getLanguagePack('BusinessAmmuNation:MainDialog', player.lang);

		let buttons = [{ text: lang.get('Use'), key: 'F' }];

		// If is the business that also has the license center.
		if (meta.businessId === 35) {
			buttons.push({ text: lang.get('GetLicense'), key: 'G' });
		}

		// Show it to the player..
		player.showPlayerDialog({
			dialogId: `ammuNation.sellerMenu`,
			icon: 'information',
			hideInSeconds: null,
			appearInSeconds: 1,
			type: 'message',
			buttons,
			title: lang.get('DialogTitle'),
			content: lang.get('DialogContent'),
			footer: player.getAdminLevel() !== 0 ? lang.get('DialogFooter', { id: meta.businessId }) : undefined,
			payload: {
				businessId: meta.businessId,
				actionId: meta.actionId
			}
		});
	} catch (err) {
		await logError(`business.ammuNation.showBuyDialog`, err);
	}
};

/**
 * This function will show the player the shop interface for ammu nation.
 * @param player
 * @param dialogResponse
 * @returns
 */

export const showShopInterface = async (player: PlayerMp, dialogResponse: DialogResponse) => {
	// Hide the dialog from showing up if they press F quickly
	player.hidePlayerDialog();

	// Get buypoint coords for the camera
	const business = Businesses.find((b) => b.id === dialogResponse.payload.businessId);
	if (!business) return false;

	// Get the actor seller
	const actorSeller = business.locations.actors?.find((e) => e.identifier === 'seller');
	if (!actorSeller) return false;

	// Updating the variables..
	player.updateVars({
		shop: {
			id: `business:ammuNation`,
			title: {
				EN: 'Ammu-Nation',
				RO: 'Ammu-Nation'
			},
			payload: {
				business: {
					id: business.id
				}
			}
		}
	});

	// Inform amplitude..
	player.createAmplitudeEvent('Using Ammu-Nation', {
		money: player.info.money
	});

	// Triggering the interface
	player.triggerClientEvent(`shop:show`);

	return true;
};

/**
 *
 * @returns The items the user can buy from the ammu nation
 */

export const getShopProducts = () => {
	// The list of create shop items..
	const items: Array<CreateShopItem> = [
		{
			id: 'bat',
			type: 'item',
			data: {
				itemId: 25,
				restrictions: {
					minimumLevel: 3
				},
				meta: {
					weaponId: 2,
					ammo: 1,
					components: [],
					tint: 0,
					meta: {}
				},
				prices: {
					cash: 500
				}
			}
		},
		{
			id: 'knuckle',
			type: 'item',
			data: {
				itemId: 25,
				restrictions: {
					minimumLevel: 3
				},
				meta: {
					weaponId: 10,
					ammo: 1,
					components: [],
					tint: 0,
					meta: {}
				},
				prices: {
					cash: 500
				}
			}
		},
		{
			id: 'knife',
			type: 'item',
			data: {
				itemId: 25,
				restrictions: {
					minimumLevel: 3
				},
				meta: {
					weaponId: 11,
					ammo: 1,
					components: [],
					tint: 0,
					meta: {}
				},
				prices: {
					cash: 500
				}
			}
		},
		{
			id: 'pistol',
			type: 'item',
			data: {
				itemId: 25,
				restrictions: {
					minimumLevel: 5
				},
				meta: {
					weaponId: 19,
					ammo: 12,
					components: [],
					tint: 0,
					meta: {}
				},
				prices: {
					cash: 10000
				}
			}
		},
		{
			id: 'ammoPistol',
			type: 'item',
			data: {
				itemId: 26,
				meta: {
					type: 'pistol'
				},
				prices: {
					cash: 100
				}
			}
		}
	];

	return items;
};

/**
 * This function validates if the basket of the player that he's about to buy is valid.
 * @param player
 * @param item
 * @returns
 */

export const validateBasketItem = async (player: PlayerMp, item: ExpectedAny) => {
	try {
		const product = getShopProducts().find((c) => c.id === item.id);

		// Get the language
		const lang = getLanguagePack('BusinessAmmuNation:BasketValidation', player.lang);

		// Validate if there is enough space
		if (product!.type === 'item') {
			const enoughSpace = player.checkEnoughSpaceForItem(product!.data.itemId!, item.quantity);
			// Not enough space
			if (!enoughSpace) return player.toast({ message: lang.get('NotEnoughSpace'), type: 'error' });
		}

		// Check if they have enough money
		if (product!.data.prices.cash && !player.hasEnoughMoney(product!.data.prices.cash)) {
			return player.toast({ message: lang.get(`NotEnoughMoney`), type: 'error' });
		}

		return true;
	} catch (err) {
		await logError(`validateBasketItem:GeneralStore`, err);
		return false;
	}
};

export const purchaseBasketItem = async (player: PlayerMp, item: { id: string; quantity: number }, product: CreateShopItem) => {
	try {
		// Get item data
		const itemData = mp.items.getItem(product.data.itemId!);
		if (!itemData) return false; // Error.

		// If the item is stackable we give it like this.
		if (itemData.stackable) {
			// Give the item to the player now that he paid for it..
			player.giveItem(product.data.itemId!, item.quantity, product.data.meta || {});
		} else {
			// The bullets are an exception.
			if (product.data.itemId === 26) {
				player.giveItem(26, item.quantity, product.data.meta || {});
			} else {
				// Give the player the amount of items bought
				iterateQuantity(item.quantity).forEach(() => player.giveItem(product.data.itemId!, 1, product.data.meta || {}));
			}
		}

		// Reducing the money amount according to quantity
		player.takeMoney(product.data.prices.cash * item.quantity);

		return true;
	} catch (err) {
		await logError(`ammuNation:purchaseItems`, err);
		throw err;
	}
};
