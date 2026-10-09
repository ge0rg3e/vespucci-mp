/**
 * This function will take your current value and max value and return it in the format of your dash value for the svgs.
 *
 * @param carSpeed
 * @param maxSpeed
 * @param maxDashValue
 * @returns
 */

export function calculateStrokeOffset(carSpeed: number, maxSpeed: number, maxDashValue: number) {
	// Calculate the percentage of carSpeed relative to maxSpeed
	const speedPercentage = carSpeed / maxSpeed;

	// Calculate the offset needed for the given speed percentage
	const strokeDashoffset = maxDashValue * (1 - speedPercentage);

	return strokeDashoffset;
}
