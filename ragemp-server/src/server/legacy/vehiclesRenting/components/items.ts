import { getVehicleNativeInfo } from '@server/natives/vehicles/components/core';
import { InventoryItem } from '@server/legacy/inventory/components/types';
import { isInRange } from '@server/utils/helpers';
import { getLanguagePack } from '@vmp/i18n';
import { createRentingVehicle, rentingLocations } from './core';
import StaticRentingLocations from '@server/definitions/rentingLocations';

// Creating the function callbacks..

const onItemUse = async (player: PlayerMp, { data }: { data: InventoryItem | SeparatedItem }) => {
	// Get the language
	const lang = getLanguagePack('RentingLocations:Item', player.info.language);

	// Get the native info
	const nativeInfo = getVehicleNativeInfo({ model: data.meta.model });
	if (!nativeInfo) return false;

	// Check if he's inside a vehicle
	if (player.vehicle) return player.toast({ type: 'error', message: lang.get('InVehicle') });

	// Check if he's inside safezone
	if (player.vars.isInSafezone) return player.toast({ type: 'error', message: lang.get('InSafezone') });

	// Check if he's inside dimension or house
	if (player.vars.houseEntered || player.vars.garageEntered || player.dimension !== 0) return player.toast({ type: 'error', message: lang.get('InInterior') });

	// Check if he's nearby the pickup zone
	const nearbyRentingLocation = rentingLocations.find((r) => isInRange(player.position, r.pickupCoords, 5));
	if (nearbyRentingLocation) return player.toast({ type: 'error', message: lang.get('NearbyRentingLocation') });

	// Check if player is in water.
	const isInWater: boolean = await player.invokeClientEvent('isPlayerInWater')!;

	// Check if is boat and they're not in water.
	if (nativeInfo.class === 'boat' && isInWater === false) return player.toast({ type: 'error', message: lang.get('NotInWater') });

	// Take away the item since is one time use.
	player.reduceItem(data.id, 2);

	// Spawn the vehicle
	const { entity, id }: ExpectedAny = createRentingVehicle(player.info.id, data.meta.model, player.position, data.meta.costPerMinute);

	// Start the engine right away..
	if (nativeInfo.hasEngine) {
		entity.updateVars({
			engine: true
		});
	}

	// Marking the player as a renter.
	player.updateVars({
		rentingVehicleId: id
	});

	// Put player in vehicle
	player.putIntoVehicle(entity, 0);

	// Show an information dialog about how to stop this rent..
	player.showRentinginstructionsDialog(data.meta.costPerMinute);

	// Inform them how to use
	player.alert({ message: lang.get('Toast:Success'), type: 'info' });

	// Hide inventory...
	player.closeInventory();

	// Track in amplitude
	player.createAmplitudeEvent(`Used renting key`, {
		model: data.meta.model,
		costPerMinute: data.meta.costPerMinute,
		rentingLocationId: data.meta.rentingLocationId
	});
};

const increaseRentingStock = async (rentingLocationId: number, model: string) => {
	// Get location
	const location = rentingLocations.find((r) => r.id === rentingLocationId);
	if (!location) return false;

	// Get location index
	const locationIndex = rentingLocations.findIndex((r) => r.id === rentingLocationId);
	if (locationIndex === -1) return false;

	// Get the index
	const stockIndex = location.vehicles.findIndex((v) => v.model === model);
	if (stockIndex === -1) return false;

	// Increasing the stock again now since the key was never used..
	rentingLocations[locationIndex].vehicles[stockIndex].stock++;

	// @Bugfix: If the player had this car key from before the server restart it should not affect the stock.
	if (rentingLocations[locationIndex].vehicles[stockIndex].stock > StaticRentingLocations[locationIndex].vehicles[stockIndex].stock) {
		rentingLocations[locationIndex].vehicles[stockIndex].stock = StaticRentingLocations[locationIndex].vehicles[stockIndex].stock;
	}

	return true;
};

const onItemDestroy = async (player: PlayerMp, { data }: { data: InventoryItem }) => {
	increaseRentingStock(data.meta.rentingLocationId, data.meta.model);
	player.deleteItem(data.id);
	player.updateInventoryInterface();
	return true;
};

const onItemExpired = async (_: PlayerMp, __: string, { data }: { data: SeparatedItem | InventoryItem }) => {
	increaseRentingStock(data.meta.rentingLocationId, data.meta.model);
	return true;
};

// Creating the item required to rent vehicles..

mp.items.create({
	id: 2,
	name: {
		EN: `Vehicle keys`,
		RO: `Cheia mașinii`
	},
	description: {
		EN: `The keys to a rented vehicle`,
		RO: `Cheila de la un vehicul inchiriat`
	},
	droppable: false,
	tradable: false,
	stackable: false,
	dispensable: true,
	usable: true,
	callbacks: {
		use: onItemUse,
		destroy: onItemDestroy,
		expired: onItemExpired
	},
	getProperties: (player, meta) => {
		// Get the item..
		const lang = getLanguagePack('RentingLocations:Item', player.lang);

		// Return it..
		return [
			{
				label: lang.get('ItemTooltipData:VehicleModel'),
				value: meta.displayName
			},
			{
				label: lang.get('ItemTooltipData:costPerMinute'),
				value: meta.costPerMinute
			}
		];
	}
});
