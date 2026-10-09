import { PersonalVehicles } from './core';

mp.Player.prototype.getMaxVehiclesOwned = function () {
	// This is just here as a boilerplate and reminder.

	if (this.isDeveloper()) {
		// Why not?
		return 999;
	}

	return 3;
};

mp.Player.prototype.getNumberOfVehiclesOwned = function () {
	const vehs = PersonalVehicles.filter((v) => v.ownerId === this.info.id);
	return vehs.length;
};

mp.Player.prototype.getMaxVehiclesAutoSpawn = function () {
	let number = 1;

	if (this.isDeveloper()) {
		number = 10;
	}

	if (this.getAdminLevel() !== 0) {
		number = 3;
	}

	return number;
};

declare global {
	interface PlayerMp {
		getMaxVehiclesOwned(): number;
		getMaxVehiclesAutoSpawn(): number;
		getNumberOfVehiclesOwned(): number;
	}
}

export {};
