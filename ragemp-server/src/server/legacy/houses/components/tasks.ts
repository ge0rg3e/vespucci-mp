import { Houses, updateHouse } from './core';

const autoSave = async () => {
	Houses.forEach((h: House) => {
		const data: Partial<House> = { ...h };

		// Deleting keys that should not be updated
		delete data.id;
		delete data.createdAt;
		delete data.updatedAt;

		updateHouse(h.id, { ...data }, true, true);
	});
};

setInterval(autoSave, 50 * 60 * 1000); // every 50 minutes.

mp.events.add('hourlyDataBackup', autoSave); // when someone requested a savedata manually.
