import { getVehicleNativeInfo } from '@server/natives/vehicles/components/core';
import { getLanguagePack } from '@vmp/i18n';
import moment from 'moment';
import { rentingLocations, rentingVehicles } from './core';

mp.events.add('onDialogResponse', function (player, response) {
	if (response.dialogId !== 'rentingLocationsMenu') return false;

	if (response.responseKey === `ENTER` && response.listItemSelected) {
		// Get the location
		const location = rentingLocations.find((r) => r.id === response.payload.rentingLocationId);
		if (!location) return false;

		// Get the location index
		const locationIndex = rentingLocations.findIndex((r) => r.id === response.payload.rentingLocationId);
		if (locationIndex === -1) return false;

		// Get the language
		const lang = getLanguagePack(`RentingLocations:DialogMenu`, player.info.language);

		// Getting the exact model selected
		const selectionIndex = response.listItemSelectedIndex;
		const selected = location.vehicles[selectionIndex];

		// Getting the native info..
		const nativeInfo = getVehicleNativeInfo({ model: selected.model });
		if (!nativeInfo) return false;

		// Check the stock available
		if (selected.stock < 1) {
			player.showRentingMenuDialog(response.payload.rentingLocationId, true);
			player.alert({ type: 'error', message: lang.get('Toast:NoStock') });
			return false;
		}

		// Checking that they have at least the minimum amount for a minute.
		if (player.info.money < selected.costPerMinute) return player.alert({ message: lang.get('Toast:NotEnoughMoney'), type: 'error' });

		// Checking that they are not renting in progress.
		if (rentingVehicles.find((v) => v.ownerId === player.info.id)) return player.alert({ message: lang.get('Toast:AlreadyRenting'), type: 'error' });

		// Check if they already have a key to another rent
		if (player.getInventoryItemMatch({ itemId: 2 })) return player.alert({ type: 'error', message: lang.get('Toast:AlreadyRenting') });

		// Take the initial 1 minute payment
		player.takeMoney(selected.costPerMinute);

		// Reduce the stock
		rentingLocations[locationIndex].vehicles[selectionIndex].stock--;

		// Creating expring date - it should expire within 30 minutes once received if not used.
		const d = moment().add(30, 'm').toDate();

		// Give them the item..
		player.giveItem(
			2,
			1,
			{
				model: selected.model,
				displayName: nativeInfo.displayName,
				rentingLocationId: location.id,
				costPerMinute: selected.costPerMinute
			},
			d
		);

		// Inform them how to use
		player.alert({ type: 'info', message: lang.get('Toast:Success') });

		// Track in amplitude
		player.createAmplitudeEvent(`Rented vehicle`, {
			model: nativeInfo.displayName,
			rentingLocationId: location.id,
			costPerMinute: selected.costPerMinute
		});
	}

	player.hidePlayerDialog();
	return;
});
