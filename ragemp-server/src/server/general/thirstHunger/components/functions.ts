export const calculateHealthReduced = (hunger: number, thirst: number) => {
	let reducedAmount = 0;

	if (hunger >= 50) {
		reducedAmount += hunger > 80 ? 2.5 : 1;
	}

	if (thirst >= 50) {
		reducedAmount += thirst > 80 ? 2.5 : 1;
	}

	return reducedAmount;
};

/**
 * Calculates the total hunger points increased to reach fifty after the given number of minutes.
 * @param minutes The number of minutes passed.
 * @returns The total hunger points increased.
 */

export function calculateHungerReducedToReachFifty(minutes: number) {
	// Define the starting hunger points.
	const startingHungerPoints = 100;

	// Define the target hunger points.
	const targetHungerPoints = 50;

	// Calculate the total hunger points reduced to reach the target in the given number of minutes.
	const totalHungerReduced = startingHungerPoints - targetHungerPoints;

	// Calculate the amount to decrease hunger points every minute.
	const hungerDecreasePerMinute = totalHungerReduced / minutes;

	// Return the calculated hunger points decreased per minute.
	return hungerDecreasePerMinute;
}
