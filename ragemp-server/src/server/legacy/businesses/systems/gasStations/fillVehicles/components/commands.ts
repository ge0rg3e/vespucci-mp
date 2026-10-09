import { getVehicleNativeInfo } from '@server/natives/vehicles/components/core';

mp.commands.addCommand({
	name: 'ftc',
	permission: 'cmds.ftc',
	defineLangs: {
		Announcement: {
			EN: ({ admin, model }) => `${admin} fuelled up his ${model}.`,
			RO: ({ admin, model }) => `${admin} a facut plinul la ${model} lui.`
		},
		NotInVehicle: {
			EN: () => `You're not in a vehicle.`,
			RO: () => `Nu esti intr-o masina.`
		}
	},
	handler: (player, _, lang) => {
		if (!player.vehicle) return player.sendErrorMessage('Server', 'system', lang(player.lang, 'NotInVehicle'), 'system');

		const nativeInfo = getVehicleNativeInfo({ model: player.vehicle.vars.model });

		if (!nativeInfo) return false;

		mp.chat.sendStaffMessageToAll({
			systemId: 'cmdLangs:ftc',
			messageId: 'Announcement',
			permission: 'cmds.ftc',
			args: () => ({ admin: player.info.username, model: nativeInfo.displayName })
		});

		player.vehicle.setFuel(nativeInfo.carTank);
		player.createAmplitudeEvent('Fuelled up a vehicle', { actioner: player.info.username, vehicleModel: nativeInfo.displayName, adminFunctionality: true });
	}
});

mp.commands.addCommand({
	name: 'fac',
	permission: 'cmds.fac',
	defineLangs: {
		Announcement: {
			EN: ({ admin }) => `${admin} filled all gas tanks.`,
			RO: ({ admin }) => `${admin} a umplut rezervorul la toate masinile.`
		}
	},
	handler: (player) => {
		mp.chat.sendStaffMessageToAll({
			systemId: 'cmdLangs:fac',
			messageId: 'Announcement',
			permission: 'cmds.fac',
			args: () => ({ admin: player.info.username })
		});

		mp.vehicles.forEachValid((veh: VehicleMp) => {
			const nativeInfo = getVehicleNativeInfo({ model: veh.vars.model });
			if (!nativeInfo) return;

			return veh.setFuel(nativeInfo.carTank);
		});

		player.createAmplitudeEvent('Filled up all vehicles', { actioner: player.info.username });
	}
});
