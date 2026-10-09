import { logClientsideError } from '../errors';

// Types
import { SpeedometerData } from './components/types';

// Dependencies
import { getData, setVisible, speedometerVisible, updateInterfaceData } from './components/functions';

const updateSpeedometer = async () => {
	try {
		const data: SpeedometerData | null = await getData();

		// If there is no data to be showed.
		if (data === null) {
			// If it was visible hide the speedometer..
			if (speedometerVisible === true) setVisible(false);

			return false;
		}

		// Show speedometer if needed..
		if (data !== null && speedometerVisible === false) {
			setVisible(true);
		}

		// Update data..
		updateInterfaceData(data);

		return true;
	} catch (err) {
		await logClientsideError(`hud.updateSpeedometer`, err);
		return false;
	}
};

setInterval(updateSpeedometer, 50); // 50ms
