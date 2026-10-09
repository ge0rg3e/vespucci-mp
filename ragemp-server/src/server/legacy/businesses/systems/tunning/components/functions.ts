// functie sa seteze tunning gen updateTunning

import { getVehicleNativeInfo } from '@server/natives/vehicles/components/core';
import { logError } from '@server/utils/helpers';
import { getLanguagePack } from '@vmp/i18n';
import moment from 'moment';

// import { logError } from '@server/utils/helpers';
// import { vehicleModsIds } from './maps';

// Cand testeaza culorile voi folosi client-side sa nu spamez sv.
// Cand le cumpara le voi seta in server.
// Cand testeaza modurile? ..

export function getRandomRgb() {
	const num = Math.round(0xffffff * Math.random());
	const r = num >> 16;
	const g = (num >> 8) & 255;
	const b = num & 255;
	return [r, g, b];
}

export const getDefaultVehicleModifications = (model: string): VehicleModifications => {
	const nativeInfo = getVehicleNativeInfo({ model });

	if (!nativeInfo) {
		logError(`UNKNOWN_VEH_NATIVE_INFO`, {}, { model });
		return { colors: { type: 'rgb', values: [0, 0] }, mods: {} }; // default in case.
	}

	const rgb = getRandomRgb();
	const isMoto = nativeInfo.class === 'motorcycle' ? true : false;

	const value: VehicleModifications = {
		colors: {
			type: 'rgb',
			values: [rgb, rgb]
		},
		mods: {}
	};

	if (isMoto) {
		value.wheelType = 6;
	}

	return value;
};
