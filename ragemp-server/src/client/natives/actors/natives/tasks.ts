import { waitForVehicleRemoteIdToStreamIn } from '@client/utils/events';

/**
 * This will task the ped to attack a target entity.
 */

mp.events.add('actor:taskAttack', (ped, entity) => {
	ped.taskCombat(entity.handle, 0, 16); //don't change last 2 params.
});

/**
 * This will task the ped to drive to a specific coord.
 * @Reminder: It's meant for non-long distances.
 */

mp.events.add('actor:taskVehicleDriveToCoord', async (ped, vehicle, position, speed, drivingMode) => {
	// Vehicle must be streamed in first.
	await waitForVehicleRemoteIdToStreamIn(vehicle.remoteId);

	// Put vehicle driver in..
	ped.setIntoVehicle(vehicle.handle, -1);

	// Start task..
	ped.taskVehicleDriveToCoord(vehicle.handle, position.x, position.y, position.z, speed, 1, vehicle.model, drivingMode, 10, 0);
});

/**
 * Task the ped to drive on a long distance drive. Same as the above but meant for long distances.
 */

mp.events.add('actor:taskVehicleDriveToCoordLongrange', async (ped, vehicle, position, speed, drivingMode) => {
	// Vehicle must be streamed in first.
	await waitForVehicleRemoteIdToStreamIn(vehicle.remoteId);

	// Put vehicle driver in..
	ped.setIntoVehicle(vehicle.handle, -1);

	// Start task..
	ped.taskVehicleDriveToCoordLongrange(vehicle.handle, position.x, position.y, position.z, speed, drivingMode, 10);
});

/**
 * Task the ped to drive and  wander around the game. Is going to keep driving.
 */

mp.events.add('actor:taskVehicleDriveWander', async (ped, vehicle, speed, drivingMode) => {
	// Vehicle must be streamed in first.
	await waitForVehicleRemoteIdToStreamIn(vehicle.remoteId);

	// Put vehicle driver in..
	ped.setIntoVehicle(vehicle.handle, -1);

	// Start task..
	ped.taskVehicleDriveWander(vehicle.handle, speed, drivingMode);
});

/**
 * Task ped to wander around the game on-foot with no destination.
 */

mp.events.add('actor:taskWanderStandard', (ped, walkAnywhereWithoutDuration) => {
	const p1 = walkAnywhereWithoutDuration ? 10.0 : 0;
	const p2 = walkAnywhereWithoutDuration ? 10 : 0;
	ped.taskWanderStandard(p1, p2);
});

/**
 * Task the ped to wander but within a specific radius.
 */

mp.events.add('actor:taskWanderInArea', (ped, position, radius, minimalLength, timeBetweenWalks) => {
	ped.taskWanderInArea(position.x, position.y, position.z, radius, minimalLength, timeBetweenWalks);
});

/**
 * Initiates facial animation on the specified ped to simulate talking.
 */
mp.events.add('actor:startMouthTalking', (ped: PedMp) => {
	mp.game.streaming.requestAnimDict('facials@gen_male@base');
	ped.taskPlayAnim('facials@gen_male@base', 'mood_talking_1', 1, 1.0, -1, 45, 1.0, false, false, false);
});

/**
 * Stops facial animation on the specified ped, returning the expression to normal.
 */
mp.events.add('actor:stopMouthTalking', (ped: PedMp) => {
	ped.stopAnimTask('facials@gen_male@base', 'mood_talking_1', 1);
});

/**
 * Event handler for initiating a talking gesture animation.
 */
mp.events.add('actor:startGestureTalking', (ped: PedMp) => {
	mp.game.streaming.requestAnimDict('armenian_1_mcs_1-2');
	ped.taskPlayAnim('armenian_1_mcs_1-2', 'cs_siemonyetarian_dual-2', 5, 1, -1, 1, 1.0, true, true, true);
});

/**
 * Event handler for stopping the talking gesture animation.
 */
mp.events.add('actor:stopGestureTalking', (ped: PedMp) => {
	ped.stopAnimTask('armenian_1_mcs_1-2', 'cs_siemonyetarian_dual-2', 1);
});

/*
 * Task to make the ped somewhere
 */

mp.events.add('actor:taskGoStraightToCoord', (ped, position, speed, timeout, targetHeading, distanceToSlide) => {
	ped.taskGoStraightToCoord(position.x, position.y, position.z, speed, timeout, targetHeading, distanceToSlide);
});

mp.events.add('actor:taskPlayAnim', (ped, animDictionary, animationName, blendInSpeed, blendOutSpeed, duration, flag, startOffset, lockX, lockY, lockZ) => {
	ped.taskPlayAnim(animDictionary, animationName, blendInSpeed, blendOutSpeed, duration, flag, startOffset, lockX, lockY, lockZ);
});
