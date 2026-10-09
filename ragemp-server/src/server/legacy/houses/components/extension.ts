import { HouseInterior, houseInteriors } from '@server/definitions/houseInteriors';
import dimensions from '@server/definitions/dimensions';
import { logError } from '@server/utils/helpers';
import { Houses } from './core';
import { playRangedAudio } from '@server/natives/audio';

mp.Player.prototype.enterHouse = function (houseId) {
	if (this.vars.houseEntered) return false;
	const closeHouse = Houses.find((h) => h.id === houseId);
	if (!closeHouse) return false;
	const hInterior: HouseInterior = houseInteriors.find((int) => int.id === closeHouse.interiorId)!;
	if (!hInterior) {
		logError('FIND_H_INTERIOR', {}, { houseId: closeHouse.id });
		return false;
	}

	if (this.info.house === closeHouse.id || this.getAdminLevel() > 0 || this.info.houseRent === closeHouse.id) {
		// Play a sound effect of a door when they enter the house..
		playRangedAudio({
			sourcePath: `${`__ASSETS__`}/audios/systems/houses/door.mp3`,
			options: {
				volume: 0.8
			},
			position: this.position,
			isSoundEffect: true,
			range: 5
		});

		// Teleport..
		this.dimension = closeHouse.id + dimensions.houses;
		this.position = new mp.Vector3(hInterior.coords.x, hInterior.coords.y, hInterior.coords.z);
		this.heading = hInterior.heading;
		this.updateVars({
			houseEntered: closeHouse.id
		});
		if (hInterior.ipls) {
			this.triggerClientEvent('loadIpls', { ipls: hInterior.ipls });
		}

		this.call('setDarkEnvironment', [true]);
	}

	return true;
};

mp.Player.prototype.exitHouse = function () {
	if (!this.vars.houseEntered) return false;
	const House = Houses.find((h) => h.id === this.vars.houseEntered);
	if (!House) return false;
	const hInterior: HouseInterior = houseInteriors.find((int) => int.id === House.interiorId)!;
	if (!hInterior) {
		logError('FIND_H_INTERIOR', {}, { houseId: House.id });
		return false;
	}

	// Play a sound effect when they leave the house..
	playRangedAudio({
		sourcePath: `${`__ASSETS__`}/audios/systems/houses/door.mp3`,
		options: {
			volume: 0.8
		},
		position: this.position,
		isSoundEffect: true,
		range: 5
	});

	this.position = new mp.Vector3(House.coords.x, House.coords.y, House.coords.z);
	this.dimension = 0;

	if (hInterior.ipls) {
		this.triggerClientEvent('removeIpls', { ipls: hInterior.ipls });
	}

	this.updateVars({
		houseEntered: null
	});

	this.call('setDarkEnvironment', [false]);

	return true;
};

declare global {
	interface PlayerMp {
		exitHouse(): boolean;
		enterHouse(houseId: number): boolean;
	}
}

export {};
