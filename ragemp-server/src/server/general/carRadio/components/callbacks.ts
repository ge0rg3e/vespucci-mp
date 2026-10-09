import { logError } from '@server/utils/helpers';
import { getNativeRadio, nativeRadios } from './core';
import * as rpc from 'rage-rpc';

rpc.on('carRadio:onOptionSelected', (args: ExpectedAny, { player }: rpc.ProcedureInfo) => {
	if (!player || !player.vehicle) return false;

	const { id } = JSON.parse(args);

	// Get the radio station
	const radioStation = getNativeRadio({ id });
	if (id && !radioStation) return false;

	mp.players.forEachLoggedIn((entity: PlayerMp) => {
		if (player.vehicle === entity.vehicle) {
			if (id === null) {
				// They stopped the radio..
				entity.stopCarRadio();
			} else {
				entity.playCarRadio(id);
			}
		}
	});

	// Update the vehicle too..
	player.vehicle.updateVars({ radio: id === null ? 0 : id });

	// Announce on roleplay...
	mp.chat.announceRoleplayAction({
		position: player.position,
		systemId: 'carRadio',
		messageId: id !== null ? 'Action:Play' : 'Action:Stop',
		range: 10,
		args: () => ({
			player: player.info.username,
			name: id === null ? null : radioStation!.label
		})
	});

	return true;
});

rpc.on('carRadio.requestData', async (_, { player }: rpc.ProcedureInfo) => {
	if (!player) return false; // Avoiding TS Error.
	try {
		const stations = nativeRadios.map((radio) => ({ ...radio, logo: `${'__ASSETS__'}/images/carRadio/${radio.id}.png` }));
		const currentStation = player.vehicle ? player.vehicle.vars.radio : false;

		player.triggerBrowserEvent('carRadio.receivedData', { stations, currentStation });

		return true;
	} catch (err) {
		await logError(`carRadio.requestData`, err);
		return false;
	}
});
