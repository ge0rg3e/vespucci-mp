import { Dealerships } from './core';

mp.events.add('onDialogResponse', function (player, response) {
	if (response.dialogId !== 'dealershipMenu') return false;

	const dealershipId = response.payload.dealershipId;

	// Get the dealership...
	const ds = Dealerships.find((d) => d.id === dealershipId);
	if (!ds) return false; // Failed to find the dealership.

	if (response.responseKey === `F`) {
		// If the DS is disabled then this key shouldn't start the Dealership interface.
		if (ds.isDisabled && !player.checkPermission('feature.manageDealershipStock')) return false;

		// Showing the dealership interface
		// player.triggerClientEvent('changeDealershipInterface', { dealershipId: ds.id, isActive: true });
		mp.events.call('showDealershipInterface', player, ds.id);
	}

	if (response.responseKey === `G`) {
		// If he can't manage the dealership then he's not getting access
		if (!player.checkPermission('feature.manageDealershipStock')) return false;
		player.sendAdminMessage('Server', 'system', `This feature is not developed yet.`, 'system');
	}

	player.hidePlayerDialog();
	return;
});
