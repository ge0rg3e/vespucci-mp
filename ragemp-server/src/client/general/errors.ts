import * as rpc from 'rage-rpc';

// Array to store errors
const errorsCaught: ExpectedAny[] = [];

// Variables
const MAX_ERRORS_PER_SECOND = 5;
const MAX_ERRORS_IN_LAST_5_MINUTES = 30;
const COOLDOWN_TIME = 3 * 60 * 1000; // 3 minutes in milliseconds

// Function to parse error body
const parseErrorBody = (err: ExpectedAny) => {
	if (err && err.response && err.request) {
		return JSON.stringify({
			responseData: err.response.data,
			responseStatus: err.response.status,
			requestBody: err.config.data,
			requestMethod: err.config.method,
			requestUrl: err.config.url,
			requestHeaders: err.config.headers
		});
	} else if (err.stack !== undefined) {
		return JSON.stringify({
			internalErrorStack: err.stack
		});
	} else if (err && typeof err === 'string') {
		return err;
	} else return `Error couldn't be parsed.`;
};

// Function to log client-side error
export const logClientsideError = async (name: string, error: ExpectedAny, payload = {}) => {
	// Add error entry to the queue
	errorsCaught.push({
		name,
		error,
		payload,
		timestamp: Date.now()
	});
};

// Function to process errors and check for cooldown
const processErrors = () => {
	let errorsIterated = 0;
	const currentTime = Date.now();

	for (let index = 0; index < errorsCaught.length; index++) {
		const entry = errorsCaught[index];
		const timeDifference = currentTime - entry.timestamp;

		// If cooldown is still active, skip processing this entry
		if (timeDifference < COOLDOWN_TIME) continue;

		// If we already hit the maximum errors per second
		if (errorsIterated >= MAX_ERRORS_PER_SECOND) break;

		// Increase the counter
		errorsIterated++;

		// Showing it in their console
		mp.console.logError(`Error: ${entry.name} - ${parseErrorBody(entry.error)}`);

		// Log it on the server
		rpc.triggerServer(
			`errors:caughtClientsideError`,
			JSON.stringify({
				name: entry.name,
				error: parseErrorBody(entry.error),
				payload: entry.payload || {}
			})
		);

		// Remove it from the array once processed.
		errorsCaught.splice(index, 1);
	}
};

// Function to check for cooldown and process errors
const TaskFunction = () => {
	// Check if the player has reached the maximum errors in the last 5 minutes
	if (errorsCaught.length >= MAX_ERRORS_IN_LAST_5_MINUTES) {
		// Apply cooldown
		setTimeout(() => {
			processErrors();
		}, COOLDOWN_TIME);
	} else {
		// Process errors without cooldown
		processErrors();
	}
};

export const SendToClientsideError = (name: string, error: ExpectedAny, payload: Record<string, ExpectedAny>) => {
	rpc.triggerServer(
		`errors:caughtClientsideError`,
		JSON.stringify({
			name: name,
			error: parseErrorBody(error),
			payload: payload || {}
		})
	);
};

// Set interval to run the task function every second
setInterval(TaskFunction, 1000);
