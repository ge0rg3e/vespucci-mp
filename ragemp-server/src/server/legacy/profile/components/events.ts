import { getLanguagePack } from '@vmp/i18n';
import { getProfileDataforPlayer } from './callbacks';
import * as rpc from 'rage-rpc';

declare global {
	interface PlayerVariables {
		checkingProfileId: number | null;
	}
}

mp.events.add('loadPlayerDefaults', (player) => {
	player.updateVars({
		checkingProfileId: null
	});
});

mp.events.add('playerQuit', (player) => {
	if (player.vars && player.vars.loggedIn) {
		mp.players.forEachLoggedIn((entity: PlayerMp) => {
			if (entity.vars.checkingProfileId !== player.id) return false;

			const lang = getLanguagePack(`gameProfile`, entity.info.language);
			entity.toast({ type: 'warning', message: lang.get('Disconnect', { player: player.info.username }) });

			// Updating CEF
			const data = getProfileDataforPlayer(player.id);

			entity.triggerSocketEvent(`onProfileDataReceived`, {
				...data,
				localId: entity.id,
				localInfo: entity.info,
				disconnected: true
			});

			return true;
		});
	}
});

rpc.on(`closedProfileScreen`, async (_, { player }: rpc.ProcedureInfo) => {
	if (!player) return false;
	player.updateVars({
		checkingProfileId: null
	});
	player.createAmplitudeEvent(`Closed profile`);
	return true;
});

export {};
