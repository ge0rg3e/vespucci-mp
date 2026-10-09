import { loggedIn } from '@client/natives/interfaces';

mp.events.add('entityStreamIn', (entity: ExpectedAny) => {
	if (entity.type !== 'ped') return;
	if (entity.remoteId === 65535) return; // Is client-side
	if (loggedIn !== true) return; // bugfix.

	mp.events.callRemote(`onActorStreamIn:Init`, entity.remoteId);
});

mp.events.add('entityStreamOut', (entity: ExpectedAny) => {
	if (entity.type !== 'ped') return;
	if (entity.remoteId === 65535) return; // Is client-side
	if (loggedIn !== true) return; // bugfix.

	mp.events.callRemote(`onActorStreamOut:Init`, entity.remoteId);
});
