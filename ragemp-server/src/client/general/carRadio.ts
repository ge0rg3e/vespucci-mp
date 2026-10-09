import { interfacesOpened, loggedIn, setInterfaceIsOpened, setInterfaceInCooldown, interfacesCooldown, isInterfaceInCooldown } from '@client/natives/interfaces';
import { isButtonUsedByDialog } from './dialogs';
import * as rpc from 'rage-rpc';
import { logClientsideError } from './errors';
import { instances as AudioInstances } from '@client/natives/audio/components/data';
import { getGameSettings } from '@client/natives/settings';
import { setAudioVolume } from '@client/natives/audio/components/functions';
import { setCursorVisible } from './cursor';

const player = mp.players.local;
let localState = false;

// KEYS

const Q_KEY = 0x51;
const ESC_KEY = 0x1b;

mp.events.add('render', () => {
	if (!player.vehicle) return;

	// Is a model that should use a radio?
	if (mp.game.vehicle.isThisModelABicycle(player.vehicle.model)) return;

	// Disable keys for default game radio..
	mp.game.controls.disableControlAction(2, 85, true); // CAR Q RADIO
	mp.game.audio.setRadioToStationName('OFF');
	mp.game.audio.setUserRadioControlEnabled(false);

	if (localState === true) {
		mp.game.controls.disableControlAction(2, 1, true); // left right
		mp.game.controls.disableControlAction(2, 2, true); // up down
	}
});

mp.keys.bind(Q_KEY, true, () => {
	if (isButtonUsedByDialog('Q') || !player.vehicle || !loggedIn || isInterfaceInCooldown('carRadio')) return;

	// If interface is opened and is not this one
	if (interfacesOpened.length > 0 && localState !== true) return;

	// Is the player the one driving?
	const isDriving = player.vehicle.getPedInSeat(-1) === player.handle ? true : false;
	if (!isDriving) return;

	// Is a model that should use a radio?
	if (mp.game.vehicle.isThisModelABicycle(player.vehicle.model)) return;

	switchState(!localState);
});

mp.keys.bind(ESC_KEY, true, () => {
	if (localState === true) {
		switchState(false);
	}
});

const switchState = async (boolean: boolean) => {
	setCursorVisible(`carRadio`, boolean);
	setInterfaceIsOpened('carRadio', boolean);
	setInterfaceInCooldown('carRadio', 1000);

	localState = boolean;

	if (boolean === true) {
		mp.game.graphics.setTimecycleModifier('BloomMid');
		mp.game.graphics.startScreenEffect(`SwitchHUDIn`, 300, false);
		await mp.game.waitAsync(350);
		rpc.trigger(`setBrowserPage`, JSON.stringify({ page: `/carRadio` }));
		localState = true;
	} else {
		rpc.trigger(`setBrowserPage`, JSON.stringify({ page: `/` }));
		mp.game.graphics.setTimecycleModifier('default');
		mp.game.graphics.stopScreenEffect(`SwitchHUDIn`);
		mp.game.graphics.startScreenEffect(`SwitchHUDOut`, 1000, false);
		await mp.game.waitAsync(200);
		localState = false;
	}
};

rpc.on('interfaces:forceClose', () => {
	if (localState === true) {
		switchState(false);
	}
});

rpc.on(`gameSettingsUpdated`, async () => {
	try {
		// Check if car radio is playing
		const instance = AudioInstances.find((c) => c.identifier === 'carRadio');
		if (!instance) return false;

		// Get game settings
		const settings = await getGameSettings();
		if (!settings) return false;

		// Calculate volume
		const newVolume = settings.carSpeakers.enabled ? settings.carSpeakers.volume : 0;

		// Update audio
		setAudioVolume(instance.identifier, newVolume);

		return true;
	} catch (err) {
		await logClientsideError(`radio.gameSettingsUpdated`, err);
		return false;
	}
});
