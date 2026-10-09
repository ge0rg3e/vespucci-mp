import { logClientsideError } from '@client/general/errors';
import { shootingRangeObjectPositions } from './variables';
import { loggedIn } from '@client/natives/interfaces';
import { getCurrentWeapon } from '@client/natives/playerWeapons/components/functions';
import * as rpc from 'rage-rpc';
import { calculateCountdownFrom } from '@client/utils/helpers';

// Variables
export let currentCountdownSecondsLeft = 0; // How many seconds are left until we can start shooting.
export let dynamicObjects: ObjectMp[] = []; // the objects that must be shot down
export let targetObject: ObjectMp | null = null; // Variable for the object that the player must shot down.
export let currentHits = 0; // current hits on the objects.
export let isRaisingNextTarget = false; // If the object is currently performing the "anim" of going up or down.

let examCheckTimerId: ExpectedAny = null;
export let examStartedAt: ExpectedAny = null; // when it was started: needed to know when it passed two seconds to fail the test.

// Configurations for this system
let speedRotation: number = 10; //   Variable for speed increment/decrement rotation
let cooldownBetweenTargets = 800; // How many seconds to wait between raising the next targets.

export const targetHits = 15; // How many targets the player must shot down.

/**
 * Set exam started date
 */
export const setExamStartedAt = (date: ExpectedAny) => (examStartedAt = date);

/**
 * Set exam check timerId
 */
export const setExamCheckTimerId = (timerId: ExpectedAny) => (examCheckTimerId = timerId);

/**
 * It will make an object to rotate down and the player will now have to shot it down.
 */

export const lowerNextTarget = async (avoidTheCooldown?: boolean) => {
	try {
		// Random number for the target objects in the shooting range
		const random = Math.floor(Math.random() * dynamicObjects.length);

		// Play a sound for rotate down the target
		mp.game.audio.playSoundFrontend(-1, 'SHOOTING_RANGE_ROUND_OVER', 'HUD_AWARDS', true);

		// We are raising next target
		isRaisingNextTarget = true;

		// Wait 400 ms in between targets.
		if (!avoidTheCooldown) {
			await new Promise((res) => {
				setTimeout(() => res(true), cooldownBetweenTargets);
			});
		}

		// While the target object is not rotated to down
		while (mp.objects.exists(dynamicObjects[random]) && dynamicObjects[random].rotation.x != 0) {
			dynamicObjects[random].rotation = new mp.Vector3(dynamicObjects[random].rotation.x - speedRotation, dynamicObjects[random].rotation.y, dynamicObjects[random].rotation.z);
			await mp.game.waitAsync(1);
		}

		// We finished raising
		isRaisingNextTarget = false;

		// Set the next target
		targetObject = dynamicObjects[random];
	} catch (err) {
		await logClientsideError(`ammuNation.licenseTest.lowerNextTarget`, err);
	}
};

/**
 * This will raise the target object up.
 */

export const raiseCurrentTarget = async () => {
	try {
		if (!targetObject) return false;

		// We are raising..
		isRaisingNextTarget = true;

		// While the target object is not rotated to up
		while (mp.objects.exists(targetObject) && targetObject.rotation.x != 90) {
			targetObject.rotation = new mp.Vector3(targetObject.rotation.x + speedRotation, targetObject.rotation.y, targetObject.rotation.z);
			await mp.game.waitAsync(1);
		}

		// We finished raising
		isRaisingNextTarget = false;

		return true;
	} catch (err) {
		await logClientsideError(`ammuNation.licenseTest.raiseCurrentTarget`, err);
		return false;
	}
};

/**
 * This will clear the test dependencies: The objects, variables e tc.
 */

export const clearTestDependencies = () => {
	// Delete the objects
	dynamicObjects.forEach((obj) => obj.destroy());

	// Reset the variables
	dynamicObjects = [];
	currentHits = 0;
	isRaisingNextTarget = false;
	examStartedAt = null;

	if (examCheckTimerId !== null) {
		clearInterval(examCheckTimerId);
		examCheckTimerId = null;
	}
};

/**
 * Create the dynamic objects for the shooting range
 */

export const createShotingTargets = async () => {
	try {
		// @Variable: Define the model hash for the target
		const model = mp.game.joaat('prop_range_target_01');

		// @Variable: For all coordinates for the shooting range objects
		const positions = shootingRangeObjectPositions;

		// @Loop: Create all target objects with their properties
		for (const position of positions) {
			const object = mp.objects.new(model, new mp.Vector3(position[0], position[1], position[2] + 2), {
				rotation: new mp.Vector3(90, 0, -20),
				alpha: 255,
				dimension: mp.players.local.dimension
			});

			// @Push: Push the object to the dynamicObjects array
			dynamicObjects.push(object);
		}

		return dynamicObjects;
	} catch (err) {
		await logClientsideError(`ammuNation.licenseTest.createShotingTargets`, err);
	}
};

/**
 * This function is simply to set that variable. It was needed because you can't re-assign imported variables.
 * @param shots Number
 */

export const setCurrentHits = (shots: number) => {
	currentHits = shots;
};

export const examChecks = async () => {
	try {
		if (!loggedIn) return false;

		// Get current weapon
		const currentWeapon = await getCurrentWeapon(mp.players.local);

		if (currentWeapon && currentWeapon.ammo < 1 && currentHits !== targetHits) {
			rpc.triggerServer(`ammuNation.licenseCenter@onFailure`, JSON.stringify({ reason: `Out of Ammo` }));
		}

		// If 2 minutes has passed
		if (calculateCountdownFrom(examStartedAt, 2) === '00:00') {
			rpc.triggerServer(`ammuNation.licenseCenter@onFailure`, JSON.stringify({ reason: `Out of Time` }));
		}

		return true;
	} catch (err) {
		await logClientsideError(`ammuNition.licenseTest.examChecksInterval`, err);
		return false;
	}
};
