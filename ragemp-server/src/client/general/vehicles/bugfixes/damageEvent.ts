// This file is used to fix the vehicle damage event.
// The 'vehicleDamage' event in server side is no longer working since 1.0, so we need to use a workaround.

let lastVehicleHealth: ExpectedAny = null;
let antiSpam = false;

mp.events.add('render', () => {
	// Get the local player's vehicle
	const vehicle = mp.players.local.vehicle;

	// If vehicle not found..
	if (!vehicle) {
		// Reset the last vehicle health
		lastVehicleHealth = null;
	} else {
		// Get the vehicle's health
		const vehicleHealth = vehicle.getHealth();

		// Update the last vehicle health if it's not set
		if (lastVehicleHealth === null) lastVehicleHealth = vehicleHealth;

		// If the vehicle health is not the same as the last vehicle health
		if (vehicleHealth !== lastVehicleHealth) {
			// Check if the anti-spam is false
			if (!antiSpam) {
				// Call the server-side event
				mp.events.callRemote('onPlayerDamageVehicle_init', lastVehicleHealth, vehicleHealth);

				// Set the anti-spam to true
				antiSpam = true;

				// Set a timeout to reset the anti-spam
				setTimeout(() => (antiSpam = false), 5000);
			}

			// Update the last vehicle health
			lastVehicleHealth = vehicleHealth;
		}
	}
});
