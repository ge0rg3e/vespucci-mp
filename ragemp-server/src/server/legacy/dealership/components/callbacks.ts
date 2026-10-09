import { getVehicleNativeInfo } from '@server/natives/vehicles/components/core';
import { getDefaultVehicleModifications, getRandomRgb } from '@server/legacy/businesses/systems/tunning/components/functions';
import { createVehicle } from '@server/legacy/vehicles/components/core';
import { logError } from '@server/utils/helpers';
import { getLanguagePack } from '@vmp/i18n';
import * as rpc from 'rage-rpc';
import { Dealerships, updateDealershipStock } from './core';
import { last } from 'lodash';

// @Remember to always update: "onDealershipDeleted"

rpc.on('exitDealership', async (_, { player }: rpc.ProcedureInfo) => {
	if (!player) return false; // Avoiding TS Error.
	if (player.vars.dealershipId === null) return false;

	// Get the dealership he's in..
	const dealership = Dealerships.find((ds) => ds.id === player.vars.dealershipId);
	if (!dealership) return false;

	// Unload the dealership scene
	await player.invokeClientEvent(`leaveDealershipScene`, { lastCoords: dealership.coords });

	// Set the normal virtual world back
	player.dimension = 0;

	// Teleport the player back to where he was.. (Server-side too!)
	player.position = dealership.coords;

	// Update his variable.
	player.updateVars({
		dealershipId: null
	});

	// Create a nice amplitude event
	player.createAmplitudeEvent(`Exited dealership`);

	return true;
});

rpc.on(`purchaseVehicleDealership`, async (args, { player }: rpc.ProcedureInfo) => {
	try {
		if (!player) return false; // Avoiding TS Error.
		const { stockId, purchaseMethod, cost, colors } = JSON.parse(args);
		const lang = getLanguagePack('DealershipCallback:Buy', player.info.language);

		// Make sure he's in dealership
		if (player.vars.dealershipId === null) return false;

		// Get the dealership data..
		const dealership = Dealerships.find((d) => d.id === player.vars.dealershipId);
		if (!dealership) return false;

		// Is the dealership enabled? If not throw toast.
		if (dealership.isDisabled === true) return player.toast({ type: 'error', message: lang.get('Toast:DsIsDisabled') });

		// If the player doesn't have a phone
		if (!player.hasPhone()) return player.toast({ type: 'error', message: lang.get('Toast:NoPhone') });

		// Get vehicle stock..
		const vehicleStock = dealership.stocks.find((v) => v.id === stockId);
		if (!vehicleStock) return false;

		// Later will be used..
		const purchasePrice = purchaseMethod === 'cash' ? vehicleStock.price : vehicleStock.bcPrice;

		// Is here is enough stock for this vehicle if not throw toast + refresh interface.
		if (vehicleStock.quantity < 1) {
			player.refreshDealershipInterfaceData();
			return player.toast({ type: 'error', message: lang.get('Toast:NoStock') });
		}

		// Is this a vip only vehicle ? If yes does the player have vip?
		if (vehicleStock.minimumDonorTier && vehicleStock.minimumDonorTier > player.info.donorTier) {
			player.refreshDealershipInterfaceData();
			return player.toast({ type: 'error', message: lang.get('Toast:MinimumDonorTier', { tier: vehicleStock.minimumDonorTier }) });
		}

		// Getting native info for amplitude
		const nativeInfo = getVehicleNativeInfo({ model: vehicleStock.model });
		if (!nativeInfo) throw new Error(`Failed to find native info for model ${vehicleStock.model}`);

		// If purchase method is cash: Does the player have enough money?
		if (purchaseMethod === 'cash' && vehicleStock.price > player.info.money) {
			player.refreshDealershipInterfaceData();
			return player.toast({ type: 'error', message: lang.get('Toast:LowBalance', { type: 'cash', amount: vehicleStock.price }) });
		}

		// If purchase method is beach coins: Does the player have enough coins?
		if (purchaseMethod === 'coins' && vehicleStock.bcPrice > player.info.beachCoins) {
			player.refreshDealershipInterfaceData();
			return player.toast({ type: 'error', message: lang.get('Toast:LowBalance', { type: 'coins', amount: vehicleStock.bcPrice }) });
		}

		// Take the player money or coins based on purchase method..
		if (purchaseMethod === 'cash') {
			player.takeMoney(vehicleStock.price);
		} else if (purchaseMethod === 'coins') {
			player.saveInfo({
				beachCoins: player.info.beachCoins - vehicleStock.bcPrice
			});
		}

		// Checking if they had vehicles before..
		const hadVehiclesBefore = player.getNumberOfVehiclesOwned() !== 0 ? true : false;

		// Get the modifications..
		const modifications = getDefaultVehicleModifications(vehicleStock.model);

		// If they pre-selected rgb colors..
		if (colors) {
			modifications.colors = {
				type: 'rgb',
				values: colors
			};
		}
		// Create personal vehicle for player
		await createVehicle({
			model: vehicleStock.model,
			displayName: nativeInfo.displayName,
			modifications,
			ownerId: player.info.id,
			ownerName: player.info.username,
			fuel: nativeInfo.carTank
		});

		// Inform the player through phone of his purchase
		if (!hadVehiclesBefore) {
			player.notifyAboutAppAccess({ EN: 'Vehicles', RO: 'Vehicule' }, 'vehicles');
		}

		// Show success toast
		player.alert({ type: 'success', message: lang.get('Toast:Success', { model: nativeInfo.displayName, price: purchasePrice, purchaseMethod }) });

		// Reduce the dealership stock and update in database
		await updateDealershipStock(
			dealership.id,
			vehicleStock.id,
			{
				quantity: vehicleStock.quantity - 1
			},
			true
		);

		// Create a nice amplitude log: State purchase method,model, cost
		player.createAmplitudeEvent(`Bought vehicle from dealership`, {
			purchaseMethod,
			colors,
			cost,
			vehicleBought: {
				id: vehicleStock.id,
				model: vehicleStock.model,
				displayName: nativeInfo.displayName,
				stockAvailable: vehicleStock.quantity
			}
		});

		// Close dealership interface
		await player.invokeClientEvent(`leaveDealershipScene`, { lastCoords: dealership.coords });

		// Set the normal virtual world back
		player.dimension = 0;

		// Teleport the player back to where he was.. (Server-side too!)
		player.position = dealership.coords;

		// Update his variable.
		player.updateVars({
			dealershipId: null
		});

		// Refresh interface for all players in this dealership so they can see the stock updating.
		mp.players.forEachLoggedIn((p: PlayerMp) => {
			if (p.vars.dealershipId === dealership.id) {
				p.refreshDealershipInterfaceData();
			}
		});

		return true;
	} catch (err) {
		await logError(`PURCHASE_VEHICLE_DEALERSHIP`, err, { arguments: args, player: player?.info.username, dealershipId: player?.vars.dealershipId });
		return false;
	}
});

rpc.on(`testDriveDealership`, async (args, { player }: rpc.ProcedureInfo) => {
	try {
		if (!player) return false; // Avoiding TS Error.
		const { stockId, colors } = JSON.parse(args);
		const lang = getLanguagePack('DealershipCallback:TestDrive', player.info.language);

		// Make sure he's in dealership
		if (player.vars.dealershipId === null) return false;

		// Get dealership data..
		const dealership = Dealerships.find((d) => d.id === player.vars.dealershipId);
		if (!dealership) return false;

		// Is the dealership enabled? If not throw toast.
		if (dealership.isDisabled === true) return player.toast({ type: 'error', message: lang.get('Toast:DsIsDisabled') });

		// Get vehicle stock..
		const vehicleStock = dealership.stocks.find((v) => v.id === stockId);
		if (!vehicleStock) return false;

		// Get native info
		const nativeInfo = getVehicleNativeInfo({ model: vehicleStock.model });
		if (!nativeInfo) return false;

		// Hide dealership interface
		player.triggerBrowserEvent(`setDealershipInterfaceActiveState`, { boolean: false });

		// Generate a random RGB Color just in case..
		const randomRgbColor = getRandomRgb();

		player.triggerClientEvent('testDriveDealership', {
			enabled: true,
			model: vehicleStock.model,
			fuel: nativeInfo.carTank,
			colors: { type: 'rgb', values: colors ? colors : [randomRgbColor, randomRgbColor] }
		});

		// Create a nice amplitude log: State model
		player.createAmplitudeEvent('Test Drive in Dealership', {
			model: nativeInfo.displayName,
			dealershipId: dealership.id
		});

		// Show a nice instruction dialog..
		player.showPlayerDialog({
			dialogId: 'testDriveInstructions',
			title: lang.get('DialogTitle'),
			content: lang.get('DialogContent'),
			hideInSeconds: 6,
			icon: 'information',
			type: 'message'
		});

		// Updating vars
		player.updateVars({
			isTestDrivingInDealership: true
		});

		return true;
	} catch (err) {
		await logError(`PURCHASE_VEHICLE_DEALERSHIP`, err, { arguments: args, player: player?.info.username });
		return false;
	}
});

rpc.on(`testDriveDealershipEnded`, async (args, { player }: rpc.ProcedureInfo) => {
	try {
		if (!player) return false; // Avoiding TS Error.
		if (player.vars.dealershipId === null) return false;

		// Parse the argument..
		const { reason } = JSON.parse(args);

		// Get dealership data..
		const dealership = Dealerships.find((d) => d.id === player.vars.dealershipId);
		if (!dealership) return false;

		// End test drive..
		player.triggerClientEvent('testDriveDealership', { enabled: false });

		// Tracking it with amplitude..
		player.createAmplitudeEvent('Finished test drive', {
			dealershipId: dealership.id,
			reason
		});

		// Refresh ds data in case stock changed..
		player.refreshDealershipInterfaceData();

		// Updating vars
		player.updateVars({
			isTestDrivingInDealership: false
		});
		return true;
	} catch (err) {
		await logError('TEST_DRIVE_DEALERSHIP_ENDED', err);
		return false;
	}
});
