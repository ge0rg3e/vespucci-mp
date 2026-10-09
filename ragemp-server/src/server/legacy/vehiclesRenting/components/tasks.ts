import { logError } from '@server/utils/helpers';
import moment from 'moment';
import { rentingVehicles, stopVehicleRenting, updateRentingVehicle } from './core';

// Variables
export const MAX_MINUTES_OUTSIDE_VEHICLE = 3;

const chargeRentingVehicles = async () => {
	try {
		if (rentingVehicles.length < 1) return false;

		rentingVehicles.forEach((rent) => {
			// Making sure one minute of free renting has passed since he already paid for it just in case this interval is called right after the use of item.
			const diff = moment(new Date()).diff(new Date(rent.startedAt), 'minutes');
			if (diff < 1) return;
			if (!rent.entityId) return; // sanity check

			// Getting the client
			const player = mp.players.toArrayLoggedInFind((p: PlayerMp) => p.vars.rentingVehicleId === rent.id);

			// Sanity check..
			if (!player) return;

			// Getting the vehicle entity
			const entity = mp.vehicles.at(rent.entityId);
			if (!entity) return;

			// Checking that the player is inside the vehicle or not..
			if (player.vehicle !== entity && rent.minutesOutside < MAX_MINUTES_OUTSIDE_VEHICLE) {
				updateRentingVehicle(rent.id, {
					minutesOutside: rent.minutesOutside + 1
				});

				rent.minutesOutside = rent.minutesOutside + 1;
			}

			// If he was already more tha none minute outside we need to stop the rent and destroy his vehicle.
			if (rent.minutesOutside >= MAX_MINUTES_OUTSIDE_VEHICLE) {
				return stopVehicleRenting(rent.id, 'OutsideTooMuch');
			}

			// Reset the clock once he gets in vehicle
			if (player.vehicle === entity && rent.minutesOutside > 0) {
				updateRentingVehicle(rent.id, {
					minutesOutside: 0
				});
			}

			// If he doens't have the money anymore..
			if (player.info.money < rent.costPerMinute) return stopVehicleRenting(rent.id, 'OutOfMoney');

			// Otherwise let's just give it his money..
			player.takeMoney(rent.costPerMinute);

			return true;
		});
	} catch (err) {
		await logError(`TASK_CHARGE_RENTING_VEHICLES`, err);
	}
	return true;
};

setInterval(chargeRentingVehicles, 1 * 60 * 1000); // every minute check.
