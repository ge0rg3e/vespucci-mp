import { getLanguagePack } from '@vmp/i18n';
import { ACTOR_LOCATION, DRIVING_VEHICLE_MAX_DIST_FROM_PLAYER, MARKER_POSITION, MAX_DISTANCE_BETWEEN_PLAYER_AND_CHECKPOINT } from './definitions';
import { failDrivingTest, finishDrivingTest, getCheckpointPositionByIdentifier, resetDrivingTest, setDrivingTestCheckpoint, showGetLicenseDialog } from './functions';
import { cancelTimeout, createTimeout, isTimeoutValid } from '@server/natives/timeouts';

mp.events.add('gamemodeLoaded', () => {
	// Create the driving instructor actor
	mp.actors.create({
		identifier: 'licenseCenter@driving',
		attributes: {
			model: 'cs_barry',
			position: ACTOR_LOCATION.position,
			heading: ACTOR_LOCATION.heading,
			invincible: true,
			frozen: true
		},
		variables: {},
		info: {
			name: {
				EN: 'Jonathan Roadsworth'
			},
			level: 99,
			aggressive: false,
			boss: false
		}
	});
});

mp.events.add('loadPlayerDefaults', (player) => {
	// Create the driving license center blip
	player.createColshape({
		type: 'circle',
		identifier: 'licenseCenter@driving',
		position: MARKER_POSITION,
		range: 0.9,
		dimension: 0
	});

	// Create the driving license center marker
	player.createMarker({
		identifier: `licenseCenter@driving`,
		type: 1,
		position: new mp.Vector3(MARKER_POSITION),
		scale: 0.9,
		direction: new mp.Vector3(0, 0, 0),
		rotation: new mp.Vector3(0, 0, 0),
		color: [255, 165, 0, 80],
		dimension: 0
	});
});

mp.events.add('everySecondForPlayerTimer', async (player: PlayerMp) => {
	// Destructure the licenseTest
	const { id, payload } = player.vars.licenseTest;

	// Check if the player is in a driving test
	if (id !== 'driving') return;

	// Get the vehicle and the checkpointIdentifier from the payload
	const { vehicle, checkpointIdentifier } = payload;

	// Check if he have a vehicle..
	if (vehicle) {
		// Check if the player is not in vehicle or if the player is in vehicle and that vehicle is not the payload vehicle
		if ((!player.vehicle && vehicle.dist(player.position) > DRIVING_VEHICLE_MAX_DIST_FROM_PLAYER) || (player.vehicle && player.vehicle !== vehicle)) {
			// Get the language
			const lang = getLanguagePack('LicenseCenter.Driving.Fail', player.lang);

			// Fail the driving test
			failDrivingTest(player, lang.get('ReasonVehicleTooFarWithoutBeingIn'));
		}
	}

	// Check if he have a checkpointIdentifier..
	if (checkpointIdentifier) {
		// Get the checkpoint position by identifier..
		const checkpointPosition = getCheckpointPositionByIdentifier(checkpointIdentifier);

		// Check if the checkpoint position is valid
		if (!checkpointPosition) return;

		// Check if the distance to the checkpoint is greater than the max distance between player and checkpoint
		if (player.dist(checkpointPosition) < MAX_DISTANCE_BETWEEN_PLAYER_AND_CHECKPOINT) return;

		// Get the language
		const lang = getLanguagePack('LicenseCenter.Driving.Fail', player.lang);

		// Fail the driving test
		failDrivingTest(player, lang.get('ReasonCheckpointTooFar'));
	}
});

mp.events.add('onPlayerEnterColshape', (player, colshape) => {
	// Check the identifier of colshape
	if (colshape.identifier !== 'licenseCenter@driving') return;

	// Show the driving license dialog
	showGetLicenseDialog(player);
});

mp.events.add('onPlayerExitColshape', (player, colshape) => {
	// Check the identifier of colshape
	if (colshape.identifier !== 'licenseCenter@driving') return;

	// Check the player's dialogId
	if (!player.vars.dialogId) return;

	// Check if the player dialog is the driving test dialog
	if (!['LicenseCenter.driving.mainDialog', 'LicenseCenter.driving.confirmDialog'].includes(player.vars.dialogId)) return;

	// Hide the player dialog
	player.hidePlayerDialog();
});

mp.events.add('onPlayerEnterCheckpoint', (player, checkpoint) => {
	// Desctructure the licenseTest
	const { id, payload } = player.vars.licenseTest;

	// Check if the identifier of checkpoint include the drivingTestCheckpoint and the licenseTest id is driving
	if (!checkpoint.identifier.includes('drivingTestCheckpoint') || id !== 'driving') return;

	// Check if the player vehicle is not the payload vehicle
	if (player.vehicle !== payload.vehicle) return;

	// Get the checkpoint id
	const checkpointId = checkpoint.identifier.split('@')[1];

	// If the checkpoint id is not valid, return
	if (typeof checkpointId === 'undefined') return;

	// Check if the checkpointId is the finish checkpoint
	const isFinishCheckpoint = checkpointId === 'finish';

	// Get the checkpoint index
	const checkpointIndex = parseInt(checkpointId);

	// If the checkpoint index is NaN and it's not the finish checkpoint, return
	if (isNaN(checkpointIndex) && !isFinishCheckpoint) return;

	// Destroy the checkpoint
	player.deleteCheckpoint(checkpoint.identifier);

	// Finish or set the next checkpoint based on the checkpoint index
	if (isFinishCheckpoint) finishDrivingTest(player);
	else setDrivingTestCheckpoint(player, checkpointIndex + 1);
});

mp.events.add('playerDeath', (player) => {
	// Check if the player is in a driving test
	if (player.vars.licenseTest?.id !== 'driving') return;

	// Get the language
	const lang = getLanguagePack('LicenseCenter.Driving.Fail', player.lang);

	// Fail the driving test
	failDrivingTest(player, lang.get('ReasonDied'));
});

mp.events.add('onPlayerDamageVehicle', (player, vehicle) => {
	// Destrcture the licenseTest
	const { id, payload } = player.vars.licenseTest;

	// Check if the player is in a driving test
	if (id !== 'driving') return;

	// Check if the payload vehicle from licenseTest match with the vehicle
	if (payload?.vehicle !== vehicle) return;

	// Get the remained damages
	const remainedDamages = payload?.damages - 1;

	if (remainedDamages === 0) {
		// Get the language
		const lang = getLanguagePack('LicenseCenter.Driving.Fail', player.lang);

		// Fail the driving test
		failDrivingTest(player, lang.get('ReasonDamagedVehicleTooMuch'));
	} else {
		// Get the language
		const lang = getLanguagePack('LicenseCenter.Driving.BeforeFail', player.lang);

		// Send chat message
		player.sendServerMessage('License Center', 'system', lang.get('NotificationMessage', { reason: lang.get('ReasonDamageVehicle', { remainedDamages }) }), 'system');

		// Update the payload damages
		player.updateVars({
			licenseTest: {
				...player.vars.licenseTest,
				payload: {
					...player.vars.licenseTest.payload,
					damages: remainedDamages
				}
			}
		});
	}
});

mp.events.add('playerExitVehicle', (player, vehicle) => {
	// Check if the player is in a driving test
	if (player.vars.licenseTest?.id !== 'driving') return;

	// Check if the payload vehicle from licenseTest match with the vehicle
	if (player.vars.licenseTest?.payload?.vehicle !== vehicle) return;

	// Get the before fail language
	const beforeFailLanguage = getLanguagePack('LicenseCenter.Driving.BeforeFail', player.lang);

	// Send chat message
	player.sendServerMessage('License Center', 'system', beforeFailLanguage.get('NotificationMessage', { reason: beforeFailLanguage.get('ReasonExitVehicle') }), 'system');

	// Get the fail language
	const failLanguage = getLanguagePack('LicenseCenter.Driving.Fail', player.lang);

	// Create a timeout for the player to fail the driving test
	createTimeout(`licesenCenter.driving@vehicleExit:${player.id}`, () => failDrivingTest(player, failLanguage.get('ReasonExitVehicle')), 30 * 1000);
});

mp.events.add('playerEnterVehicle', (player, vehicle) => {
	// Check if the player is in a driving test
	if (player.vars.licenseTest?.id !== 'driving') return;

	// Check if the payload vehicle from licenseTest match with the vehicle
	if (player.vars.licenseTest?.payload?.vehicle !== vehicle) return;

	// Check if the timeout valid
	if (!isTimeoutValid(`licesenCenter.driving@vehicleExit:${player.id}`)) return;

	// Cancel the timeout
	cancelTimeout(`licesenCenter.driving@vehicleExit:${player.id}`);
});

mp.events.add('playerQuit', (player) => {
	// Check if the player is in a driving test
	if (player.vars.licenseTest?.id === 'driving') {
		// Reset the driving test
		resetDrivingTest(player);
	}

	// Check if the player have an active timeout
	if (isTimeoutValid(`licesenCenter.driving@vehicleExit:${player.id}`)) {
		// Cancel the timeout
		cancelTimeout(`licesenCenter.driving@vehicleExit:${player.id}`);
	}
});
