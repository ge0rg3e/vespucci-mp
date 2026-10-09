import { Businesses, updateBusiness } from './core';

const autoSave = async () => {
	Businesses.forEach((b: Business) => {
		const data: Partial<Business> = { ...b };

		// Deleting keys that should not be updated
		delete data.id;
		delete data.createdAt;
		delete data.updatedAt;

		updateBusiness(b.id, { ...data }, true, true);
	});
};

setInterval(autoSave, 50 * 60 * 1000); // every 50 minutes.
mp.events.add('hourlyDataBackup', autoSave); // when someone requested a savedata manually.
