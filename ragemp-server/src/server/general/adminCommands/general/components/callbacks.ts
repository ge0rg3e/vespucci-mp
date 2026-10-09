import { red, yellow } from 'colorette';
import * as rpc from 'rage-rpc';

/**
 * This event is triggered when a player has an error. (It's limited in their client-side to 5 errors per 1 second.)
 */

rpc.on('errors:caughtClientsideError', (args: ExpectedAny, { player }: rpc.ProcedureInfo) => {
	try {
		if (!player) return false;

		const { name, error, payload } = JSON.parse(args);

		console.log(`${red('[CLIENTSIDE ERROR]')} ${yellow(`${name}`)}: ${JSON.stringify(error)}`, JSON.stringify(error), JSON.stringify({ player: player.info.username, payload }));

		player.sendServerMessage('Server', 'system', `{f96363}[ERROR]{ffffff} Your client-side encountered an error. Press F11 or check the server console.`, 'system');
		return true;
	} catch (err) {
		return false;
	}
});
