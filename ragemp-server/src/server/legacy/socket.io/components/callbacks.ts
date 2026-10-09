import { getLanguagePack } from '@vmp/i18n';
import * as rpc from 'rage-rpc';

rpc.on('socket.io@onConnectionFailure', async (_, { player }: rpc.ProcedureInfo) => {
	if (!player) return; // Avoiding TS Error.
	// This event is called only when the client-side got a connect_error from the socket server.
	const lang = getLanguagePack('Socket.io', player.lang || 'EN');
	player.kickDelayed(lang.get('KickTitle'), lang.get('KickMessage'), 30);
});
