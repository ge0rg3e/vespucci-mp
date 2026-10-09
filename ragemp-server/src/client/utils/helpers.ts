// @Reminder: I'm not sure this is accurate at all.
export function getOffsetPosition(x: number, y: number, z: number, offsetX: number, offsetY: number, offsetZ: number) {
	// Convert degrees to radians for the offsets
	const radiansY = offsetY * (Math.PI / 180);
	const radiansZ = offsetZ * (Math.PI / 180);

	// Calculate the offset position
	const offsetXPos = x + Math.cos(radiansZ) * (Math.cos(radiansY) * offsetX - Math.sin(radiansY) * offsetZ) - Math.sin(radiansZ) * offsetY;
	const offsetYPos = y + Math.sin(radiansZ) * (Math.cos(radiansY) * offsetX - Math.sin(radiansY) * offsetZ) + Math.cos(radiansZ) * offsetY;
	const offsetZPos = z + Math.sin(radiansY) * offsetX + Math.cos(radiansY) * (Math.sin(radiansZ) * offsetZ + Math.cos(radiansZ) * offsetX);

	return new mp.Vector3(offsetXPos, offsetYPos, offsetZPos);
}

/**
 *
 * @param remoteId The ID of the player
 * @param key The variable key (example: loggedIn)
 * @returns the variable from the server
 */

export const getPlayerVariable = (remoteId: number, key: string) => {
	// Get the variables
	const target = mp.players.atRemoteId(remoteId);
	if (!target) return null;

	return target.getVariable(`@playerVars.${key}`);
};

/**
 *
 * @param remoteId vehicle server id
 * @param key
 * @returns the variable or undefined
 */

export const getVehicleVariable = (remoteId: number, key: string) => {
	// Get the variables
	const target = mp.vehicles.atRemoteId(remoteId);
	if (!target) return null;

	return target.getVariable(`@vehicleVars.${key}`);
};

/**
 *
 * @param {*} remoteId The id of the actor we're interested in
 * @returns The data of the actor
 */

export const getActorData = (remoteId: number) => {
	// Get the variables
	const target = mp.peds.atRemoteId(remoteId);
	if (!target) return null;

	// Get the variables
	const variables = target.getVariable('@actorData');

	// If we don't have variables or we're not logged in.
	if (!variables) return null;

	return variables;
};

// const isPlayerFacingEarth = () => {
// 	let headpos = mp.players.local.getBoneCoords(31086, 0, 0, 0);
// 	let offsetPos = mp.players.local.getOffsetFromInWorldCoords(0.0, 50.0, -25.0);
// 	let [hit, hitPos] = mp.game.gameplay.getGro(headpos.x, headpos.y, headpos.z, offsetPos.x, offsetPos.y, offsetPos.z);
// 	return [hit, hitPos];
// };

// const isPlayerFacingWater = () => {
//     let headpos = mp.players.local.getBoneCoords(31086, 0, 0, 0);
//     let offsetPos = mp.players.local.getOffsetFromInWorldCoords(0.0, 50.0, -25.0);
//     let [hit, hitPos] = mp.game.water.testProbeAgainstWater(headpos.x, headpos.y, headpos.z, offsetPos.x, offsetPos.y, offsetPos.z);
//     return [hit, hitPos];
// }

/**
 * Calculate Countdown From
 *
 * This function takes a starting date and the total duration in minutes,
 * and calculates the remaining time in MM:SS format for a countdown.
 *
 * @param {Date} fromDate - The starting date for the countdown.
 * @param {number} totalMinutes - The total duration of the countdown in minutes.
 * @returns {string} - The formatted countdown string in MM:SS format.
 */

export const calculateCountdownFrom = (fromDate: Date, totalMinutes: number) => {
	// Get the current date and time
	const currentDate: ExpectedAny = new Date();

	// Calculate the time difference in seconds
	// @ts-ignore
	const timeDifference = Math.floor((currentDate - fromDate) / 1000);

	// Set the countdown time
	let countdownTime = totalMinutes * 60 - timeDifference;

	// Ensure countdownTime does not go below 0
	countdownTime = Math.max(countdownTime, 0);

	// Convert countdown time to MM:SS format
	const minutes = Math.floor(countdownTime / 60);
	const seconds = countdownTime % 60;
	const countdownFormatted = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;

	// Check if the countdown is done
	if (countdownTime === 0) {
		return '00:00';
	}

	return countdownFormatted;
};
