import { vehicleModsIds } from '../../utils/maps';

export const setVehicleModifications = (entity: VehicleMp, data: ExpectedAny) => {
	try {
		if (!mp.vehicles.exists(entity)) return;

		const vehicle = mp.vehicles.atRemoteId(entity.remoteId);
		if (!vehicle) return;

		// Set the vehicle color..
		const vehColors: ExpectedAny = data.colors.values;

		// @Bugfix neeed before applying normal colors (if they used to have RGB)
		vehicle.clearCustomPrimaryColour();
		vehicle.clearCustomSecondaryColour();

		if (data.colors && data.colors.type === 'normal') {
			vehicle.setColours(parseInt(vehColors[0]), parseInt(vehColors[1]));
		} else if (data.colors && data.colors.type === 'rgb') {
			vehicle.setCustomPrimaryColour(vehColors[0][0], vehColors[0][1], vehColors[0][2]);
			vehicle.setCustomSecondaryColour(vehColors[1][0], vehColors[1][1], vehColors[1][2]);
		}

		// Set Neon..
		const neonActivated = data.neon ? true : false;
		[0, 1, 2, 3].forEach((id) => vehicle.setNeonLightEnabled(id, neonActivated));

		// Set the neon color
		const neonColor = data.neon ? data.neon : [0, 0, 0];
		vehicle.setNeonLightsColour(neonColor[0], neonColor[1], neonColor[2]);

		// Set the number plate
		const defaultPlaceholderPlate = `VP ${formatDefaultPlateText(vehicle.remoteId)}`; // EX: VP 0002
		vehicle.setNumberPlateText(data.plate ? data.plate : defaultPlaceholderPlate);

		// Set the vehicle mods..
		Object.values(vehicleModsIds).forEach((id: ExpectedAny) => {
			const value = data.mods[id] !== undefined ? data.mods[id] : -1;
			if ([14, 23].includes(id)) return; // Certain ids must be set below.
			vehicle.setMod(parseInt(id), parseInt(value));
		});

		// @Bugfix: The Horn must changed last or otherwise somehow is overwritten / reset.
		vehicle.setMod(14, data.mods[14] !== undefined ? data.mods[14] : -1);

		// Set the wheels
		const isMoto = vehicle.getClass() === 8 ? true : false;
		const wheelTypes = isMoto ? 6 : data.wheelType !== undefined ? data.wheelType : -1; // Motrorcycles can have only wheel type 6.

		vehicle.setWheelType(wheelTypes);
		vehicle.setMod(23, data.mods[23] !== undefined ? data.mods[23] : -1);

		if (isMoto) {
			vehicle.setMod(24, data.mods[23] !== undefined ? data.mods[23] : -1);
		}

		// Set the xenon lights..
		vehicle.toggleMod(22, data.xenonLights !== undefined ? true : false);

		// We set it only if the xenon lights are existing..
		if (data.xenonLights !== undefined) {
			mp.game.invoke('0xE41033B25D003A07', entity.handle, data.xenonLights); // @Check fivem natives for colors.
		}

		// Set the tire smoke..
		vehicle.toggleMod(20, data.tireSmoke ? true : false); // pt disable sa dau false.
		if (data.tireSmoke) {
			const rgb = data.tireSmoke;
			mp.game.invoke('0xB5BA80F839791C0F', entity.handle, rgb[0], rgb[1], rgb[2]);
		}
	} catch (err) {
		mp.console.logError(`setVehicleModifications: ${err}`);
	}
};

export const formatDefaultPlateText = function (number: number) {
	return number.toString().padStart(5, '0');
};

export function setXenonLightsColor(entity: VehicleMp, color: number) {
	mp.game.invoke('0xE41033B25D003A07', entity.handle, color); // @Check fivem natives for colors.
	entity.toggleMod(22, true); // pt disable sa dau false.
}

export const freezeBoat = (entity: VehicleMp, status: boolean) => {
	mp.game.invoke('0xE3EBAAE484798530', entity.handle, status); // _SET_BOAT_FROZEN_WHEN_ANCHORED
	mp.game.invoke('0x75DBEC174AEEAD10', entity.handle, status); // SET_BOAT_ANCHOR
};

export const setVehicleBoost = (entity: VehicleMp, value: number) => {
	entity.setEnginePowerMultiplier(value);
	entity.setEngineTorqueMultiplier(value);
};

export const setVehicleTurbo = (entity: VehicleMp, state: boolean) => {
	entity.toggleMod(18, state);
};

export const setVehicleInteriorColor = (entity: VehicleMp, value: number) => {
	mp.game.invoke('0xF40DD601A65F7F19', entity.handle, value);
};
export const setVehicleDashboardColor = (entity: VehicleMp, value: number) => {
	mp.game.invoke('0x6089CDF6A57F326C', entity.handle, value);
};

export const setVehiclePearlescentColors = (entity: VehicleMp, color: number, wheel: number) => {
	entity.setExtraColours(color, wheel);
};

export const setVehicleTireSmokeColor = (entity: VehicleMp, rgb: [number, number, number]) => {
	entity.toggleMod(20, true); // pt disable sa dau false.
	mp.game.invoke('0xB5BA80F839791C0F', entity.handle, rgb[0], rgb[1], rgb[2]);
};
