import { getLanguagePack } from '@vmp/i18n';
import { VEHICLE_INFO, VEHICLE_SPAWN_LOCATIONS, DRIVING_CHECKPOINT_POSITIONS, DRIVING_MAX_DAMAGES } from './definitions';
import { checkPlayerLicenseCenterBlips } from '@server/legacy/licenseCenter/components/functions';
import { logError } from '@server/utils/helpers';
import { getDefaultVehicleModifications } from '@server/legacy/businesses/systems/tunning/components/functions';

/**
 * Show the driving license dialog to the player
 */
export const showGetLicenseDialog = (player: PlayerMp) => {
	try {
		// Get the language
		const lang = getLanguagePack('LicenseCenter.Driving.MainDialog', player.lang);

		// The buttons that will be shown..
		const buttons = [{ text: lang.get('DialogButton'), key: 'F' }];

		// Show it to the player..
		player.showPlayerDialog({
			dialogId: `LicenseCenter.driving.mainDialog`,
			icon: 'information',
			hideInSeconds: null,
			appearInSeconds: 1,
			type: 'message',
			buttons,
			title: lang.get('DialogTitle'),
			content: lang.get('DialogContent')
		});
	} catch (err) {
		logError('licenseCenter.driving.showGetLicenseDialog', err);
	}
};

/**
 * Check if the checkpoint index is the last checkpoint
 */
export const isDrivingTestCheckpointLast = (checkpointIndex: number) => DRIVING_CHECKPOINT_POSITIONS.length === checkpointIndex;

/**
 * Set the driving test checkpoint
 */
export const setDrivingTestCheckpoint = (player: PlayerMp, checkpointIndex: number) => {
	try {
		// Get the checkpoint position
		const checkpointPosition = DRIVING_CHECKPOINT_POSITIONS[checkpointIndex];

		// Get the checkpoint direction
		const nextCheckpointPosition = DRIVING_CHECKPOINT_POSITIONS[checkpointIndex + 1];

		// Check if the position is valid
		if (!checkpointPosition) return;

		// Get the checkpoint identifier
		const checkpointIdentifier = !isDrivingTestCheckpointLast(checkpointIndex + 1) ? `drivingTestCheckpoint@${checkpointIndex}` : 'drivingTestCheckpoint@finish';

		// Create the checkpoint
		player.createCheckpoint({
			identifier: checkpointIdentifier,
			type: 0,
			position: checkpointPosition,
			radius: 4,
			direction: nextCheckpointPosition || new mp.Vector3(0, 0, 0),
			color: [255, 0, 0, 255],
			visible: true,
			dimension: 0,
			setAsRoute: true
		});

		// Update the payload checkpoint identifier
		player.updateVars({
			licenseTest: {
				...player.vars.licenseTest,
				payload: {
					...player.vars.licenseTest.payload,
					checkpointIdentifier: checkpointIdentifier
				}
			}
		});
	} catch (err) {
		logError('licenseCenter.driving.setDrivingTestCheckpoint', err);
	}
};

/**
 * Finish the driving test
 */
export const finishDrivingTest = (player: PlayerMp) => {
	try {
		// Get the language
		const lang = getLanguagePack('LicenseCenter.Driving.Success', player.lang);

		// Send chat message
		player.sendServerMessage('License Center', 'system', lang.get(lang.get(`NotificationMessage`)), 'system');

		// Track amplitude.
		player.createAmplitudeEvent('Obtained driving license');

		// Give the player the driving license
		player.giveLicense('driving', 100);

		// Check the player's license center blips (this will ensure that the blips are removed after obtaining the license)
		checkPlayerLicenseCenterBlips(player);

		// Reset the driving test
		resetDrivingTest(player);
	} catch (err) {
		logError('licenseCenter.driving.finishDrivingTest', err);
	}
};

/**
 * Reset the driving test.
 * This will destroy the vehicle, actor and checkpoint.
 * This will also reset the player variables.
 */
export const resetDrivingTest = (player: PlayerMp) => {
	try {
		const { enabled, payload } = player.vars.licenseTest;

		// Check if the license test is enabled
		if (!enabled) return;

		// Reset the player variables (this need to be done before destroying the vehicle because the exitVehicle event will be called and it will check if the player is in a driving test)
		player.updateVars({
			licenseTest: {
				enabled: false,
				id: null,
				payload: {}
			}
		});

		// Destroy the vehicle
		payload.vehicle?.destroy?.();

		// Destroy the actor
		mp.actors.delete(`dmvInstructor@${player.id}`);

		// Destroy the checkpoint if it's a string
		if (typeof payload.checkpointIdentifier === 'string') {
			player.deleteCheckpoint(payload.checkpointIdentifier);
		}
	} catch (err) {
		logError('licenseCenter.driving.resetDrivingTest', err);
	}
};

export const getCheckpointPositionByIdentifier = (identifier: string) => {
	// Check if the identifier is the finish checkpoint
	if (identifier === 'drivingTestCheckpoint@finish') return null;

	// Get the checkpoint index
	const checkpointIndex = parseInt(identifier.split('@')[1]);

	// Get the checkpoint position
	return DRIVING_CHECKPOINT_POSITIONS[checkpointIndex] || null;
};

/**
 * Get a random vehicle spawn location
 */
export const getRandomVehicleSpawnLocation = () => VEHICLE_SPAWN_LOCATIONS[Math.floor(Math.random() * VEHICLE_SPAWN_LOCATIONS.length)];

/**
 * Fail the driving test
 */
export const failDrivingTest = (player: PlayerMp, reason: string) => {
	try {
		// Get the language
		const lang = getLanguagePack('LicenseCenter.Driving.Fail', player.lang);

		// Send chat message
		player.sendServerMessage('License Center', 'system', lang.get('NotificationMessage', { reason }), 'system');

		// Track amplitude.
		player.createAmplitudeEvent('Failed driving license test', { reason });

		// Reset the driving test
		resetDrivingTest(player);
	} catch (err) {
		logError('licenseCenter.driving.failDrivingTest', err);
	}
};

/**
 * Show the before start dialog to the player
 */
export const showBeforeTestStartDialog = (player: PlayerMp, contentIndex = 1) => {
	try {
		// Get the language
		const lang = getLanguagePack('LicenseCenter.Driving.BeforeStartDialog', player.lang);

		// Check if the content index is the last content
		const isLastContent = contentIndex === 3;

		// Show the dialog to the player
		player.showPlayerDialog({
			dialogId: 'LicenseCenter.Driving.BeforeStartDialog',
			icon: 'information',
			title: lang.get('DialogTitle'),
			hideInSeconds: null,
			appearInSeconds: 0,
			type: 'message',
			buttons: [{ key: 'F', text: lang.get('DialogButton', { isLastContent }) }],
			content: lang.get(`DialogContent@${contentIndex}`),
			payload: {
				contentIndex,
				isLastContent,
				discapeEscapeDialog: true
			}
		});
	} catch (err) {
		logError('licenseCenter.driving.showBeforeTestStartDialog', err);
	}
};

/**
 * Start the driving test
 */
export const startDrivingTest = (player: PlayerMp) => {
	try {
		// Check if already taking a license test..
		if (player.vars.licenseTest.enabled) return;

		// Get the vehicle spawn location
		const vehicleSpawnLocation = getRandomVehicleSpawnLocation();

		// Create the vehicle..
		const vehicle = mp.vehicles.createVehicle(
			VEHICLE_INFO.model,
			VEHICLE_INFO.hash,
			vehicleSpawnLocation.position,
			{
				heading: vehicleSpawnLocation.heading
			},
			{
				modifications: {
					...getDefaultVehicleModifications(VEHICLE_INFO.model),
					plate: 'DMV'
				}
			}
		);

		// Put player into vehicle..
		player.putIntoVehicle(vehicle, 0);

		// Create the actor..
		const dmvInstructor = mp.actors.create({
			identifier: `dmvInstructor@${player.id}`,
			attributes: {
				model: 'cs_manuel',
				position: vehicleSpawnLocation.position,
				invincible: true,
				frozen: true
			},
			variables: {
				vehicleId: vehicle.id
			},
			info: {
				name: {
					EN: 'DMV Instructor'
				}
			}
		});

		// Set the controller of the actor to the player
		dmvInstructor.entity.controller = player;

		// Put the instructor into vehicle..
		dmvInstructor.putIntoVehicle(vehicle, 0);

		// Set the player variables..
		player.updateVars({
			licenseTest: {
				enabled: true,
				id: 'driving',
				payload: {
					vehicle,
					damages: DRIVING_MAX_DAMAGES,
					checkpointIdentifier: null
				}
			}
		});

		// Freeze the player
		player.freeze({ systemId: 'licenseCenter@driving', toggle: true });

		// Show the before start dialog to the player
		showBeforeTestStartDialog(player);
	} catch (err) {
		logError('licenseCenter.driving.startDrivingTest', err);
	}
};
