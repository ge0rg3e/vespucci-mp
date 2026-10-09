// Unique array to hold them
let intervals: Record<string, ExpectedAny> = {};

/**
 *
 * @param id
 * @param callback
 * @param time
 */

export const createInterval = (id: string, callback: ExpectedAny, time: number) => {
	// If it already exists by any chance
	if (isIntervalValid(id)) {
		cancelInterval(id);
	}

	// Setting the timeout..
	intervals[id] = setInterval(() => callback(), time);
};

/**
 * Clears the timeout
 * @param id
 * @returns
 */
export const cancelInterval = (id: string) => {
	if (intervals[id] === undefined) return false;

	// Clear it.
	clearInterval(intervals[id]);

	// Delete it from our memory
	delete intervals[id];
	return true;
};

/**
 * Check if timeout exist
 * @param id
 * @returns
 */

export const isIntervalValid = (id: string) => {
	if (intervals[id] === undefined) return false;

	return true;
};
