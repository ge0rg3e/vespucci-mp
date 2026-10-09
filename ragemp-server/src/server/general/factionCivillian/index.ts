import { GroupObject } from '@server/legacy/groups/components/types';
import { getLanguagePack, createLanguagePack } from '@vmp/i18n';

createLanguagePack('HospitalMessage', {
	Message: {
		EN: 'You have been respawned at the hospital.',
		RO: 'Ai fost respawnat la spital.'
	}
});

export const GameSpawns = {
	Default: {
		x: -1340.872,
		y: -1077.713,
		z: 6.938,
		heading: -134.627
	},
	Hospital: {
		x: 360.298,
		y: -585.211,
		z: 28.822,
		heading: -114.23
	}
};

mp.events.add('onPlayerSpawn', function onPlayerSpawn(this: ExpectedAny, player) {
	if (player.vars.freshlyWounded !== true) return false;

	const lang = getLanguagePack('HospitalMessage', player.info.language);

	// Spawning
	const coords = GameSpawns['Hospital'];
	player.spawn(new mp.Vector3(coords.x, coords.y, coords.z));
	player.model = mp.joaat(player.info.clothes.model);
	player.updateClothes(player.info.clothes);

	player.sendServerMessage('Server', 'system', lang.get('Message'), 'system');
	player.updateVars({ freshlyWounded: false });

	// Setters
	player.dimension = 0;
	player.health = 100;
	player.armour = 0;
	player.setHungerPoints(0);
	player.setThirstPoints(0);
	player.setAlcoholLevel(0);
	player.heading = coords.heading;

	// Additionals
	player.createAmplitudeEvent('Spawned', { spawnType: 'hospital', wounded: true });

	this.cancel = true;
	return;
});

mp.events.add('onPlayerSpawn', function onPlayerSpawn(this: ExpectedAny, player) {
	if (player.vars.freshlyWounded === true) return; // This player should be spawned at hospital.

	const isInFaction = player.getGroups().find((g: GroupObject) => g.id.includes(`faction`));

	if ((!isInFaction && player.info.spawnMethod === 'normal') || (!player.info.house && player.info.spawnMethod === 'house')) {
		// Spawning
		const coords = GameSpawns['Default'];
		player.spawn(new mp.Vector3(coords.x, coords.y, coords.z));
		player.model = mp.joaat(player.info.clothes.model);
		player.updateClothes(player.info.clothes);

		// Setters
		player.dimension = 0;
		player.health = 100;
		player.armour = 0;
		player.heading = coords.heading;

		// Additionals
		player.createAmplitudeEvent('Spawned', { spawnType: 'normal' });

		// @Bugfix..
		if (!player.info.house && player.info.spawnMethod === 'house') {
			player.info.spawnMethod = 'normal';
			player.saveInfo({
				spawnMethod: 'normal'
			});
		}
		this.cancel = true;
	}
});

mp.events.add('loadPlayerDefaults', (player) => {
	player.updateVars({
		freshlyWounded: false
	});
});
