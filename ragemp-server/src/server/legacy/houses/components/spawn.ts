import dimensions from '@server/definitions/dimensions';
import { HouseInterior, houseInteriors } from '@server/definitions/houseInteriors';
import { Houses } from './core';

mp.events.add('onPlayerSpawn', async function onPlayerSpawn(this: ExpectedAny, player) {
	if (player.vars.freshlyWounded === true) return; // This player should be spawned at hospital.

	player.vars.houseEntered = null;

	if (player.info.house || player.info.houseRent) {
		//Spawning
		const hIdentifier = player.info.house ? player.info.house : player.info.houseRent;
		const House = Houses.find((h) => h.id === hIdentifier);
		if (!House) {
			player.createAmplitudeEvent(`Having Difficulties`, { reason: `His house or rent has been deleted from the database.` });
			player.saveInfo({
				house: 0,
				houseRent: 0,
				spawnMethod: 'normal'
			});
			player.updateVars({
				houseEntered: null
			});

			mp.events.call('onPlayerSpawn', player); // Respawning the player.
			return;
		}

		if (player.info.spawnMethod !== 'house') return false;
		const hInterior: HouseInterior = houseInteriors.find((int) => int.id === House.interiorId)!;
		const coords = hInterior.coords;
		player.spawn(new mp.Vector3(coords.x, coords.y, coords.z));
		player.model = mp.joaat(player.info.clothes.model);
		player.updateClothes(player.info.clothes);
		if (hInterior.ipls) {
			player.triggerClientEvent('loadIpls', { ipls: hInterior.ipls });
		}

		//Update
		player.updateVars({
			houseEntered: House.id
		});

		//Setters
		player.dimension = House.id + dimensions.houses;
		player.health = 100;
		player.armour = 0;

		//Additionals
		player.createAmplitudeEvent('Spawned', { spawnType: player.info.house ? 'house' : 'rent', houseId: House.id });
		this.cancel = true;

		player.call('setDarkEnvironment', [true]);
	}
	return;
});
