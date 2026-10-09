import { getLanguage } from '@client/natives/browser';
import { interfacesOpened, loggedIn } from '@client/natives/interfaces';
import { getRaycastLookingAtEntity } from '@client/natives/raycast';
import { createLanguagePack, getLanguagePack } from '@vmp/i18n';
import { hideInteractionButton, showInteractionButton } from '../interactionButton';
import { getPlayerVariable, getVehicleVariable } from '@client/utils/helpers';
import { logClientsideError } from '../errors';

// Variables
const player = mp.players.local;
let interactionVisible = false;
let lastVehicleLockStatus: ExpectedAny = null;

let lang: ExpectedAny = null;

mp.events.add('playerReady', () => {
	// Get language
	lang = getLanguagePack(`csVehiclesLockHint`, getLanguage());
});

const getVehicleInSight = () => {
	// If is not looking or doing other things..
	if (player.getVehicleIsTryingToEnter() || player.isRunning() || player.isSprinting() || player.isFalling()) return false;

	// Has interfaces opened
	if (interfacesOpened.length > 0) return false;

	// Is inside vehicle
	if (player.vehicle) return false;

	// Get vehicle we look at..
	const result = getRaycastLookingAtEntity({ distance: 5, flags: { vehicles: true } });

	// Not a vehicle
	if (!result || typeof result.entity === 'number' || result.entity.type !== 'vehicle') return false;

	// Get vehicle..
	const veh = mp.vehicles.at(result.entity.id);

	// Failed to find it.
	if (!veh) return false;

	// Get vehicle variables
	const pVehicle = getVehicleVariable(veh.remoteId, 'pVehicle');
	const pVehicleOwnerId = getVehicleVariable(veh.remoteId, 'pVehicleOwnerId');

	// Failed to find them or is not a personal vehicle.
	if (!pVehicle) return false;

	// Get his player variables
	const petrolCan = getPlayerVariable(player.remoteId, `petrolCan`);
	const gasStationPump = getPlayerVariable(player.remoteId, `gasStationPump`);
	const accountId = getPlayerVariable(player.remoteId, `accountId`);
	const garageEntered = getPlayerVariable(player.remoteId, `garageEntered`);

	// If we're holding the petrol can..
	if (petrolCan.status && petrolCan.litres > 0) return false;

	// If we're holding the gas pump
	if (gasStationPump && gasStationPump.gasStationId) return false;

	// Is not the owner of the vehicle..
	if (accountId !== pVehicleOwnerId) return false;

	// He is inside a garage..
	if (garageEntered !== null) return false;

	return {
		entity: veh,
		vars: {
			locked: getVehicleVariable(veh.remoteId, 'locked')
		}
	};
};

mp.events.add('render', () => {
	// Is not logged in yet.
	if (loggedIn === false) return;

	try {
		// Check if we're looking at a vehicle in sight..
		const vehicleInSight = getVehicleInSight();

		// Check what changed
		const lockStatusChanged = vehicleInSight ? (lastVehicleLockStatus !== vehicleInSight.vars.locked ? true : false) : false;

		// Update them now..
		if (vehicleInSight) {
			lastVehicleLockStatus = vehicleInSight.vars.locked;
		}

		// We do..
		if ((vehicleInSight && !interactionVisible) || (vehicleInSight && lockStatusChanged)) {
			// Show interaction
			showInteractionButton({ identifier: 'lockVehicleInteraction', label: lang.get('InteractionHint', { state: vehicleInSight.vars.locked }), button: 'L' });

			// Marking it..
			interactionVisible = true;

			return;
		}

		// We don't.
		if (!vehicleInSight && interactionVisible === true) {
			// Hiding it..
			hideInteractionButton();

			// Marking it
			interactionVisible = false;
			return;
		}
	} catch (err) {
		logClientsideError(`gameplay.raycastLockHint`, err);
	}
});

createLanguagePack('csVehiclesLockHint', {
	InteractionHint: {
		EN: ({ state }) => `${state ? `Unlock` : `Lock`} this vehicle`,
		RO: ({ state }) => `${state ? `Deblochează` : `Blochează`} acest vehicul`
	}
});
