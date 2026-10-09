import * as rpc from 'rage-rpc';
import { logClientsideError } from '@client/general/errors';
import { setEscapeKeyDisabled } from '@client/general/disableEscape';
import { controlsDisbled, cursorActive } from '@client/general/cursor';

// Cooldowns
let timerIds: ExpectedAny = {};

// Variables
export let loggedIn = false;
export const interfacesDisabled: ExpectedAny = [];
export let interfacesOpened: ExpectedAny = [];

export let interfacesCooldown: Array<string> = [];
let interfacesCooldownTimers: ExpectedAny = {};

export const setInterfaceIsOpened = async (system: string, bool: boolean) => {
	if (bool === true && !interfacesOpened.includes(system)) {
		interfacesOpened.push(system);
	}

	if (bool === false) {
		const newArr = interfacesOpened.filter((e: ExpectedAny) => e !== system);
		interfacesOpened = newArr;

		// Disable ESC..
		setEscapeKeyDisabled(`system:${system}`, true, true);

		// If there's a timeout waiting
		if (timerIds[`system:${system}`]) {
			// Clear timeout
			clearTimeout(timerIds[`system:${system}`]);
		}

		timerIds[`system:${system}`] = setTimeout(() => {
			// Clear variable..
			setEscapeKeyDisabled(`system:${system}`, false, true);

			// Reset timeout id
			delete timerIds[`system:${system}`];
		}, 1200);
	}

	return true;
};

export const setInterfaceIsDisabled = (name: string, state: boolean) => {
	if (state === true) {
		interfacesDisabled.push(name);
	} else {
		const index = interfacesDisabled.findIndex((e: string) => e === name);
		if (index === -1) return false;
		interfacesDisabled.splice(index, 1);
	}
	return false;
};

export const isInterfaceDisabled = (name: string) => interfacesDisabled.includes(name);
export const isInterfaceOpen = (name: string) => interfacesOpened.includes(name);

export const isFullScreenInterfaceOpened = (allowInterfaces?: Array<string>) => {
	// Interfaces that are NOT considered full screen.
	let invalidInterfaces = [
		// HUD Elements
		'dialog',
		'chat',
		'walkieTalkie',
		// Other systems that are not considered afk worthy..
		'hideHud',
		'testDriveBlankScreen',
		'phone' // Ex: if voice chat, we want them to be able to speak.
	];

	// Interfaces that are considered full screen.
	let interfacesToCheck = interfacesOpened;

	if (allowInterfaces) {
		interfacesToCheck = interfacesToCheck.filter((c: ExpectedAny) => !allowInterfaces.includes(c));
	}

	const interfaces = interfacesToCheck.filter((e: ExpectedAny) => !invalidInterfaces.includes(e));

	return interfaces.length > 0 ? true : false;
};

export const isInterfaceInCooldown = (systemId: string) => (interfacesCooldown.includes(systemId) ? true : false);

/**
 * A simple way to set a timeout for a system. Example: You want pause menu to be re-accessible after 8 seconds.
 * @param systemId - The system id
 * @param seconds - For how many seconds this cooldown is active
 */

export let setInterfaceInCooldown = async (systemId: string, seconds: number) => {
	// Check if is already added
	const alreadyAdded = interfacesCooldown.find((c) => c === systemId);

	// If is not in the array yet
	if (!alreadyAdded) {
		interfacesCooldown.push(systemId);
	}

	if (interfacesCooldownTimers[systemId] !== undefined) {
		// Clear existing timeout
		clearTimeout(interfacesCooldownTimers[systemId]);

		// Delete it!
		delete interfacesCooldownTimers[systemId];
	}

	// Set timeout to clear it.
	interfacesCooldownTimers[systemId] = setTimeout(() => {
		// Finished
		interfacesCooldown = interfacesCooldown.filter((c) => c !== systemId);

		// Delete it
		delete interfacesCooldownTimers[systemId];
	}, seconds);
};

export const isPlayerStandingStill = () => {
	const localplayer = mp.players.local;
	if (
		localplayer.isRunningRagdollTask() ||
		localplayer.isRagdoll() ||
		// @ts-ignore-next-line - weird bug from ts.
		localplayer.isJumping() ||
		localplayer.isShooting() ||
		localplayer.isReloading() ||
		localplayer.isFalling() ||
		localplayer.getIsTaskActive(4) || //TaskAimGunOnFoot
		localplayer.getIsTaskActive(160) || // enter vehicle
		localplayer.getIsTaskActive(2) // exit vehicle
	) {
		return false;
	} else return true;
};

mp.events.add('render', () => {
	mp.game.controls.disableControlAction(0, 199, true); // P Key should always be disabled
	mp.game.ui.hideHudComponentThisFrame(20); // Disable HUD_WEAPON_WHEEL_STATS
});

rpc.register('hasInterfaceOpened', () => interfacesOpened.length > 0);

// Update the variable on client-side when it changes.

let announceLoginEvent = false;

mp.events.addDataHandler('@playerVars.loggedIn', async (entity: PlayerMp, newValue: boolean, oldValue: boolean) => {
	try {
		if (entity.type !== 'player') return; // If is not a player we skip...
		if (entity !== mp.players.local) return; // not us.
		if (newValue === oldValue) return; // anti spam.

		loggedIn = newValue ? true : false;

		if (loggedIn === true && !announceLoginEvent) {
			// Inform client-side that we logged in.
			mp.events.call(`playerLoggedIn`);
			announceLoginEvent = true;
		}
	} catch (err) {
		await logClientsideError(`addDataHandler:loggedIn`, err, {});
	}
});

mp.events.add('consoleCommand', (command) => {
	if (command === 'checkinterfaces') {
		mp.console.logInfo(`Interfaces opened: ${JSON.stringify(interfacesOpened)}`, true, true);
		mp.console.logInfo(`Cursor settings: ${JSON.stringify({ cursorActive, controlsDisbled })}`);
	}
});
