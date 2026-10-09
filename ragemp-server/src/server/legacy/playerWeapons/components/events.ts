mp.events.add('onPlayerSaveData', async (player, quit) => {
	// If they have a weapon in slot 999.
	if (quit && player.getWeaponFromSlot(999)) {
		player.removeWeaponFromSlot(999);
	}

	player.saveInfo({ weapons: player.info.weapons });
});

mp.events.add('loadPlayerDefaults', (player) => {
	// Making weapons accessible on client-side.
	player.addClientsideInformation(['weapons']);
	player.addClientsideVariables(['weaponSlot', 'changingWeapons']);

	// Set the default weapon used.
	player.updateVars({ changingWeapons: false }); // fist
	player.setWeaponSlot(0);

	// Remove weapon from slot 999 in case they have it stuck.
	// Temporary
});
