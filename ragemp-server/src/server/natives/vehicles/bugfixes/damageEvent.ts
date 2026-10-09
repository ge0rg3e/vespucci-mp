// This file is used to fix the vehicle damage event.
// The 'vehicleDamage' event in server side is no longer working since 1.0, so we need to use a workaround.

mp.events.add('onPlayerDamageVehicle_init', (player: PlayerMp, lastHealth: number, newHealth: number) => {
	// Get the player vehicle..
	const vehicle = player.vehicle;

	// If vehicle not found..
	if (!vehicle) return;

	// Call the event
	mp.events.call('onPlayerDamageVehicle', player, vehicle, lastHealth, newHealth);
});
