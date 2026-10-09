// Variables
let countDowns: ExpectedAny[] = [];

export const hasCountdown = ({ identifier }: ExpectedAny) => countDowns.some((countDown) => countDown.identifier === identifier);

export const resetCountdown = ({ identifier }: ExpectedAny) => {
	// Get the countdown from the array
	const index = countDowns.findIndex((countDown) => countDown.identifier === identifier);

	// If the countdown doesn't exists
	if (index === -1) return;

	// Stop audio frontend
	mp.game.audio.stopSound(-1);

	// Clear the interval
	clearInterval(countDowns[index].tempInterval);

	// Remove the countdown from the array
	countDowns.splice(index, 1);
};

export const startCountdown = ({ identifier, seconds }: ExpectedAny) =>
	new Promise<ExpectedAny>((resolve) => {
		// If the identifier is already in the countDowns array then reject the promise
		if (countDowns.some((countDown) => countDown.identifier === identifier)) return resolve({ error: 'ALREADY_EXISTS' });

		// Variable for the current second
		let currentSecondsLeft = seconds;

		// Create a temp interval
		const tempInterval = setInterval(() => {
			// We start the audio for Coldown
			mp.game.audio.playSoundFrontend(-1, '5_Second_Timer', 'DLC_HEISTS_GENERAL_FRONTEND_SOUNDS', true);

			const index = countDowns.findIndex((countDown) => countDown.identifier === identifier);
			if (index === -1) return;

			// Decrement the current second
			countDowns[index].currentSecondsLeft--;

			// If the current second reaches 0 then stop the interval and resolve the promise
			if (countDowns[index].currentSecondsLeft <= 0) {
				// Start a flash effect
				mp.game.graphics.startScreenEffect('MP_SmugglerCheckpoint', 1000, false);

				// Reset the countdown
				resetCountdown({ identifier });

				// Resolve the promise
				resolve({});
			}
		}, 1000);

		// Push the interval to the countDowns array
		countDowns.push({
			currentSecondsLeft,
			identifier,
			tempInterval,
			resolve
		});
	});

export const stopCountdown = ({ identifier }: ExpectedAny) => {
	// Get the countdown from the array
	const countdown = countDowns.find((countDown) => countDown.identifier === identifier);

	// If the countdown doesn't exists
	if (!countdown) return;

	resetCountdown({ identifier });

	// Reject the started promise
	countdown.resolve({ error: 'STOPPED' });
};

export const renderCountdowns = () => {
	countDowns
		.filter((countDown) => countDown.currentSecondsLeft > 0)
		.forEach(({ currentSecondsLeft }) => {
			mp.game.graphics.drawText(`${currentSecondsLeft}`, [0.5, 0.05], {
				font: 7,
				color: [255, 255, 255, 255],
				scale: [2.0, 2.0],
				outline: true
			});
		});
};
