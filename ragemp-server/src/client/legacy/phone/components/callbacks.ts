import { logClientsideError } from '@client/general/errors';
import { loggedIn } from '@client/natives/interfaces';
import * as rpc from 'rage-rpc';
import { phoneMounted, phoneRaised } from './legacy';
import { isWritingOnPhone, setPhoneRaised } from './functions';

rpc.on('onAuthCompleted', () => {
	mp.game.streaming.requestAnimDict('cellphone@');
	mp.game.streaming.requestAnimDict(`anim@cellphone@in_car@ds`);
	mp.game.streaming.requestAnimDict(`anim@cellphone@in_car@ps`);
	mp.game.streaming.requestAnimDict(`amb@world_human_stand_mobile@female@text@base`);
	mp.game.streaming.requestAnimDict(`amb@world_human_stand_mobile@male@text@base`);
});

// This way is safer, we can try and catch the "not found rpc"

rpc.register(`phone.getAppRunning`, () => {
	try {
		if (!loggedIn || !phoneMounted) return null;
		const app = rpc.callBrowsers(`getPhoneAppRunning`);
		return app;
	} catch (err) {
		logClientsideError(`phone.getAppRunning`, err);
		return null;
	}
});

rpc.on('interfaces:mainInterfaceIsOpening', async () => {
	// If the phone is raised and is not writing
	const isPhoneWriting = await isWritingOnPhone();

	// If the phone is not writing and we are about to open it..
	if (phoneRaised && !isPhoneWriting) {
		setPhoneRaised(false);
	}
});
