import { logError } from '@server/utils/helpers';
import { green } from 'colorette';

// Dependencies
import { getDefaultVehicleModifications } from '@server/legacy/businesses/systems/tunning/components/functions';
import { getVehicleNativeInfo } from '@server/natives/vehicles/components/core';

// Prototype Data - For now is here.
import data from '../data.json';

const pedestrians: ExpectedAny[] = [];

export const createPedestrians = async () => {
	try {
		// These are the peds that must be created.
		let pedsToCreate = [
			// Pedestrians that jus twander around
			...data.pedestrians.map((pedestrian) => ({ ...pedestrian, driver: false })),
			// Pedestrians that also have a car and drive around
			...data.drivers.map((driver) => ({ ...driver, driver: true }))
		];

		// Let's create them now..
		pedsToCreate.forEach((entry, i) => {
			// We get the gender of the ped.
			const gender = entry.gender as 'male' | 'female';

			// We pick a random skin..
			const actorModel = data.skins[gender][Math.floor(Math.random() * data.skins[gender].length)];

			// We pick a random vehicle model from our list of vehicles allowed to be picked.
			const vehicleModel = data.vehicles[Math.floor(Math.random() * data.vehicles.length)];

			// We now get the opsition fo the ped..
			const position = new mp.Vector3({ ...entry.coords });
			const heading = entry.heading;

			// We need to create this here to hold the data..
			let vehicle: VehicleMp | null = null;

			// If he's a driver..
			if (entry.driver) {
				const vehicleData: ExpectedAny = getVehicleNativeInfo({ model: vehicleModel });

				// We create the vehicle..
				vehicle = mp.vehicles.createVehicle(
					vehicleData.model,
					vehicleData.hash,
					new mp.Vector3({ x: position.x + 5, y: position.y, z: position.z }),
					{ heading },
					{
						fuel: vehicleData.carTank,
						modifications: {
							...getDefaultVehicleModifications(vehicleData.model)
						}
					}
				);
			}

			// We create the actor..
			const actor = mp.actors.create({
				identifier: `pedestrians:${i}`,
				attributes: {
					model: actorModel,
					position,
					heading,
					invincible: false,
					frozen: false
				},
				info: {
					vehicleId: vehicle ? vehicle.id : undefined,
					role: entry.driver ? 'driver' : 'wanderer',
					name: {
						EN: `Pedestrian`,
						RO: `Cetatean`
					}
				},
				variables: {}
			});

			pedestrians.push(actor);
		});

		console.info(`${green('[DONE]')} Spawned ${pedestrians.length} pedestrians.`);
	} catch (err) {
		await logError(`LOAD_PEDESTRIANS`, err);
		process.exit(1);
	}
};
