// Unique array to hold them
let timeouts: Record<string, ExpectedAny> = {};

/**
 *
 * @param id
 * @param callback
 * @param time
 */

export const createTimeout = (id: string, callback: ExpectedAny, time: number) => {
	// If it already exists by any chance
	if (timeouts[id] !== undefined) {
		// Clearing it.
		clearTimeout(timeouts[id]);

		// Delete it from our memory
		delete timeouts[id];
	}

	// Setting the timeout..
	timeouts[id] = setTimeout(() => {
		// Invoke..
		callback();

		// Delete it from our memory
		delete timeouts[id];
	}, time);
};

/**
 * Clears the timeout
 * @param id
 * @returns
 */
export const cancelTimeout = (id: string) => {
	// If timeout was undefined meaning doesn't exist..
	if (timeouts[id] === undefined) return false;

	// Clear it.
	clearTimeout(timeouts[id]);

	// Delete it from our memory
	delete timeouts[id];

	return true;
};

/**
 * Check if timeout exist
 * @param id
 * @returns
 */

export const isTimeoutValid = (id: string) => {
	if (timeouts[id] === undefined) return false;

	return true;
};
