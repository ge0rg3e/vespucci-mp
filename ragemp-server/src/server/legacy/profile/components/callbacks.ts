import { PersonalVehicleEntities, PersonalVehicles } from '@server/legacy/vehicles/components/core';
import { getVehicleNativeInfo } from '@server/natives/vehicles/components/core';
import { findPlayerAt, logError } from '@server/utils/helpers';
import * as rpc from 'rage-rpc';

export const getProfileDataforPlayer = async (playerId: number) => {
	const target = findPlayerAt(playerId);
	if (!target) return null;

	const licenses = target.info.licenses.map((l) => ({
		id: l.id,
		hours: l.hours
	}));

	const vehicles = PersonalVehicles.filter((v) => v.ownerId === target.info.id)
		.map((v) => {
			const nativeInfo = getVehicleNativeInfo({ model: v.model });
			if (!nativeInfo) return null;

			const entityId: string = v.status === 0 ? 'N/A' : `${PersonalVehicleEntities[v.id] || `Unknown`}`;

			return {
				...v,
				extra: {
					entityId,
					modelName: nativeInfo.displayName,
					hasEngine: nativeInfo.hasEngine,
					carTank: nativeInfo.carTank
				}
			};
		})
		.filter((v) => v !== null);

	return {
		remoteInfo: target.info,
		remoteExtras: {
			experience_required: target.getExperienceRequired(),
			developer: target.isDeveloper(),
			admin: target.getAdminLevel(),
			sessionTime: target.vars.sessionTime,
			dimension: target.dimension,
			vehicles,
			licenses,
			sanctions: [],
			actions: [] // @later when we add actions to add it in here. But also we should paginate it on the server-side and allow the server from front-end to look at it.
		},
		remoteId: target.id
	};
};

rpc.on('requestProfileData', async (args, { player }: rpc.ProcedureInfo) => {
	if (!player) return; // Avoiding TS Error.
	try {
		const data = await getProfileDataforPlayer(args.playerId);
		if (!data) return; // No matching data, the user will see an infinte loading.

		player.triggerSocketEvent(`onProfileDataReceived`, {
			...data,
			localId: player.id,
			localInfo: player.info,
			disconnected: false
		});

		if (player.id === args.playerId) {
			// if he opens his own profile
			player.createAmplitudeEvent(`Opened profile`);
		}
	} catch (err) {
		await logError(`REQUEST_PROFILE_DATA`, err, {
			player: player.info.username,
			target: args.playerId
		});
	}
});
