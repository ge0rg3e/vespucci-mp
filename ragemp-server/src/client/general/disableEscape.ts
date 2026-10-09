import * as rpc from 'rage-rpc';

// Variables
let timersIds: ExpectedAny = {};

// If multiple systems need escape key disabled, we need to make sure that we don't have a scenario where one system enables it too soon for the others.
let escapedForSystems: ExpectedAny = {};

/**
 * Allows you to disable the normal Escape Key behavior in-game.
 * @param systemId
 * @param value
 * @param instant If you want to disable escape right away or not.
 * @returns
 */

export const setEscapeKeyDisabled = (systemId: string, value: boolean, instant = false) => {
	// This should act right away not waiting 2 seconds.
	if (instant) {
		if (value) {
			escapedForSystems[systemId] = value;
		} else {
			delete escapedForSystems[systemId];
		}
		return false;
	}

	if (value === true) {
		// If timer is valid and we just turn it on we stop this timer to make we won't disable it.
		if (timersIds[systemId]) {
			// Clear timeout
			clearTimeout(timersIds[systemId]);

			// Reset variable
			delete timersIds[systemId];
		}

		// Mark it as disabled for system
		escapedForSystems[systemId] = true;
	}

	if (value === false) {
		timersIds[systemId] = setTimeout(() => {
			// Delete..
			delete escapedForSystems[systemId];

			// Reset variable..
			delete timersIds[systemId];
		}, 2000);
	}

	return true;
};

/**
 * Allows you to check if escape key is disabled in general or for a specific escape key.
 * @param systemId
 * @returns The boolean if is escape disabled or not.
 */

export const isEscapeKeyDisabled = (systemId?: string) => {
	if (systemId) return escapedForSystems[systemId] ? true : false;

	// mp.console.logInfo(`Object: ${Object.keys(escapedForSystems)}`);
	return Object.keys(escapedForSystems).length > 0 ? true : false;
};

rpc.on(`setEscapeKeyDisabled`, (args) => {
	const { system, value, instant = false } = JSON.parse(args);
	setEscapeKeyDisabled(system, value, instant);
});

mp.events.add('render', () => {
	// The normal Escape Key from GTA is always disabled because we trigger it manually.
	mp.game.controls.disableControlAction(0, 200, true); // Disable ESC

	return true;
});
