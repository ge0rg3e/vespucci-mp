import { getVehicleNativeInfo } from '@server/natives/vehicles/components/core';
import { PersonalVehicles } from '@server/legacy/vehicles/components/core';
import { getLanguagePack } from '@vmp/i18n';

const respawnVehiclesCheck = () => {
	mp.vehicles.forEachValid((veh: VehicleMp) => {
		const isNormal = !veh.vars.temporary && !veh.vars.pVehicle;

		// Normal vehicles that have been standing around for more than 60 minutes must be respawned.
		if (isNormal && veh.vars.emptyVehicle >= 60) {
			veh.respawn();
		}

		if (veh.vars.temporary && veh.vars.emptyVehicle >= 15) {
			veh.destroy();
		}

		if (veh.vars.pVehicle && veh.vars.emptyVehicle >= 15) {
			const v = PersonalVehicles.find((elm) => elm.id === veh.vars.pVehicle);
			if (!v) return; // Just a safety check.

			// We don't despawn the parked in garage vehicle.
			if (v.status === 2) return;

			// Despawning it
			mp.events.call('despawnVehicle', v.id, false);

			const owner = mp.players.toArrayLoggedInFind((p: PlayerMp) => p.info.id === v.ownerId);
			if (!owner) return false; // safety check

			const lang = getLanguagePack(`Vehicles`, owner.info.language);
			const nativeVehicleInfo = getVehicleNativeInfo({ model: v.model });

			if (!nativeVehicleInfo) return false;

			owner.alert({ type: 'warning', message: lang.get('Toast:VehicleDespawnedInactivity', { displayName: nativeVehicleInfo.displayName }) });

			owner.createAmplitudeEvent(`Vehicle despawned automatically`, {
				id: v.id,
				model: v.model,
				displayName: nativeVehicleInfo.displayName
			});
		}

		return false;
	});
};

const countVehiclesEmpty = () => {
	mp.vehicles.forEachValid((vehicle: VehicleMp) => {
		if (vehicle.vars.pVehicle) {
			const veh = PersonalVehicles.find((v) => v.id === vehicle.vars.pVehicle);
			if (!veh) return;

			// We don't increase the timer for personal vehicles in garage.
			if (veh.status === 2) {
				vehicle.updateVars({ emptyVehicle: 0 });
				return;
			}
		}
		if (vehicle.getOccupantsPatched().length === 0) {
			vehicle.updateVars({ emptyVehicle: vehicle.vars.emptyVehicle + 1 });
		} else {
			vehicle.updateVars({ emptyVehicle: 0 });
		}
	});
};

setInterval(countVehiclesEmpty, 1 * 60 * 1000); // every minute check.
setInterval(respawnVehiclesCheck, 1 * 60 * 1000); // every minute check.
