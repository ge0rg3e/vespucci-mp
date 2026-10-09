import { interfacesOpened, loggedIn } from '@client/natives/interfaces';
import * as rpc from 'rage-rpc';

// Keys..
const ESC_KEY = 0x1b; // ESC

mp.keys.bind(ESC_KEY, true, () => {
	if (!loggedIn || !interfacesOpened.includes('generalStore') || interfacesOpened.length < 1) {
		return;
	}

	// Hide interfaces..
	rpc.trigger(`shop:hide`);
});

rpc.on('interfaces:forceClose', () => {
	if (!interfacesOpened.includes('generalStore')) return;

	// Hide interfaces..
	rpc.trigger(`shop:hide`);
});
