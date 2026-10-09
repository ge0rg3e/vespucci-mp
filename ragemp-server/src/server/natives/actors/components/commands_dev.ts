// commands meant only for local testing.

import { getDefaultVehicleModifications } from '@server/legacy/businesses/systems/tunning/components/functions';
import { getVehicleNativeInfo } from '@server/natives/vehicles/components/core';

if (process.env.ENVIRONMENT !== 'production') {
	let lastPed = 0;

	mp.commands.addCommand({
		name: 'actor_test',
		handler: (player) => {
			lastPed++;

			mp.actors.create({
				identifier: `ped_${lastPed}`,
				attributes: {
					model: `ig_benny`,
					position: player.position,
					heading: player.heading,
					invincible: false,
					frozen: false
				},
				info: {
					name: {
						EN: 'Test NPC',
						RO: 'Test NPC'
					}
				},
				variables: {}
			});
		}
	});

	mp.commands.addCommand({
		name: 'actor_attack',
		handler: (player) => {
			lastPed++;

			const actor = mp.actors.create({
				identifier: `ped_${lastPed}`,
				attributes: {
					model: `ig_benny`,
					position: player.position,
					heading: player.heading,
					invincible: false,
					frozen: false
				},
				info: {
					name: {
						EN: 'NPC Violent',
						RO: 'NPC Violent'
					}
				},
				variables: {}
			});

			setTimeout(() => {
				actor.giveWeapon('smg', 1000);
				actor.taskAttack(player);
			}, 2000);
		}
	});

	mp.commands.addCommand({
		name: 'actor_drive',
		handler: (player) => {
			const model = 'sultan';

			const vehicleData: ExpectedAny = getVehicleNativeInfo({ model: model, displayName: model });

			const veh = mp.vehicles.createVehicle(
				vehicleData.model,
				vehicleData.hash,
				new mp.Vector3(player.position.x + 3, player.position.y, player.position.z),
				{},
				{
					fuel: vehicleData.carTank,
					modifications: {
						...getDefaultVehicleModifications(vehicleData.model)
					}
				}
			);

			player.putIntoVehicle(veh, 1);

			lastPed++;

			const actor = mp.actors.create({
				identifier: `ped_${lastPed}`,
				attributes: {
					model: `ig_benny`,
					position: player.position,
					heading: player.heading,
					invincible: false,
					frozen: false
				},
				info: {
					name: {
						EN: 'NPC Driver',
						RO: 'NPC Sofer'
					}
				},
				variables: {}
			});

			setTimeout(() => {
				actor.taskVehicleDriveToCoord(veh, new mp.Vector3(-1282.278, -1138.15, 6.468), 70, 262144);
			}, 2000);
		}
	});

	mp.commands.addCommand({
		name: 'actor_wandervehicle',
		handler: (player) => {
			const model = 'sultan';

			const vehicleData: ExpectedAny = getVehicleNativeInfo({ model: model, displayName: model });

			const veh = mp.vehicles.createVehicle(
				vehicleData.model,
				vehicleData.hash,
				new mp.Vector3(player.position.x + 3, player.position.y, player.position.z),
				{},
				{
					fuel: vehicleData.carTank,
					modifications: {
						...getDefaultVehicleModifications(vehicleData.model)
					}
				}
			);

			lastPed++;

			mp.actors.create({
				identifier: `ped_drive_wander23232_${lastPed}`,
				attributes: {
					model: `ig_benny`,
					position: player.position,
					heading: player.heading,
					invincible: false,
					frozen: false
				},
				info: {
					vehicleId: veh.id,
					name: {
						EN: `Test Driver`,
						RO: `Sofer Test`
					}
				},
				variables: {}
			});
		}
	});

	mp.events.add('onActorStreamIn', (_, actor, isController) => {
		if (actor.identifier.includes('ped_drive_wander23232_') && isController) {
			const veh = mp.vehicles.at(actor.info.vehicleId);
			if (!veh) return;

			// Put back into veh..
			actor.taskVehicleDriveWander(veh, 30, 262144);
		}
	});

	mp.commands.addCommand({
		name: 'actor_wanderstandard',
		handler: (player) => {
			lastPed++;

			mp.actors.create({
				identifier: `ped_wander_asd123_${lastPed}`,
				attributes: {
					model: `ig_benny`,
					position: player.position,
					heading: player.heading,
					invincible: false,
					frozen: false
				},
				info: {
					name: {
						EN: 'NPC Wanderer',
						RO: 'NPC Plimbaret'
					}
				},
				variables: {}
			});
		}
	});

	mp.events.add('onActorStreamIn', (_, actor, isController) => {
		if (actor.identifier.includes('ped_wander_asd123_') && isController) {
			actor.taskWanderStandard(true);
		}
	});
}
