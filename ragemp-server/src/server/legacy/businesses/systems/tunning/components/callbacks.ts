import { Businesses } from '@server/legacy/businesses/components/core';
import { getIncreasedPriceByLevelAndPercentage, logError } from '@server/utils/helpers';
import * as rpc from 'rage-rpc';
import { vehicleModsIds } from './maps';

// Dependencies
import VehicleColors from '@natives/vehicles/components/colors';

import prices from './prices';
import { getLanguagePack } from '@vmp/i18n';
import { updateVehicle } from '@server/legacy/vehicles/components/core';

rpc.on('tunning:leave', async (_, { player }: rpc.ProcedureInfo) => {
	if (!player) return false; // Avoiding TS Error.
	try {
		if (player.vars.businessUsed === null) return false;

		// Get the business
		const business = Businesses.find((b) => b.id === player.vars.businessUsed?.id);
		if (!business || business.type !== 3) return false;

		// Get the action..
		const action = business.locations.callToActions.find((a) => a.id === player.vars.businessUsed!.meta!.actionId!);
		if (!action) return false;

		// Vars..
		const isDriver = player.seat === 0 ? true : false;

		// If is the passenger and only he leaves alone..
		if (isDriver === false) {
			// Lang for messages..
			const lang = getLanguagePack('Tunning:Messages', player.info.language);

			// Reset..
			player.removeFromVehicle();
			player.dimension = 0;
			player.updateVars({ businessUsed: null });

			// Hiding the cef..
			player.triggerClientEvent(`tunning:finishedDepartureScene`);

			// Send message to know what happened..
			player.sendServerMessage(`Server`, `system`, lang.get('LeftAsPassenger'), 'system');
			return false;
		}

		// Get the veh and the occupants..
		const vehicle = player.vehicle;
		const occupants = vehicle.getOccupantsPatched();

		// We loop through each car passenger..
		occupants.forEach((occupant) => {
			// Start the camera view..
			occupant.triggerClientEvent(`tunning:startDepartureScene`, {
				isDriver: player.seat === 0 ? true : false,
				camera: action.payload.outside.camera,
				finalDestination: action.payload.outside.finalPosition,
				isExit: true
			});

			// Hide cursor
			occupant.triggerClientEvent('tunning:showCursor', { value: false });
		});

		// Start the driving..
		player.triggerClientEvent(`tunning:driveVehicleToScene`, {
			coords: action.payload.outside.finalPosition,
			startPosition: action.payload.outside.startPosition,
			id: 'exit'
		});

		return true;
	} catch (err) {
		return false;
	}
});

rpc.on('tunning:finishedDepartureScene', async (_, { player }: rpc.ProcedureInfo) => {
	if (!player) return false; // Avoiding TS Error.
	if (!player.vehicle) return false;

	try {
		const vehicle = player.vehicle;
		const occupants = vehicle.getOccupantsPatched();

		// We put the vehicle first in the new dimension..
		vehicle.setDimension(0);

		// We loop through each car passenger..
		occupants.forEach((occupant) => {
			// Now he just finished leaving..
			occupant.updateVars({ businessUsed: null });

			// Show game hud now..
			occupant.triggerClientEvent('tunning:finishedDepartureScene');
		});

		return true;
	} catch (err) {
		return false;
	}
});

rpc.register('tunning:getSystemData', async (_, { player }: rpc.ProcedureInfo) => {
	if (!player || !player.vehicle) return false;

	try {
		if (!player.vars.businessUsed) return false;
		// Get the business
		const business = Businesses.find((b) => b.id === player.vars.businessUsed!.id);

		// Prepare the data
		const data: ExpectedAny = {
			isDriver: player.seat === 0 ? true : false,
			businessType: business?.configs.type,
			vehicle: {
				info: player.vehicle.getNativeInfo(),
				modifications: player.vehicle.vars.modifications
			},
			prices: prices,
			colors: VehicleColors,
			balance: player.info.money,
			mods: {
				ids: vehicleModsIds,
				compatible: []
			}
		};

		if (data.isDriver) {
			const mods = await player.invokeClientEvent('tunning:getModsCompatibleForVehicle', { vehicleId: player.vehicle.id, vehicleModsIds });
			data.mods.compatible = mods;
		}

		return data;
	} catch (err) {
		await logError(`tunning:getSystemData`, err);
		return false;
	}
});

rpc.on('tunning:purchase', async (args: string, { player }: rpc.ProcedureInfo) => {
	if (!player || !player.vehicle) return false;
	try {
		const { type, payload } = JSON.parse(args);
		const lang = getLanguagePack('Tunning:Purchase', player.info.language);

		// Variables
		let soundRequested: ExpectedAny = null;
		let updateInterface = false;
		const modifications = { ...player.vehicle.vars.modifications };

		if (type === 'repair') {
			// Check they have enough money
			if (player.info.money < prices.repair) {
				// Update the interface to send over their blaance
				player.triggerBrowserEvent(`tunning:updateSystemData`, { balance: player.info.money });

				// Inform them..
				return player.toast({ type: 'error', message: lang.get('NotEnoughMoney', { value: prices.repair }) });
			}

			// Take their money
			player.takeMoney(prices.repair);

			// Fix it.
			player.vehicle.repairVehicle();

			// Inform the player
			player.toast({ type: 'success', message: lang.get('VehicleRepaired'), silent: true });

			// Play sound..
			soundRequested = '/businesses/tunning/onPurchase/success.mp3';

			// Inform the interface to update
			updateInterface = true;
		}

		if (type === 'paint') {
			// Type of paint..
			const paintType = payload.type === 'normal' ? 'normal' : payload.type.split(':')[0];
			const specialPaintId = paintType === 'special' ? payload.type.split(':')[1] : null;

			// Format the price
			const priceUsed = prices.colors[paintType === 'normal' ? 'normal' : specialPaintId];
			if (priceUsed === undefined) throw new Error(`priceUsed was undefined for paintType: ${paintType}, ${specialPaintId}`);

			// Check they have enough money
			if (player.info.money < priceUsed) {
				// Update the interface to send over their blaance
				player.triggerBrowserEvent(`tunning:updateSystemData`, { balance: player.info.money });

				// Send toast..
				return player.toast({ type: 'error', message: lang.get('NotEnoughMoney', { value: priceUsed }) });
			}

			// Check that they have the required item.
			const itemRequired: ExpectedAny = { metallic: 4, matte: 5, premium: 6 };
			const hasItem = player.getInventoryItemMatch({ itemId: itemRequired[specialPaintId] });

			// Check it has item..
			if (paintType === 'special' && !hasItem) {
				// Get the item meta...
				const itemLang = getLanguagePack(`item:${itemRequired[specialPaintId]}`, player.info.language);
				if (!itemLang) throw new Error(`Failed to find item meta for ${itemRequired[specialPaintId]}`);

				// Return the toast.
				return player.toast({ type: 'error', message: lang.get('RequiresItem', { itemName: itemLang.get('name') }) });
			}

			// Take the item used if any..
			if (paintType === 'special' && hasItem) {
				player.reduceItem(hasItem.id, 1);
			}

			// Take the money..
			player.takeMoney(priceUsed);

			// Set the modification..
			modifications.colors = {
				type: paintType === 'normal' ? 'rgb' : 'normal',
				values: payload.values
			};

			// Play sound..
			soundRequested = '/businesses/tunning/onPurchase/paint.mp3';

			// Inform the interface to update
			updateInterface = true;
		}

		if (type === 'plate') {
			// Check they have enough money
			if (player.info.money < prices.changePlateText) {
				// Update the interface to send over their blaance
				player.triggerBrowserEvent(`tunning:updateSystemData`, { balance: player.info.money });

				// Send toast..
				return player.toast({ type: 'error', message: lang.get('NotEnoughMoney', { value: prices.plate }) });
			}

			// Take the money..
			player.takeMoney(prices.changePlateText);

			// Save the modification..
			modifications['plate'] = payload.value;

			// Play this sound..
			soundRequested = '/businesses/tunning/onPurchase/plate.wav';

			// Inform the interface to update
			updateInterface = true;
		}

		if (type === 'neon') {
			// If we're buying neons..
			if (payload.value !== null) {
				// Check they have enough money
				if (player.info.money < prices.neon) {
					// Update the interface to send over their blaance
					player.triggerBrowserEvent(`tunning:updateSystemData`, { balance: player.info.money });

					// Send toast..
					return player.toast({ type: 'error', message: lang.get('NotEnoughMoney', { value: prices.neon }) });
				}

				// Take the money..
				player.takeMoney(prices.neon);
			}

			// Save the modification..
			if (payload.value) {
				modifications.neon = payload.value;
			} else {
				delete modifications.neon;
			}

			// Play this sound..
			soundRequested = payload.value ? '/businesses/tunning/onPurchase/success.mp3' : '/businesses/tunning/onPurchase/onRemove.wav';

			// Inform the interface to update
			updateInterface = true;
		}

		if (type === 'mods') {
			const { modKey, modType, modId } = payload;

			// If they're buying something..
			if (modId !== null) {
				// Check money
				let price = prices.mods[modKey];
				if (!price) throw new Error(`Failed to find price for ${modKey}`);

				// Formatting the price if it should multiply...
				if (prices.multiplyingFactors[modKey]) {
					price = getIncreasedPriceByLevelAndPercentage(prices.mods[modKey], prices.multiplyingFactors[modKey], modId + 1);
				}

				// Check they have enough money
				if (player.info.money < price) {
					// Update the interface to send over their blaance
					player.triggerBrowserEvent(`tunning:updateSystemData`, { balance: player.info.money });

					// Show toast..
					return player.toast({ type: 'error', message: lang.get('NotEnoughMoney', { value: price }) });
				}

				// Take the money..
				player.takeMoney(price);
			}

			// If is null it means the user removed the mod so we delete the key to keep the data clean.
			if (modId === null) {
				delete modifications.mods[modType];
			} else {
				modifications.mods[modType] = modId;
			}

			const soundsByMod: ExpectedAny = {
				engine: 'engine.mp3',
				suspension: 'hydraulics.mp3',
				hydraulics: 'hydraulics.mp3',
				boost: 'boost.mp3',
				armor: 'armor.wav',
				default: 'modInstalled.wav'
			};

			// Play sound..
			soundRequested = `/businesses/tunning/onPurchase/${modId !== null ? soundsByMod[modKey] || soundsByMod['default'] : 'onRemove.wav'}`;

			// Inform the interface to update
			updateInterface = true;
		}

		if (type === 'wheels') {
			const { wheelType, modId, key } = payload;

			// They want to buy something..
			if (wheelType !== null) {
				const price = prices.wheels[key];
				if (!price) throw new Error(`Failed to find price for wheel type: ${key}`);

				// Check they have enough money

				if (player.info.money < price) {
					// Update the interface to send over their blaance
					player.triggerBrowserEvent(`tunning:updateSystemData`, { balance: player.info.money });

					// Send toast..
					return player.toast({ type: 'error', message: lang.get('NotEnoughMoney', { value: price }) });
				}

				// Take the money..
				player.takeMoney(price);
			}

			if (wheelType !== null) {
				modifications.wheelType = wheelType;
				modifications.mods[23] = modId;
			} else {
				delete modifications.wheelType;
				delete modifications.mods[23];
			}

			// Play sound..
			soundRequested = `/businesses/tunning/onPurchase/${wheelType !== null ? 'wheels.mp3' : 'onRemove.wav'}`;

			// Inform the interface to update
			updateInterface = true;
		}

		if (type === 'tireSmoke') {
			const { value } = payload;

			// They want to buy something..
			if (value !== null) {
				const price = prices.tireSmoke;
				if (!price) throw new Error(`Failed to find price for tire smoke`);

				// Check they have enough money

				if (player.info.money < price) {
					// Update the interface to send over their blaance
					player.triggerBrowserEvent(`tunning:updateSystemData`, { balance: player.info.money });

					// Send toast..
					return player.toast({ type: 'error', message: lang.get('NotEnoughMoney', { value: price }) });
				}

				// Take the money..
				player.takeMoney(price);
			}

			if (value !== null) {
				modifications.tireSmoke = value;
			} else {
				delete modifications.tireSmoke;
			}

			// Play sound..
			soundRequested = `/businesses/tunning/onPurchase/${value !== null ? 'modInstalled.wav' : 'onRemove.wav'}`;

			// Inform the interface to update
			updateInterface = true;
		}

		if (type === 'xenonLights') {
			const { value } = payload;

			// They want to buy something..
			if (value !== null) {
				const price = prices.xenonLights;
				if (!price) throw new Error(`Failed to find price for xenon lights`);

				// Check they have enough money

				if (player.info.money < price) {
					// Update the interface to send over their blaance
					player.triggerBrowserEvent(`tunning:updateSystemData`, { balance: player.info.money });

					// Send toast..
					return player.toast({ type: 'error', message: lang.get('NotEnoughMoney', { value: price }) });
				}

				// Take the money..
				player.takeMoney(price);
			}

			if (value !== null) {
				modifications.xenonLights = value;
			} else {
				delete modifications.xenonLights;
			}

			// Play sound..
			soundRequested = `/businesses/tunning/onPurchase/${value !== null ? 'modInstalled.wav' : 'onRemove.wav'}`;

			// Inform the interface to update
			updateInterface = true;
		}

		// If the operation is successfull..
		if (updateInterface) {
			// If sound is requested..
			if (soundRequested) {
				player.playSoundEffect(`${`__ASSETS__`}/audios/systems${soundRequested}`, { volume: 0.03 });
			}

			// Update the vehicle modifications
			player.vehicle.updateVars({ modifications });

			// If it is a personal vehicle we will save the modifications on the personal vehicle too..
			if (player.vehicle.vars.pVehicle) {
				updateVehicle(player.vehicle.vars.pVehicle, { modifications }, false);
			}

			// Update the interface to send over the new modifications..
			player.triggerBrowserEvent(`tunning:updateSystemData`, {
				balance: player.info.money,
				vehicle: {
					info: player.vehicle.getNativeInfo(),
					modifications
				}
			});
		}

		// Logs
		player.createAmplitudeEvent('Modified in car tunning', {
			type,
			...payload
		});

		return false;
	} catch (err) {
		await logError('tunning_purchase:repair', err, { args });
		return false;
	}
});
