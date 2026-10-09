import { playRangedAudio } from '@server/natives/audio';

export const onVehicleDoorsLocked = (vehicle: VehicleMp, locked: boolean, autoLock?: boolean) => {
	if (autoLock && autoLock === true) {
		vehicle.getOccupants().forEach((entity) => {
			entity.playSoundEffect(`${'__ASSETS__'}/audios/systems/vehicle/auto_lock.mp3`, {
				volume: 1,
				autoplay: true,
				loop: false,
				spatialSound: {
					source: 'vehicle',
					identifier: vehicle.id,
					maxDistance: 5
				}
			});
		});

		return true;
	}

	// Play a sound effect based on whether the vehicle is locked or unlocked.
	playRangedAudio({
		sourcePath: `${'__ASSETS__'}/audios/systems/vehicle/${locked ? 'lock' : 'unlock'}.mp3`,
		options: {
			volume: 1.5,
			spatialSound: {
				source: 'vehicle',
				identifier: vehicle.id,
				maxDistance: 10
			}
		},
		position: vehicle.position,
		isSoundEffect: true,
		range: 5
	});

	return true;
};
