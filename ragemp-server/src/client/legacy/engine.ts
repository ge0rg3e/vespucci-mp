import * as rpc from 'rage-rpc';

import { interfacesOpened, loggedIn } from '@client/natives/interfaces';
import { isTestDriveDealershipInProgress, vehicleTestDriveModel } from './dealership/components/testDrive';
import { getVehicleNativeInfo } from '@client/natives/nativeInformation';
import { getVehicleVariable } from '@client/utils/helpers';
import { phoneRaised } from './phone/components/legacy';
import { isWritingOnPhone } from './phone/components/functions';

const ENGINE_KEY = 0x32; // Number 2
const player: ExpectedAny = mp.players.local;
let engineCooldown = false;

const setEngineState = async (entity: VehicleMp) => {
	// Get their variables..
	const vehicleEngine = getVehicleVariable(entity.remoteId, 'engine');
	const vehicleModel = getVehicleVariable(entity.remoteId, 'model');
	const drivingClientsideVehicle = isTestDriveDealershipInProgress() ? true : false;
	const nativeInfo: ExpectedAny = await getVehicleNativeInfo(drivingClientsideVehicle ? vehicleTestDriveModel : vehicleModel);
	if (!vehicleModel || !nativeInfo) return false;

	// If the vehicle has no engine (bike, plane) we start it -- if not is server-side controlled.
	const engineState = nativeInfo.hasEngine ? vehicleEngine : true;

	// Set the right engine state..
	// @Reminder: this won't work unless there's someone in the vehicle.
	entity.setEngineOn(engineState, false, true);

	return true;
};

// When the variable has been changed server-side
mp.events.addDataHandler('@vehicleVars.engine', function (entity: VehicleMp, newValue, oldValue) {
	if (JSON.stringify(newValue) === JSON.stringify(oldValue)) return false; // Data has not changed but it has been triggered by shitty RAGEMP Triggers.

	setEngineState(entity);
	return true;
});

// When a player enters the vehicle
mp.events.add('patched:playerEnterVehicle', (vehicle) => {
	setEngineState(vehicle);
});

mp.keys.bind(ENGINE_KEY, true, async () => {
	if (!loggedIn || !player.vehicle || engineCooldown === true) return;

	// If an interface is opened...
	if (interfacesOpened.length > 0) return false;

	// If the phone is raised and is not writing
	const isPhoneWriting = await isWritingOnPhone();

	// If the phone is raised and they are writing..
	if (phoneRaised && isPhoneWriting) return false;

	engineCooldown = true;
	setTimeout(() => (engineCooldown = false), 2000);

	// Trigger the server to know he pressed the engine key
	rpc.triggerServer('onEngineKeyPressed');

	return true;
});

// When a vehicle streams in
// Reminder: this is useless because gta won't start the engine of an empty vehicle. also i was afraid "what if the local cache of one player will override the engine for others too"

// mp.events.add('entityStreamIn', (entity: VehicleMp) => {
// 	if (entity.type !== 'vehicle') return;

// 	setEngineState(entity);
// });
