import * as rpc from 'rage-rpc';
import { getShopItemsMeta, getSimulatedLanguage } from '../../generalStore/components/functions';
import { logError } from '@server/utils/helpers';
import { getShopProducts, purchaseBasketItem, validateBasketItem } from './functions';
import { getLanguagePack } from '@vmp/i18n';

rpc.on('shop:requestInterfaceData', async (_, { player }: rpc.ProcedureInfo) => {
	if (!player || !player.vars.shop) return false;

	try {
		// Is not using the business ammu-nation shop.
		if (player.vars.shop.id !== 'business:ammuNation') return false;

		// Extract these
		let { title, payload } = player.vars.shop;

		// Get the items for sale
		let items: Array<ShopItem> = await getShopItemsMeta(player, getShopProducts());

		// Send the data to the client interface..
		player.triggerSocketEvent(`shop:receivedData`, {
			id: player.vars.shop.id,
			title: getSimulatedLanguage(title, player.lang),
			payload: payload,
			items,
			localInfo: {
				balance: {
					cash: player.info.money,
					beachCoins: player.info.beachCoins
				}
			}
		});

		return true;
	} catch (err) {
		await logError(`ammuNation:requestInterfaceData`, err, { username: player.info.username });
		return null;
	}
});

rpc.on('shop:onInteraceClosed', async (_, { player }: rpc.ProcedureInfo) => {
	if (!player || !player.vars.shop) return false;

	try {
		// Is not using the business ammu-nation.
		if (player.vars.shop.id !== 'business:ammuNation') return false;

		// Inform amplitude
		player.createAmplitudeEvent(`Closed the Ammu-Nation store`, { money: player.info.money });

		// Extract business id.
		const businessId = player.vars.shop.payload.business?.id;

		// Set this to null..
		player.updateVars({ shop: null });

		// Get clerk shop
		const actor = mp.actors.get(`business_${businessId}_seller`);
		if (!actor) return false;

		// Check the NPC speech..
		const isSpeaking = await actor.isAmbientSpeechPlaying();
		if (isSpeaking) return false;

		// Play the speech
		actor.playAmbientSpeechWithVoice('SHOP_GOODBYE', 'S_M_M_AMMUCOUNTRY_WHITE_MINI_01', 'SPEECH_PARAMS_FORCE_NORMAL_CLEAR');

		return true;
	} catch (err) {
		await logError(`generalStore:onInterfaceClosed`, err, { username: player.info.username });
		return null;
	}
});

rpc.register('shop:validateBasket@business:ammuNation', async (args, { player }: rpc.ProcedureInfo) => {
	if (!player || !player.vars.shop) return false;

	// Is not using the business ammu-nation.
	if (player.vars.shop.id !== 'business:ammuNation') return false;

	try {
		// Get the items
		const { items } = JSON.parse(args);

		// console.log('items', items);

		// The variable to know if something is invalid..
		let validBasket = true;

		// Going through their basket
		for (const item of items) {
			// If is already invalid no point in checking further
			if (validBasket === false) continue;

			// Validate this item..
			const isValid = await validateBasketItem(player, item);

			// If the response is not valid true..
			if (isValid !== true) {
				validBasket = false;
			}
		}

		return validBasket;
	} catch (err) {
		await logError(`ammuNation:validateBasket`, err, { username: player.info.username, args });
		return false;
	}
});

rpc.register('shop:purchaseItems@business:ammuNation', async (args, { player }: rpc.ProcedureInfo) => {
	if (!player || !player.vars.shop) return false;

	// Is not using the business ammu-nation.
	if (player.vars.shop.id !== 'business:ammuNation') return false;

	try {
		// Get the items
		const { items } = JSON.parse(args);

		// Get the products..
		const products = getShopProducts();

		// Get the language
		const lang = getLanguagePack('BusinessAmmuNation:PurchaseBasket', player.lang);

		// console.log('purchase items', items);

		// Going through their basket
		for (const item of items) {
			// Get the single product we bought..
			const product = products.find((e) => e.id === item.id);

			// For some reason this product didn't make it through.
			if (!product) continue;

			// Buying each item in the basket..
			await purchaseBasketItem(player, item, product);
		}

		// Inform the player in both ways.
		player.toast({ type: 'success', message: lang.get('Toast:CompletedPurchase') });

		// Update player balance..
		player.triggerSocketEvent(`shop:receivedData`, {
			localInfo: {
				balance: {
					cash: player.info.money,
					beachCoins: player.info.beachCoins
				}
			}
		});

		// Inform amplitude of what we bought
		player.createAmplitudeEvent(`Bought shop products from Ammu-Nation`, {
			items: items
				.map((c: ExpectedAny) => {
					const matchProduct = products.find((e) => e.id === c.id);
					if (!matchProduct) return null;

					return {
						...c,
						totalCost: matchProduct.data.prices.cash * c.quantity
					};
				})
				.filter((c: ExpectedAny) => c !== null),
			newBalance: {
				cash: player.info.money,
				beachCoins: player.info.beachCoins
			}
		});

		return true;
	} catch (err) {
		await logError(`ammuNation:purchaseItems`, err, { username: player.info.username, args });
		return false;
	}
});
