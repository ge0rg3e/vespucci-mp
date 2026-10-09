/**
 *
 * @param id - The id we're waiting to stream in
 * @returns a fullfilled async promise when a close by object gets created and streams in successfully.
 */

import { logClientsideError } from '@client/general/errors';

export const waitForVehicleRemoteIdToStreamIn = async (id: number) =>
	// eslint-disable-next-line no-async-promise-executor
	await new Promise((resolve) => {
		// Timers
		let intervalTimerId: ExpectedAny = null;
		let timeoutTimerId: ExpectedAny = null;

		// The event function that will be called when an entity streams in..
		const intervalTaskFunction = () => {
			const vehicle: ExpectedAny = mp.vehicles.atRemoteId(id);
			if (!vehicle) return;

			// If vehicle has handle it means is streamed in for us.
			if (vehicle.handle) {
				// Clear the interval
				clearInterval(intervalTimerId);

				// Reset variable
				intervalTimerId = null;

				if (timeoutTimerId !== null) {
					// Clear
					clearTimeout(timeoutTimerId);

					// Reset variable
					timeoutTimerId = null;
				}

				// Resolve..
				resolve(true);
			}
		};

		// Set interval..
		intervalTimerId = setInterval(intervalTaskFunction, 10);

		// In case the entity never streams in we need a timeout..
		timeoutTimerId = setTimeout(() => {
			// We clear the interval first
			if (intervalTimerId !== null) {
				// Clear interval
				clearInterval(intervalTimerId);

				// Reset the variable
				intervalTimerId = null;
			}

			// Reset variable
			timeoutTimerId = null;

			// We now resolve..
			resolve(null);
		}, 3000);
	});

/**
 *
 * @param id number
 * @param isRemoteId boolean - True if this object has been created on the server or false if not.
 * @returns true if is been streamed after 3 seconds or false.
 */

export const waitForObjectToStreamIn = async (id: number, isRemoteId: boolean = false) =>
	// eslint-disable-next-line no-async-promise-executor
	await new Promise((resolve) => {
		try {
			// Timers..
			let intervalTimerId: ExpectedAny = null;
			let timeoutTimerId: ExpectedAny = null;

			// The event function that will be called when an entity streams in..
			const intervalTaskFunction = () => {
				const object: ExpectedAny = isRemoteId ? mp.objects.atRemoteId(id) : mp.objects.at(id);
				if (!object) return;

				// If vehicle has handle it means is streamed in for us.
				if (object.handle) {
					// We clear the interval first
					clearInterval(intervalTimerId);

					// Reset variable
					intervalTimerId = null;

					// If there's a timeout
					if (timeoutTimerId !== null) {
						// Clear timeout
						clearTimeout(timeoutTimerId);

						// REset variable
						intervalTimerId = null;
					}

					// Resolve.
					resolve(true);
				}
			};

			// Set interval..
			intervalTimerId = setInterval(intervalTaskFunction, 10);

			// In case the entity never streams in we need a timeout..
			timeoutTimerId = setTimeout(() => {
				// Clear the interval first
				if (intervalTimerId !== null) {
					// Clear
					clearInterval(intervalTimerId);

					// Reset
					intervalTimerId = null;
				}

				// Reset variable here
				timeoutTimerId = null;

				// Resolve..
				resolve(false);
			}, 3000);
		} catch (err) {
			logClientsideError(`waitForObjectToStreamIn`, err);
			resolve(false);
		}
	});
