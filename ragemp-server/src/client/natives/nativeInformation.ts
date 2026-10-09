import * as rpc from 'rage-rpc';

// Variables
const caches: Record<string, ExpectedAny> = {};
const weaponCaches: Record<string, ExpectedAny> = {};

const REFRESH_VEHICLE_NATIVE_INFO_SECONDS = 1000;
const REFRESH_WEAPON_NATIVE_INFO_SECONDS = 1000;

/**
 *
 * @param model The model of the vehicle
 * @returns Null if not found or the model native info.
 */

export const getVehicleNativeInfo = async (model: string): Promise<ExpectedAny> => {
	// If there is a cache for this model we'll use it.
	if (caches[model]) return caches[model];

	// If the model is not passed we have nothing to return.
	if (model === undefined) return null;

	// Call the server to get the native info for this model.
	const res = await rpc.callServer(`vehicles:getModelNativeInfo`, JSON.stringify({ model }));

	// Nothing found.
	if (!res) return null;

	// Cache it for others to use..
	caches[model] = { ...res, _expiresIn: REFRESH_VEHICLE_NATIVE_INFO_SECONDS };

	return res;
};

/**
 *
 * @param model The model of the vehicle
 * @returns Null if not found or the model native info.
 */

export const getWeaponNativeInfo = async (id: number): Promise<ExpectedAny> => {
	// If there is a cache for this model we'll use it.
	if (weaponCaches[id]) return weaponCaches[id];

	// If the model is not passed we have nothing to return.
	if (id === undefined) return null;

	// Call the server to get the native info for this model.
	const res = await rpc.callServer(`weapons@getModelNativeInfo`, JSON.stringify({ id }));

	// Nothing found.
	if (!res) return null;

	// Cache it for others to use..
	weaponCaches[id] = { ...res, _expiresIn: REFRESH_WEAPON_NATIVE_INFO_SECONDS };

	return res;
};

setInterval(() => {
	// Deleting expires vehicle nativ eInfo.
	Object.keys(caches).forEach((model) => {
		caches[model]._expiresIn--;

		if (caches[model]._expiresIn < 1) {
			delete caches[model];
		}
	});

	// Deleting expires vehicle nativ eInfo.
	Object.keys(weaponCaches).forEach((id) => {
		weaponCaches[id]._expiresIn--;

		if (weaponCaches[id]._expiresIn < 1) {
			delete weaponCaches[id];
		}
	});
}, 1000);
