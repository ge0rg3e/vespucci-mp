// Components
import { createPedestrians } from './components/core';
import './components/events';

// Dependencies
import { fakeAwait } from '@server/utils/helpers';

// When the gamemode starts and we load the vehicle native info from database we'll also create the pedestrians.

mp.events.add('onVehiclesNativesLoaded', async () => {
	// We need to wait a few seconds until the vehicle native info is loaded otherwise create vehicle won't work.
	await fakeAwait(5000);

	// We now create the pedestirans
	// Disabled sa nu mai cream pedestrians.
	// createPedestrians();
});
