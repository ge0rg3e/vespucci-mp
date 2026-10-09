import { showShopInterface } from './functions';

mp.events.add('onDialogResponse', async function (player, response) {
	if (response.dialogId !== 'shopMainDialog') return false;

	const responseKey = response.responseKey;

	if (responseKey === 'F') {
		if (player.vehicle) return player.hidePlayerDialog();
		if (player.vars.dialogCooldown) return;

		// Show interface..
		return showShopInterface(player, response);
	}

	// Hide..
	if (response.responseKey === 'ESC') return player.hidePlayerDialog();

	return false;
});
