import { getLanguagePack } from '@vmp/i18n';
import moment from 'moment';

export const onUse = (player: PlayerMp, itemId: string) => {
	if (!player) return;

	// Get language pack
	const lang = getLanguagePack(`MechanicalToolKit`, player.lang);

	// Calculate the time 5 minutes ago
	const fiveMinutesAgo = moment().subtract(5, 'minutes');

	// Hide inventory
	player.closeInventory();

	// Check if the toolkit was used in the last 5 minutes
	const wasUsedInLast5Minutes = moment(player.vars.mechanicalToolkitUsedAt).isAfter(fiveMinutesAgo);

	// If it was used in the last 5 minutes, show an error message
	if (wasUsedInLast5Minutes) return player.alert({ type: 'error', message: lang.get('used') });

	// Check if the player is not in a vehicle
	if (!player.vehicle) return player.alert({ type: 'error', message: lang.get('notInVehicle') });

	// Check if the vehicle has any damage
	if (player.vehicle.bodyHealth > 999) return player.toast({ type: 'error', message: lang.get('notDamaged') });

	// Remove the item from the inventory
	player.reduceItem(itemId, 1);

	// Repair the vehicle
	player.vehicle.repairVehicle();

	// Update the timestamp for the toolkit's last usage
	player.updateVars({ mechanicalToolkitUsedAt: new Date() });

	// Show a success message
	player.alert({ type: 'success', message: lang.get('repaired') });
};
