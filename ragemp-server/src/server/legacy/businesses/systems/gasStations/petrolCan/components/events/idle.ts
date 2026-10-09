// @Reminder: This event is called by the other two events: refilling and using when we stop those processes.
mp.events.add(`petrolCan:stopHoldingItem`, (player: PlayerMp) => {
	if (!player.vars.petrolCan.status) return false;

	// Remove the petrol can weapon.
	player.removeWeaponFromSlot(999);

	// Update variables
	player.updateVars({
		petrolCan: {
			status: null,
			inventoryItemId: null,
			litres: 0
		}
	});

	// Enable the player escape
	player.triggerClientEvent(`setEscapeKeyDisabled`, { system: 'item:petrolCan', value: false });

	return true;
});

// @Verification: We died while holding the item on the street.
mp.events.add('playerLoggedInDeath', (player: PlayerMp) => {
	if (!player.vars.petrolCan.status) return false;

	// If is using or refilling - Those systems will take care of the scearnio where they died.
	if (player.vars.petrolCan.status !== 'idle') return false;

	// Invoke this event so the sub-systems can act.
	mp.events.call(`petrolCan:stopHoldingItem`, player, 'Player died.');

	return true;
});

mp.events.add(`petrolCan:onEscape`, (player: PlayerMp) => {
	// Not holding..
	if (!player.vars || !player.vars.petrolCan.status) return false;

	// If is refilling
	if (player.vars.petrolCan.status === 'refilling') return false;

	if (player.vars.petrolCan.status === 'using') {
		// Invoke this event so the sub-systems can act.
		// This will also call a stophHodingItem etc.
		mp.events.call(`petrolCan:stopUsingOnVehicle`, player, 'Player pressed ESCAPE.');
		return false;
	}

	// Clear alerts from this system.
	player.clearAlertsFromSystem('petrolCan');

	// Inform server
	mp.events.call(`petrolCan:stopHoldingItem`, player);

	return true;
});
