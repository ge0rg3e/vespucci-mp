mp.events.add('patched:playerEnterVehicle', async (_, vehicle) => {
	// Adding this here to reset this when they get onto a vehicle asap so we don't wait for that timer to be called to avoid respawning the vehs on last minute.

	vehicle.updateVars({
		emptyVehicle: 0
	});
});
