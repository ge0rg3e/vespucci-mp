import { getDefaultVehicleModifications } from '@server/legacy/businesses/systems/tunning/components/functions';
import { removeVehicleFromGarage } from '@server/legacy/garages/components/functions';
import { getVehicleNativeInfo } from '@server/natives/vehicles/components/core';
import { createVehicle, PersonalVehicles } from './core';

mp.commands.addCommand({
	name: 'createveh',
	aliases: ['giveveh', 'createvehicle'],
	permission: 'cmds.createveh',
	defineLangs: {
		Message: {
			EN: ({ actioner, player, model }) => `${actioner} created a personal vehicle ${model} for ${player}`,
			RO: ({ actioner, player, model }) => `${actioner} a creat un vehicul personal ${model} pentru ${player}`
		},
		InvalidModel: {
			EN: ({ model }) => `${model} is not a valid vehicle model.`,
			RO: ({ model }) => `${model} nu este un model de masina valid.`
		}
	},
	args: {
		target: 'player',
		model: 'fullText'
	},
	handler: async (player, { target, model }, lang) => {
		const vehicleModel = getVehicleNativeInfo({ model: model, displayName: model });
		if (!vehicleModel) return player.sendErrorMessage('Server', 'system', lang(player.lang, `InvalidModel`, { model }), 'system');

		mp.chat.sendStaffMessageToAll({
			systemId: 'cmdLangs:createveh',
			messageId: 'Message',
			permission: 'cmds.createveh',
			args: () => ({
				player: target.info.username,
				actioner: player.info.username,
				model: vehicleModel.displayName
			})
		});

		const hadVehiclesBefore = PersonalVehicles.find((v) => v.ownerId === target.info.id) ? true : false;

		await createVehicle({
			model: vehicleModel.model,
			displayName: vehicleModel.displayName,
			ownerId: target.info.id,
			ownerName: target.info.username,
			modifications: getDefaultVehicleModifications(vehicleModel.model),
			fuel: vehicleModel.carTank
		});

		if (!hadVehiclesBefore) {
			target.notifyAboutAppAccess({ EN: 'Vehicles', RO: 'Vehicule' }, 'vehicles');
		}

		player.createAmplitudeEvent(`Created personal vehicle`, { for: target.info.username, model: vehicleModel.model, displayName: vehicleModel.displayName });
		target.createAmplitudeEvent(`Received personal vehicle`, { actioner: player.info.username, model: vehicleModel.model, displayName: vehicleModel.displayName });

		// Updating their phone if needed to see the change in live action

		mp.players.forEachLoggedIn(async (p: PlayerMp) => {
			if (p.id === target.id || (p.vars.checkingPersonalVehicles && p.vars.checkingVehPlayerId === target.id)) {
				const appId: ExpectedAny = await player.getPhoneApplicationRunning();
				if (appId !== 'vehicles') return;
				p.triggerBrowserEvent(`requestAppDataUpdate`);
			}
		});
	}
});

mp.commands.addCommand({
	name: `getveh`,
	permission: `cmds.getveh`,
	defineLangs: {
		Announcement: {
			EN: ({ actioner, vehicleId }) => `${actioner} teleported vehicle with id ${vehicleId} to him`,
			RO: ({ actioner, vehicleId }) => `${actioner} a teleportat vehiculul cu id ${vehicleId} la el`
		},
		InvalidId: {
			EN: ({ vehicleId }) => `There is no vehicle entity with id ${vehicleId}`,
			RO: ({ vehicleId }) => `Nu există nici un vehicul cu id ${vehicleId}`
		},
		RemovalFromGarageFailed: {
			EN: 'Failed to remove the vehicle from garage',
			RO: 'A esuat scoaterea vehiculului din garaj.'
		}
	},
	args: {
		vehicleId: 'number'
	},
	handler: async (player, { vehicleId }, lang) => {
		const entity = mp.vehicles.at(vehicleId);
		if (!entity) return player.sendErrorMessage('Server', 'system', lang(player.lang, 'InvalidId', { vehicleId }), 'system');

		// If is personal and is within a garage we must remove it from the garage first
		if (entity.vars.pVehicle) {
			const veh = PersonalVehicles.find((v) => v.id === entity.vars.pVehicle);
			if (!veh) return false;

			if (veh.status === 2 && veh.garageId) {
				const res = await removeVehicleFromGarage(veh.id, veh.garageId);
				if (!res) return player.sendErrorMessage('Server', 'system', lang(player.lang, 'RemovalFromGarageFailed'), 'system');
			}
		}

		entity.setPositionPatched(player.position);
		entity.dimension = player.dimension;

		mp.chat.sendStaffMessageToAll({
			systemId: 'cmdLangs:getveh',
			messageId: 'Announcement',
			permission: 'cmds.getveh',
			args: () => ({
				actioner: player.info.username,
				vehicleId
			})
		});

		const amplitudeProps: ExpectedAny = {
			vehicleId,
			isPersonalVehicle: entity.vars.pVehicle ? 'Yes' : 'No'
		};

		if (amplitudeProps.isPersonalVehicle !== 'No') {
			amplitudeProps.pVehicle = entity.vars.pVehicle;
			amplitudeProps.pVehicleOwnerId = entity.vars.pVehicleOwnerId;
		}

		player.createAmplitudeEvent(`Teleported vehicle to him`, amplitudeProps);
	}
});

mp.commands.addCommand({
	name: `gotoveh`,
	permission: `cmds.gotoveh`,
	defineLangs: {
		Announcement: {
			EN: ({ actioner, vehicleId }) => `${actioner} has teleported to vehicle id ${vehicleId}`,
			RO: ({ actioner, vehicleId }) => `${actioner} s-a teleportat la un vehicul cu id ${vehicleId}`
		},
		InvalidId: {
			EN: ({ vehicleId }) => `There is no vehicle entity with id ${vehicleId}`,
			RO: ({ vehicleId }) => `Nu există nici un vehicul cu id ${vehicleId}`
		}
	},
	args: {
		vehicleId: 'number'
	},
	handler: (player, { vehicleId }, lang) => {
		const entity = mp.vehicles.at(vehicleId);
		if (!entity) return player.sendErrorMessage('Server', 'system', lang(player.lang, 'InvalidId', { vehicleId }), 'system');

		player.resetInteriorVarsOnTeleport();

		player.position = entity.position;
		player.dimension = entity.dimension;

		mp.chat.sendStaffMessageToAll({
			systemId: 'cmdLangs:gotoveh',
			messageId: 'Announcement',
			permission: 'cmds.gotoveh',
			args: () => ({
				actioner: player.info.username,
				vehicleId
			})
		});

		const amplitudeProps: ExpectedAny = {
			vehicleId,
			isPersonalVehicle: entity.vars.pVehicle ? 'Yes' : 'No'
		};

		if (amplitudeProps.isPersonalVehicle) {
			amplitudeProps.pVehicle = entity.vars.pVehicle;
			amplitudeProps.pVehicleOwnerId = entity.vars.pVehicleOwnerId;
		}

		player.createAmplitudeEvent(`Teleported to vehicle id`, amplitudeProps);
	}
});

mp.commands.addCommand({
	name: `checkveh`,
	permission: `cmds.checkveh`,
	defineLangs: {
		Announcement: {
			EN: ({ actioner, target }) => `${actioner} is checking personal vehicle id ${target}`,
			RO: ({ actioner, target }) => `${actioner} verifică vehiculul personal id ${target}`
		},
		InvalidId: {
			EN: 'This id is not matching any personal vehicle in database.',
			RO: 'Acest id nu se potrivește cu nici un vehicul personal în baza de date.'
		}
	},
	args: {
		id: 'number'
	},
	handler: async (player, { id }, lang) => {
		const veh = PersonalVehicles.find((veh) => veh.id === id);

		if (!veh) return player.sendErrorMessage('Server', 'system', lang(player.lang, 'InvalidId'), 'system');

		mp.chat.sendStaffMessageToAll({
			systemId: 'cmdLangs:checkveh',
			messageId: 'Announcement',
			permission: 'cmds.checkveh',
			args: () => ({
				actioner: player.info.username,
				target: id
			})
		});

		player.createAmplitudeEvent(`Administrating vehicles`, {
			vehicles: [veh.id],
			owner: veh.ownerName,
			vehicleType: `personal`,
			findType: 'vehiclDbId'
		});

		// Updating the player now..

		player.updateVars({
			checkingPersonalVehicles: [id],
			checkingVehMethodType: 'vehicle'
		});

		// Let's take it home
		if (await player.isPhoneApplicationOpened()) {
			player.openPhoneApplication('home');
		}

		// Opening the phone up..
		player.openPhoneApplication(`vehicles`);

		// Raising the phone up
		player.triggerClientEvent(`setPhoneIsRaised`, { boolean: true });
	}
});

mp.commands.addCommand({
	name: `checkpveh`,
	permission: `cmds.checkveh`,
	defineLangs: {
		Announcement: {
			EN: ({ actioner, target }) => `${actioner} is checking personal vehicle for player ${target}`,
			RO: ({ actioner, target }) => `${actioner} verifică vehiculele personale lui ${target}`
		},
		NoVehicles: {
			EN: 'This player has no vehicles.',
			RO: 'Acest jucator nu are nici un vehicul personal.'
		}
	},
	args: {
		target: 'player'
	},
	handler: async (player, { target }, lang) => {
		const vehs = PersonalVehicles.filter((veh: PersonalVehicle) => veh.ownerId === target.info.id);
		if (vehs.length < 1) return player.sendErrorMessage('Server', 'system', lang(player.lang, 'NoVehicles'), 'system');

		mp.chat.sendStaffMessageToAll({
			systemId: 'cmdLangs:checkpveh',
			messageId: 'Announcement',
			permission: 'cmds.checkveh',
			args: () => ({
				actioner: player.info.username,
				target: target.info.username
			})
		});

		player.createAmplitudeEvent(`Administrating vehicles`, {
			vehicles: vehs.map((v: PersonalVehicle) => v.id),
			owner: target.info.username,
			vehicleType: `personal`,
			findType: 'vehiclDbId'
		});

		// Updating the player now..

		player.updateVars({
			checkingPersonalVehicles: vehs.map((v: PersonalVehicle) => v.id),
			checkingVehMethodType: 'player',
			checkingVehPlayerId: target.id
		});

		// Let's take it home
		if (await player.isPhoneApplicationOpened()) {
			player.openPhoneApplication('home');
		}

		// Opening the phone up..
		player.openPhoneApplication(`vehicles`);

		// Raising the phone up
		player.triggerClientEvent(`setPhoneIsRaised`, { boolean: true });
	}
});
