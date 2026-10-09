import { getLanguagePack } from '@vmp/i18n';
import { GasStations } from './functions';

export const GAS_STATION_PUMP_RANGE = 4;

mp.events.add(`loadPlayerDefaults`, (player) => {
	// Get the language pack
	const lang = getLanguagePack(`gasStation:BusinessBlip`, player.lang);

	// When the player enters in-game we'll create the gas station blips for him.
	GasStations.forEach((g) => {
		// Create blip on their map..
		player.createBlip({
			// General
			identifier: `GasStation:${g.id}`,
			label: lang.get(`blipLabel`),
			// Location
			position: new mp.Vector3(g.coords),
			// Appearance
			type: 361,
			color: 21
		});

		player.createColshape({
			identifier: `GasStation:${g.id}`,
			position: new mp.Vector3(g.coords),
			range: 20,
			dimension: 0,
			type: 'circle',
			payload: {
				gasStationId: g.id
			}
		});

		// Create the pump colshapes.
		g.pumps.forEach((pump) => {
			player.createColshape({
				identifier: `GasStationPump:${g.id}_pump:${pump.id}`,
				position: new mp.Vector3(pump.coords),
				range: GAS_STATION_PUMP_RANGE,
				dimension: 0,
				type: 'sphere',
				payload: {
					gasStationId: g.id,
					pumpId: pump.id,
					// Will be displayed on the hint above the pumps.
					costPerLitre: g.costPerLitre
				}
			});
		});
	});
});
