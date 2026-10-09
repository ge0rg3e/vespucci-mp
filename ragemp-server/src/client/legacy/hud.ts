import * as rpc from 'rage-rpc';
import { getPlayerVariable } from '@client/utils/helpers';
import { getHungerPoints, getThirstPoints } from '@client/general/thirstHunger/components/functions';
const player = mp.players.local;

rpc.register(
	`getNumberOfPlayers`,
	() =>
		mp.players.toArray().filter((entry) => {
			const loggedIn = getPlayerVariable(entry.remoteId, `loggedIn`);
			if (!loggedIn) return false;
			return true;
		}).length
);

rpc.register('getAccountId', async () => {
	const variable = getPlayerVariable(mp.players.local.remoteId, `accountId`);
	return variable;
});

rpc.register(`hud:player.getData`, () => {
	// Get player variables
	const hungerPoints = getHungerPoints();
	const thirstPoints = getThirstPoints();
	const currentAlcoholLevel = getPlayerVariable(player.remoteId, `bloodAlcoholLevel`);

	return {
		health: player.getHealth(),
		armour: player.getArmour(),
		wantedLevel: 0,
		buffs: {
			// @reminders: We store only how % hungry we are. but the interface needs to know the 80% of how full they are.
			hunger: parseInt((100 - hungerPoints).toFixed(0)),
			thirst: parseInt((100 - thirstPoints).toFixed(0)),
			alcohol: parseInt(currentAlcoholLevel),
			drugs: 0
		}
	};
});

rpc.register(`getPlayerStreetAndZoneName`, () => getStreetAndZoneName(player.position));

rpc.register(`getCoordsStreetAndZoneName`, (args) => {
	const { position } = JSON.parse(args);
	return getStreetAndZoneName(position);
});

export let isDriver = false;

mp.events.add('patched:playerEnterVehicle', (_, seat) => {
	isDriver = seat === -1 ? true : false;
});

mp.events.add('patched:playerLeaveVehicle', () => {
	isDriver = false;
});

mp.events.add('setDarkEnvironment', (boolean) => {
	rpc.triggerBrowsers('onSetDarkEnvironment', JSON.stringify({ boolean }));
});

const getStreetAndZoneName = (position: Vector3) => {
	const playerZone = mp.game.gxt.get(mp.game.zone.getNameOfZone(position.x, position.y, position.z));
	const streetObject = mp.game.pathfind.getStreetNameAtCoord(position.x, position.y, position.z);
	let playerStreet = '';

	if (!streetObject) playerStreet = 'Area';
	else playerStreet = mp.game.ui.getStreetNameFromHashKey(streetObject.streetName);

	return { zone: playerZone, street: playerStreet };
};
