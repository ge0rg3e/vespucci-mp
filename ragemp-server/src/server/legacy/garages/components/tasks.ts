import { Garages, updateGarage } from './core';

const autoSave = async () => {
	Garages.forEach((g: Garage) => {
		const data: Partial<Garage> = { ...g };

		// Deleting keys that should not be updated
		delete data.id;
		delete data.createdAt;
		delete data.updatedAt;

		updateGarage(g.id, { ...data }, true, true);
	});
};

setInterval(autoSave, 50 * 60 * 1000); // every 50 minutes.

mp.events.add('hourlyDataBackup', autoSave); // when someone requested a savedata manually.
