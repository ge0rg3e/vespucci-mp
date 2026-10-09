import moment from 'moment';
import { deleteVehicle, PersonalVehicleEntities, PersonalVehicles, updateVehicle } from './core';
import { getLanguagePack } from '@vmp/i18n';
import { getVehicleNativeInfo } from '@server/natives/vehicles/components/core';
import { logError } from '@server/utils/helpers';

const autoSave = async () => {
	PersonalVehicles.forEach((veh: PersonalVehicle) => {
		const data: Partial<PersonalVehicle> = { ...veh };

		// Deleting keys that should not be updated
		delete data.id;
		delete data.createdAt;
		delete data.updatedAt;

		// Saving the last location..

		if (data.status === 1 && data.locations) {
			const entityId = PersonalVehicleEntities[veh.id];
			const entity = mp.vehicles.at(entityId);
			if (!entity) return;

			const lastLocation = {
				position: entity.position,
				rotation: entity.rotation
			};

			data.locations.lastLocation = lastLocation;
		}

		updateVehicle(veh.id, data, true, true);
	});
};

const destroyExpiredVehicles = () => {
	PersonalVehicles.forEach(async (veh: PersonalVehicle) => {
		try {
			if (veh.expiresAt === null) return;
			const diff = moment(new Date(veh.expiresAt)).diff(new Date(), 'minutes');

			if (diff < 1) {
				const oldVeh = { ...veh };

				// Deleting it
				await deleteVehicle(veh.id);

				const owner = mp.players.toArrayLoggedInFind((p: PlayerMp) => p.info.id === oldVeh.ownerId);

				if (!owner) return; // If there is no online player.. skip.

				const lang = getLanguagePack(`Vehicles`, owner.info.language);
				const nativeVehicleInfo = getVehicleNativeInfo({ model: oldVeh.model });
				if (!nativeVehicleInfo) return false;

				owner.toast({ type: 'warning', message: lang.get('Toast:VehicleExpired', { displayName: nativeVehicleInfo.displayName }) });

				owner.createAmplitudeEvent(`Expired personal vehicle`, {
					model: oldVeh.model,
					createdAt: oldVeh.createdAt
				});

				return true;
			}
			return false;
		} catch (err) {
			await logError(`DELETE_EXPIRED_VEHICLES`, err, { vehId: veh.id, owner: veh.ownerName });
			return false;
		}
	});
};

setInterval(autoSave, 50 * 60 * 1000); // every 50 minutes.
setInterval(destroyExpiredVehicles, 1 * 60 * 1000); // every minute check.

mp.events.add('hourlyDataBackup', autoSave); // when someone requested a savedata manually.
