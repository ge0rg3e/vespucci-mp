import { logClientsideError } from '@client/general/errors';
import * as rpc from 'rage-rpc';

let disableVehicles = false;
let transparentVehicles = false;
const alreadyDisabled: Record<string, ExpectedAny> = {};

const player = mp.players.local;

// Known bug which is why I've not allowed no collision between players and empty vehicle:
// As of now if a vehicle is empty we have collision because
// Sometimes if a vehicle is eempty and collision is false, sometimes (30%) some drivers may have 'rocket league' collision like

/*

BrainDed — Today at 15:05
Do you set collision for all players?
it might be that the other player is vehicle controller, so if you slam into vehicle for them on their screen, it will move the vehicle for you
because they are in control of the vehicle sync
Vatto — Today at 15:23
Those vehicles were empty though hmm
Vatto — Today at 15:23
Yeah I do have another script doing that
BrainDed — Today at 15:27
Yeah, empty vehicles have a controller as well
its assigned randomly to a player in stream range
*/

const disableVehiclesCollisions = () => {
	try {
		if (disableVehicles === false) return false;
		mp.vehicles.forEachInStreamRange((entity: VehicleMp) => {
			if (!entity.handle) return;
			if (!mp.game.entity.isAnEntity(entity.handle)) return;
			if (entity.remoteId === 65535) return; // is client-side only.

			let result = false;

			const occupant = entity.getPedInSeat(-1);

			const typeOfCollision = player.vehicle ? 'withVehicle' : 'onFoot';

			if (alreadyDisabled[entity.remoteId] && occupant) {
				alreadyDisabled[entity.remoteId] = undefined;
			}

			// REMINDER: A fost dezactivat tot ce tine de setAlpha, din cauza ca la dmv (care e in safezone) se vedea prin masina cand te apropiai de un checkpoint.
			// if (!occupant && alreadyDisabled[entity.remoteId] === typeOfCollision && entity.alpha !== 255) {
			// 	entity.setAlpha(255);
			// 	return;
			// }

			if (!occupant) {
				alreadyDisabled[entity.remoteId] = typeOfCollision;
				result = true;
			}

			// if (transparentVehicles === true && !alreadyDisabled[entity.remoteId] && !(player.vehicle && player.vehicle === entity)) {
			// 	entity.setAlpha(200);
			// }

			entity.setNoCollision(player.handle, result);
			player.setNoCollision(entity.handle, result);

			if (player.vehicle) {
				entity.setNoCollision(player.vehicle.handle, result);
				player.vehicle.setNoCollision(entity.handle, result);
			}
		});
		return true;
	} catch (err) {
		logClientsideError(`disableVehiclesCollisions`, err);
		return false;
	}
};

rpc.on(`disableVehiclesCollisions`, (args) => {
	const { bool, transparent = false } = JSON.parse(args);
	disableVehicles = bool;
	transparentVehicles = transparent;
});

rpc.on(`resetVehiclesCollisions`, () => {
	try {
		mp.vehicles.forEach(async (entity: VehicleMp) => {
			if (!entity.handle) return;
			if (!mp.game.entity.isAnEntity(entity.handle)) return;
			if (entity.remoteId === 65535) return; // is client-side only.

			entity.setNoCollision(player.handle, true);
			player.setNoCollision(entity.handle, true);
			// entity.setAlpha(255);
			if (player.vehicle) {
				entity.setNoCollision(player.vehicle.handle, true);
				player.vehicle.setNoCollision(entity.handle, true);
			}
		});
	} catch (err) {
		logClientsideError(`resetVehiclesCollisions`, err);
	}
});

// Timers required

setInterval(() => {
	disableVehiclesCollisions();
}, 1000);
