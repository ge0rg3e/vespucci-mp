import { cancelTimeout, createTimeout, isTimeoutValid } from '@server/natives/timeouts';
import { getVehicleNativeInfo } from '@server/natives/vehicles/components/core';
import { isInRange, logError } from '@server/utils/helpers';
import { onTimeoutVehicleFilled } from './using.functions';
import { getLanguagePack } from '@vmp/i18n';
import { DURATION_FILL_VEHICLE } from '../items';
import { playRangedAudio, stopRangedAudio } from '@server/natives/audio';

mp.events.add(`petrolCan:fillVehicleInSight`, async (player: PlayerMp, vehicleId: number) => {
	try {
		// Get vehicle in sight
		let vehicle = mp.vehicles.at(vehicleId);
		if (!vehicle) return false;

		// Get native info..
		const nativeInfo = getVehicleNativeInfo({ model: vehicle.vars.model });
		if (!nativeInfo) return false;

		// Get lang
		const lang = getLanguagePack(`petrolCan:fillVehicleInSight`, player.lang);

		// Clear alerts from this system.
		player.clearAlertsFromSystem('petrolCan');

		// Is the vehicle gas tank already full?
		if (vehicle.vars.fuel >= nativeInfo.carTank) return player.alert({ system: 'petrolCan', type: 'error', message: lang.get('gasTankIsFull') });

		// Play the right sound
		playRangedAudio({
			sourcePath: `${`__ASSETS__`}/audios/items/petrolCan/using.mp3`,
			options: { identifier: `petrolCan@${player.id}`, volume: 0.2 },
			position: player.position,
			isSoundEffect: true,
			range: 5
		});

		// Update player vars s owe know what he's doing
		player.updateVars({
			petrolCan: {
				...player.vars.petrolCan,
				status: 'using',
				vehicleId: vehicle.id
			}
		});

		// Play next anim
		player.applyAnimation({
			dict: `weapon@w_sp_jerrycan`,
			name: `fire`,
			flags: 50,
			speed: 3,
			duration: DURATION_FILL_VEHICLE * 1000
		});

		// Show progress bar..
		player.showProgressBar(lang.get('progressBarLabel'), DURATION_FILL_VEHICLE);

		// After 15 seconds..
		createTimeout(`usingPetrolCan:${player.info.id}`, () => onTimeoutVehicleFilled(player.info.id), DURATION_FILL_VEHICLE * 1000);

		return true;
	} catch (err) {
		await logError(`petrolCan:fillVehicleInSight`, err);
		return false;
	}
});

mp.events.add(`petrolCan:stopUsingOnVehicle`, (player: PlayerMp, reason: string) => {
	// If we have a timeout..
	if (isTimeoutValid(`usingPetrolCan:${player.info.id}`)) {
		// Cancel timeout
		cancelTimeout(`usingPetrolCan:${player.info.id}`);

		// Clear animation too
		player.clearAnimations();
	}

	// Stop the sound
	stopRangedAudio({
		identifier: `petrolCan@${player.id}`,
		position: player.position,
		range: 10
	});

	// Hide progress bar
	player.hideProgressBar();

	// Inform server to stop holding the petrol can
	mp.events.call(`petrolCan:stopHoldingItem`, player);

	// Track amplitude..
	player.createAmplitudeEvent(`Put petrol can back into Inventory`, { reason });

	return true;
});

// @Verification: We go too far from vehicle or the vehicle goes too far from us.
mp.events.add('everySecondForPlayerTimer', (player: PlayerMp) => {
	// They weren't filling a vehicle.
	if (player.vars.petrolCan.status !== 'using') return false;

	// Get vehicle data
	const veh = mp.vehicles.at(player.vars.petrolCan.vehicleId!);

	// The vehicle does not exist anymore
	if (!veh) return mp.events.call(`petrolCan:stopUsingOnVehicle`, player, 'Vehicle he was filling no longer exists');

	// Is still within range..
	if (isInRange(player.position, veh.position, 8)) return false;

	// Invoke this event so the sub-systems can act.
	mp.events.call(`petrolCan:stopUsingOnVehicle`, player, 'Went too far from the vehicle he was filling.');

	return true;
});

// @Verification: We died.
mp.events.add('playerLoggedInDeath', (player: PlayerMp) => {
	if (player.vars.petrolCan.status !== 'using') return false;

	// Invoke this event so the sub-systems can act.
	mp.events.call(`petrolCan:stopUsingOnVehicle`, player, 'Player died.');

	return true;
});

// @Verification: We disconnected.
mp.events.add('playerLoggedInQuit', (player: PlayerMp) => {
	if (player.vars.petrolCan.status !== 'using') return false;

	// Invoke this event so the sub-systems can act.
	mp.events.call(`petrolCan:stopUsingOnVehicle`, player, 'Player quit.');

	return true;
});
