import { Businesses } from '@server/legacy/businesses/components/core';
import { addToPhoneBook, getPhoneNumberAllocated } from '@server/legacy/phone/components/phoneBook';
import { getNativeWeapon } from '@server/natives/weapons/components/core';
import { logError } from '@server/utils/helpers';
import { Languages, getLanguagePack } from '@vmp/i18n';
import { Clothes } from '../../clothes/components/core';

/**
 * This function will show the player the shop interface.
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
			id: `business:generalStore`,
			title: {
				EN: 'General Store',
				RO: 'Magazin general'
			},
			payload: {
				business: {
					id: business.id
				}
			}
		}
	});

	// Inform amplitude..
	player.createAmplitudeEvent('Using General Store', {
		money: player.info.money
	});

	// Triggering the interface
	player.triggerClientEvent(`shop:show`);

	return true;
};

/**
 * This function will get the shop item's meta (name, description, properties) etc.
 * @returns
 */

export const getShopItemsMeta = async (actioner: PlayerMp, source: Array<CreateShopItem>): Promise<Array<ShopItem>> => {
	try {
		// Extract..
		const items: ExpectedAny = [...source];

		// Iterate and map all items.
		for (let index = 0; index < items.length; index++) {
			const item: CreateShopItem = items[index];

			try {
				// Game items need to have the meta extracted.
				if (item.type === 'item') {
					// Get the item meta for image.
					const itemData = mp.items.getItem(item.data!.itemId!);
					if (!itemData) throw new Error(`This item id does not have data on server-side: ${item.data?.itemId}`);

					// Get the language to extract name and description
					const itemLang = getLanguagePack(`item:${item.data?.itemId}`, actioner.lang);

					// Format the properties
					const properties = itemData.getProperties
						? await itemData.getProperties({ player: actioner, meta: item.data.meta ? item.data.meta : {}, shopId: 'generalStore', itemData: itemData, lang: itemLang })
						: [];

					let name = itemLang.get('name');
					let description = itemLang.get('description');

					// If is a weapon
					if (itemData.id === 25) {
						const nativeWeapon = getNativeWeapon({ id: item.data.meta!.weaponId });
						if (!nativeWeapon) throw new Error(`failed to find weapon data for ${item.data.meta!.weaponId}`);

						name = nativeWeapon.displayName;
						description = nativeWeapon.description;
					}

					// If is a clothing
					if (itemData.id === 3) {
						const clothing = Clothes.find((c) => c.id === item.data.meta!.clothingId);
						if (!clothing) throw new Error(`failed to find clothing data for ${item.data.meta!.clothingId}`);

						name = clothing.name;
					}

					// Generating the meta..
					const details = {
						name,
						description,
						properties: properties // For now let's leave this like that. to be figured out later.
					};

					// Update the array
					items[index].details = details;
				} else if (item.type === 'shopItem') {
					// Generate the meta for shop item
					if (!item.details) throw new Error(`Shop item ${item.id} has no meta attached. Add meta to it.`);

					// Generate the meta..
					const details = {
						name: getSimulatedLanguage(item.details!.name, actioner.lang),
						description: getSimulatedLanguage(item.details!.description, actioner.lang),
						image: item.details?.image,
						properties: item.details.properties
							? item.details.properties.map((prop) => ({
									label: getSimulatedLanguage(prop.label, actioner.lang),
									value: getSimulatedLanguage(prop.value, actioner.lang)
									// eslint-disable-next-line no-mixed-spaces-and-tabs
							  }))
							: []
					};

					// Update the array
					items[index].details = details;
				}
			} catch (err) {
				logError(`GET_SHOP_ITEMS_META_ENTRY`, err, { item });
			}
		}

		return items;
	} catch (err) {
		logError(`GET_SHOP_ITEMS_META`, err);
		throw err;
	}
};

/* A function I made up for a quick way to transform variables into language pack */

export const getSimulatedLanguage = (languagePack: Languages, langCode: keyof Languages) => {
	const match = languagePack[langCode];

	if (!match) return languagePack['EN'];

	return languagePack[langCode];
};

/**
 *
 * @returns The items the user can buy from the game store.
 */

export const getShopProducts = () => {
	// The list of create shop items..
	const items: Array<CreateShopItem> = [
		{
			id: 'phone',
			type: 'item',
			data: {
				itemId: 7,
				prices: {
					cash: 2000
				},
				restrictions: {
					maxOwned: 1
				}
			}
		},
		{
			id: 'phoneCredit',
			type: 'shopItem',
			data: {
				prices: {
					cash: 500
				}
			},
			details: {
				name: {
					EN: 'Phone Credit',
					RO: 'Credit telefon'
				},
				description: {
					EN: 'Top up your phone credit so you can make calls and receive messages.',
					RO: 'Incarca-ti creditul telefonului pentru a putea face apeluri si mesaje.'
				},
				image: 'generalStore/phoneCredit.png'
			}
		},
		// {
		// 	id: 'tablet',
		// 	type: 'item',
		// 	data: {
		// 		itemId: 8,
		// 		prices: {
		// 			cash: 5000
		// 		},
		// 		restrictions: {
		// 			minimumLevel: 3
		// 		}
		// 	}
		// },
		{
			id: 'walkieTalkie',
			type: 'item',
			data: {
				itemId: 10,
				prices: {
					cash: 500
				}
			}
		},
		{
			id: 'dices',
			type: 'item',
			data: {
				itemId: 11,
				prices: {
					cash: 100
				}
			}
		},
		{
			id: 'bluetoothSpeaker',
			type: 'item',
			data: {
				itemId: 14,
				prices: {
					cash: 3000
				},
				restrictions: {
					minimumLevel: 6
				}
			}
		},
		{
			id: 'gasCanister',
			type: 'item',
			data: {
				itemId: 19,
				meta: {
					litres: 0
				},
				prices: {
					cash: 200
				},
				restrictions: {
					minimumLevel: 3
				}
			}
		},
		{
			id: 'smokes',
			type: 'item',
			data: {
				itemId: 12,
				prices: {
					cash: 500
				}
			}
		},
		{
			id: 'lighter',
			type: 'item',
			data: {
				itemId: 13,
				prices: {
					cash: 200
				}
			}
		},
		// {
		// 	id: 'zippingBags',
		// 	type: 'item',
		// 	data: {
		// 		itemId: 16,
		// 		prices: {
		// 			cash: 500
		// 		}
		// 	}
		// },
		// {
		// 	id: 'rollingPaper',
		// 	type: 'item',
		// 	data: {
		// 		itemId: 17,
		// 		prices: {
		// 			cash: 500
		// 		}
		// 	}
		// },
		{
			id: 'mechanicalToolkit',
			type: 'item',
			data: {
				itemId: 18,
				prices: {
					cash: 1000
				}
			}
		},
		{
			id: 'bandages',
			type: 'item',
			data: {
				itemId: 15,
				prices: {
					cash: 2000
				},
				restrictions: {
					maxOwned: 5
				}
			}
		},
		{
			id: 'chips',
			type: 'item',
			data: {
				itemId: 20,
				prices: {
					cash: 200
				}
			}
		},
		{
			id: 'sandwich',
			type: 'item',
			data: {
				itemId: 21,
				prices: {
					cash: 500
				}
			}
		},
		{
			id: 'water',
			type: 'item',
			data: {
				itemId: 22,
				prices: {
					cash: 200
				}
			}
		},
		{
			id: 'beer',
			type: 'item',
			data: {
				itemId: 23,
				prices: {
					cash: 500
				}
			}
		},
		{
			id: 'coffee',
			type: 'item',
			data: {
				itemId: 24,
				prices: {
					cash: 500
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
		const lang = getLanguagePack('BusinessGeneralStore:BasketValidation', player.lang);

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

		// Validate if they have enough space??
		if (item.id === 'phone') {
			// If they a phone already they can't buy another one.
			if (player.hasPhone()) return player.toast({ message: lang.get('Phone:AlreadyHasOne'), type: 'error' });

			// you can't buy more than one phone.
			if (item.quantity > 1) return player.toast({ message: lang.get('Phone:BuyMoreThanOne'), type: 'error' });
		}

		// If they try to buy dices..
		if (item.id === 'dices') {
			// If they already own
			if (player.getInventoryItemMatch({ itemId: 11 }) !== null) return player.toast({ message: lang.get('AlreadyOwn:Dices'), type: 'error' });

			// If they try to buy more than one
			if (item.quantity > 1) return player.toast({ message: lang.get(`MoreThanOne:Dices`), type: 'error' });
		}

		// By default we will say that the rest are valid.
		return true;
	} catch (err) {
		await logError(`validateBasketItem:GeneralStore`, err);
		return false;
	}
};

export const purchaseBasketItem = async (player: PlayerMp, item: { id: string; quantity: number }, product: CreateShopItem) => {
	try {
		if (item.id === 'phone' && product.type === 'item') {
			// Generate a phone number
			const phoneNumber = getPhoneNumberAllocated();

			// Add an entry to the player's phone book with their ID and the allocated phone number
			addToPhoneBook(player.info.id, phoneNumber);

			// Give the player an item with ID 7 (representing a phone) and attach the allocated phone number to it
			player.giveItem(7, 1, { phoneNumber });

			// Assign the allocated phone number to the player's information object
			player.saveInfo({ phoneNumber });

			// Trigger a client event to make the phone visible for the player
			player.triggerClientEvent('setPhoneIsVisible', { boolean: true });

			// Reducing the money amount
			player.takeMoney(product.data.prices.cash);
			return true;
		}

		if (item.id === 'phoneCredit' && product.type === 'shopItem') {
			// Calculate credts
			const creditsBought = 2500 * item.quantity;

			// Set the phone credit
			player.saveInfo({ phoneCredits: player.info.phoneCredits + creditsBought });

			// Reducing the money amount
			player.takeMoney(product.data.prices.cash * item.quantity);
			return true;
		}

		if (item.id === 'smokes' && product.type === 'item') {
			// Give the player the amount of items bought
			iterateQuantity(item.quantity).forEach(() => player.giveItem(12, 1, { cigarettes: 3 }));

			// Reducing the money amount according to quantity bought.
			player.takeMoney(product.data.prices.cash * item.quantity);

			return;
		}

		if (item.id === 'gasCanister' && product.type === 'item') {
			// Give the player the amount of items bought
			iterateQuantity(item.quantity).forEach(() =>
				player.giveItem(19, 1, {
					litres: 0
				})
			);

			// Reducing the money amount according to quantity bought.
			player.takeMoney(product.data.prices.cash * item.quantity);

			return true;
		}

		if (item.id === 'dices' && product.type === 'item') {
			// Get language
			const lang = getLanguagePack('BusinessGeneralStore:PurchaseBasket', player.lang);

			// Give the player the amount of items bought
			player.giveItem(11, 1, {
				totalGames: 0,
				wins: 0
			});

			// Reducing the money amount according to quantity bought.
			player.takeMoney(product.data.prices.cash);

			// Show success
			player.alert({ type: 'success', message: lang.get(`Alert:DicesBought`) });
			return true;
		}

		if (item.id === 'walkieTalkie' && product.type === 'item') {
			// Give the player the amount of items bought
			iterateQuantity(item.quantity).forEach(() => player.giveItem(10, 1, {}));

			// Reducing the money amount according to quantity bought.
			player.takeMoney(product.data.prices.cash * item.quantity);

			return true;
		}

		if (item.id === 'bluetoothSpeaker' && product.type === 'item') {
			// Give the player the amount of speakers bought
			iterateQuantity(item.quantity).forEach(() => player.giveItem(14, 1, { type: 1 }));

			// Reducing the money amount according to quantity bought.
			player.takeMoney(product.data.prices.cash * item.quantity);

			return;
		}

		// Get item data
		const itemData = mp.items.getItem(product.data.itemId!);
		if (!itemData) return false; // Error.

		// If the item is stackable we give it like this.
		if (itemData.stackable) {
			// Give the item to the player now that he paid for it..
			player.giveItem(product.data.itemId!, item.quantity, {});
		} else {
			// Give the player the amount of items bought
			iterateQuantity(item.quantity).forEach(() => player.giveItem(product.data.itemId!, 1, {}));
		}

		// Reducing the money amount according to quantity
		player.takeMoney(product.data.prices.cash * item.quantity);

		return true;
	} catch (err) {
		await logError(`generalStore:purchaseItems`, err);
		throw err;
	}
};

// A simple way to create a fake array so we can iterate accordingly.
export const iterateQuantity = (number: number) => Array(number).fill(null);
