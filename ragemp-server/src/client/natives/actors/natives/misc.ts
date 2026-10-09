// Dependencies
import { waitForVehicleRemoteIdToStreamIn } from '../../../utils/events';
import { setActorHealth } from '../components/functions';

/**
 * Clear the ped tasks immediately. Example: Stops him from task of driving somewhere.
 */

mp.events.add('actor:clearTasks', (ped) => ped.clearTasksImmediately());

/**
 * Sets the ped's heading direction. Good for spawning.
 */

mp.events.add('actor:setHeading', (ped, heading) => ped.setHeading(heading));

/**
 * Set the ped's health according to the client-side logic. Reminder: For them 200 is 100.
 */

mp.events.add('actor:setHealth', (ped, health) => setActorHealth(ped, health));

/**
 * Gives the ped a weapon and ammo.
 */

mp.events.add('actor:giveWeapon', (ped, weapon, ammo) => {
	ped.giveWeapon(weapon, ammo, true);
});

/**
 * Puts the ped into a vehicle into a specific seat.
 * @Also: Waits for the vehicle to be streamed in first. Task cannot be performed if vehicle is not streamed in.
 */

mp.events.add('actor:putIntoVehicle', async (ped, vehicle, seat) => {
	// Vehicle must be streamed in first.
	await waitForVehicleRemoteIdToStreamIn(vehicle.remoteId);

	// Set action..
	ped.setIntoVehicle(vehicle.handle, seat);
});

/**
 * Removed the ped from the vehicle
 */

mp.events.add('actor:removeFromVehicle', (ped) => {
	const currentVehicle: ExpectedAny = ped.getVehicleIsIn(false); // don't think this works.
	if (!currentVehicle) return false;
	ped.taskLeaveVehicle(currentVehicle.handle, 0);
	return true;
});

/**
 * Plays a speech line from the game.
 */

mp.events.add('actor:playAmbientSpeechWithVoice', (ped, speechName, voiceName, speechParam) => {
	mp.game.audio.playAmbientSpeechWithVoice(ped.handle, speechName, voiceName, speechParam, false);
});

/**
 * Makes the ped to stop being distracted by in-game actions of others: Example if two people are firing guns they will not run away etc.
 */

mp.events.add('actor:setBlockingOfNonTemporaryEvents', (ped, toggle) => {
	ped.setBlockingOfNonTemporaryEvents(toggle);
});
