// A nice array so we can cancel easily the timeouts.
let timeoutsCancellable: ExpectedAny = {};

export const setAnimOnTimeoutCallback = (player: PlayerMp, anim: { dict: string; name: string }, duration: number, func: Function) => {
	// Create a set timeout with no await expectation.
	let timeoutId = `${player.info.id}:${anim.dict}:${anim.name}`;

	// If an id already exist by any chance
	if (timeoutsCancellable[timeoutId]) {
		// Clear
		clearTimeout(timeoutsCancellable[timeoutId]);

		// Reset variable
		delete timeoutsCancellable[timeoutId];
	}

	// Set timeout..
	timeoutsCancellable[timeoutId] = setTimeout(() => {
		// Get the entity again..
		const target = mp.players.atAccountId(player.info.id);
		if (!target) return false; // The player is no longer online.

		// We need to pass it over..
		const stopCurrentAnimation = () => target.stopSpecificAnimation(anim.dict, anim.name);

		// Invoke function...
		func(target, stopCurrentAnimation);

		// Delete timeout..
		delete timeoutsCancellable[timeoutId];

		return true;
	}, duration);
};

export const clearAnimTimeout = (player: PlayerMp, anim: { dict: string; name: string }) => {
	let timeoutId = `${player.info.id}:${anim.dict}:${anim.name}`;

	// Get the match..
	const match = timeoutsCancellable[timeoutId];

	if (!match) return false; // doesn't exist

	// Clear timeout
	clearTimeout(match);

	// Delete..
	delete timeoutsCancellable[timeoutId];

	return true;
};
