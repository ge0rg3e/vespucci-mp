import dimensions from '@server/definitions/dimensions';
import { GarageInteriors } from '@server/definitions/garageInteriors';
import { Houses } from '@server/legacy/houses/components/core';
import { getLanguagePack } from '@vmp/i18n';
import { Garages } from './core';
import { loadGarageInteriorProps, syncGarageVehiclePositions, unloadGarageInteriorProps } from './functions';
import { playRangedAudio } from '@server/natives/audio';

mp.Player.prototype.showGarageEntranceDialog = function (garageId, noCooldown = false) {
	const garage = Garages.find((garage) => garage.id === garageId);
	if (!garage) return false; // Failed to find the garage.
	const lang = getLanguagePack(`Garages:Entrance`, this.info.language);

	let dialogFooter: UndefinedAny = null;

	if (this.getAdminLevel() !== 0) {
		dialogFooter = lang.get('DialogFooter', { type: garage.type, garageId: garage.id, ownerId: garage.ownerId });
	}

	const isDriver = this.vehicle && this.vehicle.getOccupant(0) === this ? true : false;

	const buttons: Array<DialogButton> = [
		{
			text: lang.get('DialogKeyCancelText'),
			key: `ESC`
		}
	];

	if (!isDriver) {
		buttons.splice(0, 0, {
			key: `F`,
			text: lang.get('DialogKeyEnterText')
		});
	} else {
		buttons.splice(0, 1, {
			key: 'G',
			text: lang.get('DialogKeyPutText')
		});
	}

	// We need to be able to dismiss it

	this.showPlayerDialog({
		dialogId: `garageEntranceDialog`,
		icon: 'information',
		hideInSeconds: null,
		appearInSeconds: noCooldown ? null : 1,
		type: 'message',
		buttons: buttons,
		title: lang.get('DialogTitle'),
		content: lang.get('DialogContent', { inVehicle: isDriver }),
		payload: {
			garageId: garage.id
		},
		footer: dialogFooter
	});

	return;
};

mp.Player.prototype.showGarageEntranceAccessDenied = function (messageId) {
	const lang = getLanguagePack(`Garages:EntranceAccessDenied`, this.info.language);
	this.showPlayerDialog({
		dialogId: `garageAccessDenied`,
		icon: 'information',
		hideInSeconds: 6,
		appearInSeconds: 1,
		type: 'message',
		title: lang.get('DialogTitle', { messageId }),
		content: lang.get('DialogContent', { messageId })
	});
};

mp.Player.prototype.showGarageExitDialog = function (garageId) {
	const garage = Garages.find((garage) => garage.id === garageId);
	if (!garage) return false; // Failed to find the garage.
	const lang = getLanguagePack(`Garages:Exit`, this.info.language);

	const buttons: ExpectedAny = [];

	if (!this.vehicle) {
		buttons.push({
			key: `F`,
			text: lang.get('DialogKeyExitText')
		});

		buttons.push({
			key: `G`,
			text: lang.get('DialogKeyEnterHouse')
		});
	}

	this.showPlayerDialog({
		dialogId: `garageExitDialog`,
		icon: 'information',
		hideInSeconds: null,
		appearInSeconds: 1,
		type: 'message',
		buttons: buttons,
		title: lang.get('DialogTitle'),
		content: lang.get(this.vehicle ? 'DialogContentCannotLeaveOnVehicle' : 'DialogContent'),
		payload: {
			garageId: garage.id
		}
	});

	return;
};

mp.Player.prototype.showGarageParkedDialog = function (vehicleModel) {
	const lang = getLanguagePack(`Garages:ParkingInstructions`, this.info.language);

	this.showPlayerDialog({
		dialogId: `garageEnteredInstructions`,
		icon: 'information',
		hideInSeconds: 4,
		appearInSeconds: 1,
		type: 'message',
		title: lang.get('DialogTitle'),
		content: lang.get('DialogContent', { vehicleModel })
	});

	return true;
};

mp.Player.prototype.showGarageVehicleDialog = function (vehicle, entity, garageId) {
	const lang = getLanguagePack(`Garages:Vehicle`, this.info.language);

	const buttons = [
		{
			key: `G`,
			text: lang.get('DialogKeyTakeOutText')
		}
	];

	this.showPlayerDialog({
		dialogId: `garageVehicle`,
		icon: 'information',
		hideInSeconds: null,
		appearInSeconds: null,
		type: 'message',
		buttons: buttons,
		title: lang.get('DialogTitle'),
		content: lang.get('DialogContent'),
		payload: {
			vehicleId: vehicle.id,
			entityId: entity.id,
			garageId
		}
	});
};

mp.Player.prototype.enterGarage = async function (garageId, from) {
	// Getting the garage
	const garage = Garages.find((g: Garage) => g.id === garageId);
	if (!garage) return false;

	// Getting the garage interior
	const garageInterior = GarageInteriors.find((int) => int.id === garage.interiorId);
	if (!garageInterior) return false;

	// Loading the props...
	loadGarageInteriorProps(this, garage, garageInterior);

	// When entering the garage we play a sound.
	playRangedAudio({
		sourcePath: `${`__ASSETS__`}/audios/systems/${from === 'house' ? 'houses/door.mp3' : 'garages/door.mp3'}`,
		options: {
			volume: 0.8
		},
		position: this.position,
		isSoundEffect: true,
		range: 8
	});

	// Teleporting now..
	this.dimension = garage.id + dimensions.garages;
	this.position = garageInterior.coords.player.coords;
	this.heading = garageInterior.coords.player.heading;
	this.updateVars({ garageEntered: garage.id });

	// Mark the player as unable able to do damage while in garage
	this.triggerClientEvent(`setUnableToDoDamage`, { bool: true });

	// Syncing vehicle positions again to fix bugs..
	syncGarageVehiclePositions(garage, garageInterior);

	return true;
};

mp.Player.prototype.exitGarage = function (garageId, to) {
	// Getting the garage
	const garage = Garages.find((g: Garage) => g.id === garageId);
	if (!garage) return false;

	// Getting the garage interior
	const garageInterior = GarageInteriors.find((int) => int.id === garage.interiorId);
	if (!garageInterior) return false;

	// Play a sound effect when they exit the garage and go to house or garage exit.
	if (to !== null) {
		playRangedAudio({
			sourcePath: `${`__ASSETS__`}/audios/systems/${to === 'house' ? 'houses/door.mp3' : 'garages/door.mp3'}`,
			options: {
				volume: 0.8
			},
			position: this.position,
			isSoundEffect: true,
			range: 8
		});
	}

	// Unloading the props
	unloadGarageInteriorProps(this, garage, garageInterior);

	// Teleporting outside now...
	this.position = garage.coords;
	this.dimension = 0;
	this.updateVars({ garageEntered: null });

	// Mark the player as able to do damage again
	this.triggerClientEvent(`setUnableToDoDamage`, { bool: false });

	return true;
};

mp.Player.prototype.checkCanUseHouseGarage = function (houseId) {
	let canUseGarage = false;

	const house = Houses.find((h) => h.id === houseId);
	if (!house) return false;

	const garage = Garages.find((g) => g.type === 1 && g.ownerId === house.id);
	if (!garage) return false;

	if (this.getAdminLevel() !== 0) {
		canUseGarage = true;
	}
	// If the garage is a house-linked type and he is the owner the house
	if (garage.type === 1 && this.info.house === garage.ownerId) {
		canUseGarage = true;
	}

	// If the garage is a house-linked type and he is a invited tenant.
	if (garage.type === 1 && this.info.houseRent === garage.ownerId && house.tenants && house.tenants.find((t) => t.name === this.info.username && t.meta.canUseGarage === true)) {
		canUseGarage = true;
	}

	return canUseGarage;
};

declare global {
	interface PlayerMp {
		showGarageEntranceDialog(garageId: number, noCooldown: boolean): void;
		showGarageExitDialog(garageId: number): void;
		showGarageParkedDialog(vehicleModel: string): void;
		showGarageVehicleDialog(vehicle: PersonalVehicle, entity: VehicleMp, garageId: number): void;
		showGarageEntranceAccessDenied(messageIndex: number): void;
		enterGarage(garageId: number, from: 'house' | 'outside'): void;
		exitGarage(garageId: number, to: 'house' | 'outside' | null): void;
		checkCanUseHouseGarage(houseId: number): boolean;
	}
}

export {};
