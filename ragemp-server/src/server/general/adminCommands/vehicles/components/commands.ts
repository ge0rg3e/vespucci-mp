import { getVehicleNativeInfo } from '@server/natives/vehicles/components/core';
import { getDefaultVehicleModifications } from '@server/legacy/businesses/systems/tunning/components/functions';
import { getLanguagePack } from '@vmp/i18n';
let racCooldown = false;

mp.commands.addCommand({
	name: 'rac',
	permission: 'cmds.rac',
	defineLangs: {
		Announcement: {
			EN: ({ admin }) => `{F1C410}${admin} will respawn all unused vehicles in 15 seconds.`,
			RO: ({ admin }) => `{F1C410}${admin} va respawna toate masinile nefolosite in 15 secunde.`
		},
		SuccessAnnouncement: {
			EN: () => `{F1C410}All unused vehicles in the past 10 minutes have been respawned.`,
			RO: () => `{F1C410}Toate masinile nefolosite in ultimele 10 minute au fost respawnate.`
		},
		CooldownMessage: {
			EN: () => `Please wait until the cooldown is finished.`,
			RO: () => `Te rog asteapta pana se termina cooldown.`
		}
	},
	handler: (player, _, lang) => {
		if (racCooldown === true) return player.sendErrorMessage('Server', 'system', lang(player.lang, `CooldownMessage`), 'system');

		racCooldown = true;

		mp.chat.sendChatMessageToAll({
			channel: 'system',
			sender: () => player.info.username,
			type: (target) => mp.chat.getMessageType('system', target.lang),
			content: (target) => {
				// Get lang
				const lang = getLanguagePack('cmdLangs:rac', target.lang);

				return {
					type: 'text',
					data: `${lang.get(`Announcement`, {
						admin: player.info.username
					})}`
				};
			}
		});

		setTimeout(() => {
			mp.vehicles.forEachValid((veh: VehicleMp) => {
				if (veh.vars && veh.vars.emptyVehicle > 10) {
					veh.respawn();
					if (veh && veh.vars.temporary === true) {
						// is a temporary veh created by /veh
						veh.destroy();
					}
				}
			});
			racCooldown = false;
			const validPlayer = mp.players.at(player.id);
			if (!validPlayer) return; // The player may now be offline. Without this check the server may crash.

			mp.chat.sendChatMessageToAll({
				channel: 'system',
				sender: () => player.info.username,
				type: (target) => mp.chat.getMessageType('system', target.lang),
				content: (target) => {
					// Get lang
					const lang = getLanguagePack('cmdLangs:rac', target.lang);

					return {
						type: 'text',
						data: `${lang.get(`SuccessAnnouncement`)}`
					};
				}
			});
		}, 15000);

		player.createAmplitudeEvent('Respawn all cars', { actioner: player.info.username });
	}
});

mp.commands.addCommand({
	name: 'rtc',
	permission: 'cmds.rtc',
	defineLangs: {
		Announcement: {
			EN: ({ admin }) => `${admin} respawn a car.`,
			RO: ({ admin }) => `${admin} a respawnat o masina.`
		},
		NotInVehicle: {
			EN: () => `You're not in a car.`,
			RO: () => `Nu esti intr-o masina.`
		}
	},
	handler: (player, _, lang) => {
		if (!player.vehicle) return player.sendErrorMessage('Server', 'system', lang(player.lang, 'NotInVehicle'), 'system');

		mp.chat.sendStaffMessageToAll({
			systemId: 'cmdLangs:rtc',
			messageId: 'Announcement',
			permission: 'cmds.rtc',
			args: () => ({ admin: player.info.username })
		});

		player.vehicle.respawn();
		player.createAmplitudeEvent('Respawned this car', { actioner: player.info.username });
	}
});

mp.commands.addCommand({
	name: 'fv',
	aliases: 'fixvehicle',
	permission: 'cmds.fixvehicle',
	defineLangs: {
		Announcement: {
			EN: ({ admin }) => `${admin} repaired his vehicle.`,
			RO: ({ admin }) => `${admin} a reparat o masina.`
		},
		NotInVehicle: {
			EN: () => `You're not in a car.`,
			RO: () => `Nu esti intr-o masina.`
		}
	},
	handler: (player, _, lang) => {
		if (!player.vehicle) return player.sendErrorMessage('Server', 'system', lang(player.lang, 'NotInVehicle'), 'system');

		mp.chat.sendStaffMessageToAll({
			systemId: 'cmdLangs:fv',
			messageId: 'Announcement',
			permission: 'cmds.fixvehicle',
			args: () => ({ admin: player.info.username })
		});

		player.vehicle.repairVehicle();

		player.createAmplitudeEvent('Fixed vehicle', { actioner: player.info.username });
	}
});

mp.commands.addCommand({
	name: 'fav',
	permission: 'cmds.fav',
	defineLangs: {
		Announcement: {
			EN: ({ admin }) => `${admin} repaired all the cars.`,
			RO: ({ admin }) => `${admin} a reparat toate masinile.`
		}
	},
	handler: (player) => {
		mp.chat.sendStaffMessageToAll({
			systemId: 'cmdLangs:fav',
			messageId: 'Announcement',
			permission: 'cmds.fav',
			args: () => ({ admin: player.info.username })
		});

		mp.vehicles.forEachValid((veh: VehicleMp) => veh.repairVehicle());

		player.createAmplitudeEvent('Fixed all vehicles', { actioner: player.info.username });
	}
});

mp.commands.addCommand({
	name: 'flip',
	aliases: 'flipvehicle',
	permission: 'cmds.flipvehicle',
	defineLangs: {
		Announcement: {
			EN: ({ admin }) => `${admin} flip a car.`,
			RO: ({ admin }) => `${admin} a pus o masina pe roti.`
		},
		NotInVehicle: {
			EN: () => `You're not in a car.`,
			RO: () => `Nu esti intr-o masina.`
		}
	},
	handler: (player, _, lang) => {
		if (!player.vehicle) return player.sendErrorMessage('Server', 'system', lang(player.lang, 'NotInVehicle'), 'system');

		mp.chat.sendStaffMessageToAll({
			systemId: 'cmdLangs:flip',
			messageId: 'Announcement',
			permission: 'cmds.flipvehicle',
			args: () => ({ admin: player.info.username })
		});

		player.triggerClientEvent(`putVehicleOnGround`, {
			vehicleId: player.vehicle.id
		});

		player.createAmplitudeEvent('Flip car', { actioner: player.info.username });
	}
});

mp.commands.addCommand({
	name: 'veh',
	aliases: 'v',
	permission: 'cmds.veh',
	defineLangs: {
		Message: {
			EN: ({ player, model }) => `${player} spawned a ${model} vehicle in-game.`,
			RO: ({ player, model }) => `${player} a creat un vehicul ${model} in joc.`
		},
		InvalidModel: {
			EN: ({ model }) => `${model} is not a valid vehicle model.`,
			RO: ({ model }) => `${model} nu este un model de masina valid.`
		},
		CannotUseInGarage: {
			EN: 'You cannot use this command in the garage.',
			RO: 'Nu poți folosi această comandă în garaj.'
		}
	},
	args: {
		model: 'fullText'
	},
	handler: (player, { model }, lang) => {
		const vehicleData = getVehicleNativeInfo({ model: model, displayName: model });
		if (!vehicleData) return player.sendErrorMessage('Server', 'system', lang(player.lang, `InvalidModel`, { model }), 'system');

		if (player.vars.garageEntered) {
			return player.sendErrorMessage('Server', 'system', lang(player.lang, `CannotUseInGarage`), 'system');
		}

		mp.chat.sendStaffMessageToAll({
			systemId: 'cmdLangs:veh',
			messageId: 'Message',
			permission: 'cmds.veh',
			args: () => ({
				player: player.info.username,
				model: vehicleData.displayName
			})
		});

		const veh = mp.vehicles.createVehicle(
			vehicleData.model,
			vehicleData.hash,
			player.position,
			{},
			{
				fuel: vehicleData.carTank,
				modifications: {
					...getDefaultVehicleModifications(vehicleData.model)
				}
			}
		);

		veh.dimension = player.dimension;

		player.putIntoVehicle(veh, 0);
		veh.updateVars({ temporary: true });
		player.createAmplitudeEvent(`Spawned a vehicle`, { model: vehicleData.model, displayName: vehicleData.displayName });
	}
});
