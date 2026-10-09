// This will be used by other files.
export const GasStations: Array<GasStation> = [];

// Definitions
import { gameGasStations } from '@server/definitions/gasStations';

// Dependencies
import { logError } from '@server/utils/helpers';
import { GasStation } from './types';

export const loadGasStations = async () => {
	try {
		gameGasStations.forEach((g) => {
			// Format the entry
			let entry: GasStation = {
				id: g.id,
				businessId: g.businessId || null,
				coords: g.coords,
				// @Reminder: If we make this dynamic, we also need to update colshape payloads cause pumps have the cost per price saved thre.
				costPerLitre: 20,
				pumps: g.pumps.map((c: Array<number>, index) => ({
					id: index + 1,
					coords: { x: c[0], y: c[1], z: c[2] },
					used: false
				}))
			};

			GasStations.push(entry);
		});
	} catch (err) {
		await logError(`loadGasStations`, err);
		process.exit(1);
	}
};

/**
 * Returns the data of the pump station.
 * @param gasStationId
 * @param pumpId
 * @returns
 */

export const getPump = (gasStationId: number, pumpId: number): ExpectedAny => {
	try {
		let gasStation: GasStation | undefined = GasStations.find((c) => c.id === gasStationId);
		if (!gasStation) return null;

		let pump = gasStation.pumps.find((c) => c.id === pumpId);
		if (!pump) return null;

		return pump;
	} catch (err) {
		logError(`isPumpStationUsed`, err, { gasStationId, pumpId });
		return null;
	}
};

/**
 * A simple function used to update the pump station data.
 * @param gasStationId
 * @param pumpId
 * @param data
 * @returns
 */

export const updatePump = (gasStationId: number, pumpId: number, data: ExpectedAny): ExpectedAny => {
	try {
		let gsIndex = GasStations.findIndex((c) => c.id === gasStationId);
		if (gsIndex === -1) throw new Error(`Failed to find gas station data.`);

		let pIndex = GasStations[gsIndex].pumps.findIndex((c) => c.id === pumpId);
		if (pIndex === -1) throw new Error(`Failed to find pump data.`);

		// Update data..
		GasStations[gsIndex].pumps[pIndex] = {
			...GasStations[gsIndex].pumps[pIndex],
			...data
		};
	} catch (err) {
		logError(`updatePump`, err, { gasStationId, pumpId, data });
		return null;
	}
};
