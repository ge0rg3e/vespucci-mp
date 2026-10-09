import { getLanguagePack } from '@vmp/i18n';
import { getPumpObjectModel } from '../../petrolCan/components/functions';
import { getLanguage } from '@client/natives/browser';
import { formatNumber } from '@client/helpers';
import { getRaycastLookingAtEntity } from '@client/natives/raycast';
import { logClientsideError } from '@client/general/errors';
import { getPlayerVariable } from '@client/utils/helpers';

// Variables
const player = mp.players.local;

export const getPumpText = (payload: ExpectedAny) => {
	// Get player variable
	const gPump = getPlayerVariable(player.remoteId, `gasStationPump`);
	if (!gPump) return '';

	// Get the language pack
	const lang = getLanguagePack(`gasStationPump:Text3D`, getLanguage());

	// Format header
	let header = `~o~${lang.get('pumpHeading', { number: payload.pumpId })}`;

	// Format the price text
	let price = `~w~${lang.get('priceText')} ~g~${formatNumber(payload.costPerLitre, true)}`;

	// If the player is filling his vehicle with this pump.
	if (gPump.gasStationId && gPump.gasStationId === payload.gasStationId && gPump.pumpId === payload.pumpId && gPump.vehicleId) {
		price = `~w~${gPump.litres} ${lang.get('Litres')} ~g~(${formatNumber(payload.costPerLitre * gPump.litres, true)})`;
	}

	return `${header}\n${price}`;
};

export const getPumpTextPadding = (object: ObjectMp) => {
	// Calculate padding
	let textPadding = 2.045; // Default.

	// Get the pump model..
	const model = getPumpObjectModel(object);

	// We take it higher.
	if (model === 'prop_gas_pump_1d' || model === 'prop_gas_pump_1a') {
		textPadding = 1.85;
	}

	// We take it higher.
	if (model === 'prop_gas_pump_1b') {
		textPadding = 2.05;
	}

	// We take it higher.
	if (model === 'prop_vintage_pump') {
		textPadding = 2.05;
	}

	// We take it lower.
	if (model === 'prop_gas_pump_old2') {
		textPadding = 1.95;
	}

	return textPadding;
};

/**
 * This function helps us show the press F to fill vehicle.
 * @returns true if we should show the hint
 */

export const getSightOfFillableVehicle = () => {
	try {
		// Get the variables
		const gPump = getPlayerVariable(player.remoteId, `gasStationPump`);
		if (!gPump || (gPump && !gPump.gasStationId)) return false;

		// Get the vheicle you're looking at..
		const result = getRaycastLookingAtEntity({ distance: 5, flags: { vehicles: true } });

		if (!result || typeof result.entity === 'number' || result.entity.type !== 'vehicle') return false;

		// If is not a server-side vehicle
		if (result.entity.remoteId === undefined) return false;

		// Get vehicle
		const vehicle = mp.vehicles.atRemoteId(result.entity.remoteId);
		if (!vehicle) return false;

		// If you have a vehicle attached already and this is not that one.
		if (gPump.vehicleId && vehicle.remoteId !== gPump.vehicleId) return false;

		// We have clear LOS (Aka we can't see through walls)
		if (!player.hasClearLosTo(vehicle.handle, 17)) return false;

		return vehicle;
	} catch (err) {
		logClientsideError(`gasStation.render.getSightOfFillableVehicle`, err);
		return null;
	}
};
