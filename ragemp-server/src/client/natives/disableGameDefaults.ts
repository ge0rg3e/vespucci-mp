// Disabling game defaults here.

const player = mp.players.local;

mp.events.add('render', () => {
	player.setConfigFlag(35, false); // Disable Auto Helmet on a motorcycle
	player.setConfigFlag(241, true); // Disable Stopping Engine
	player.setConfigFlag(429, true); // Disable Starting Engine
	player.setConfigFlag(184, true); // Disable Seat Shuffling

	mp.game.ui.hideHudComponentThisFrame(2); // Disalbe ammo text from weapons
	mp.game.ui.hideHudComponentThisFrame(6); // Disable vehicle name
	mp.game.ui.hideHudComponentThisFrame(7); // Disable area name
	mp.game.ui.hideHudComponentThisFrame(8); // Disable vehicle class
	mp.game.ui.hideHudComponentThisFrame(9); // Disable game location bottom right

	mp.game.ui.hideHudComponentThisFrame(3); // Disable HUD_CASH
	mp.game.ui.hideHudComponentThisFrame(4); // Disable HUD_MP_CASH
	mp.game.ui.hideHudComponentThisFrame(13); // Disable CASH_CHANGE
	mp.game.ui.hideHudComponentThisFrame(16); // Disable RADIO_STATIONS
	mp.game.ui.hideHudComponentThisFrame(17); // Disable SAVING_GAME

	if (player.isPerformingStealthKill()) {
		player.clearTasksImmediately();
	}

	// Disable player and in-vehicle afk camera
	mp.game.invoke('0x9E4CFFF989258472'); //
	mp.game.invoke('0xF4F2C0D4EE209E20');

	// Disable Left CTRL Duck.
	mp.game.controls.disableControlAction(0, 36, true);

	// Disable C
	mp.game.controls.disableControlAction(0, 26, true);
});
