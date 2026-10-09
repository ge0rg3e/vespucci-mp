import * as rpc from 'rage-rpc';

//  Dependencies
import { logClientsideError } from '@client/general/errors';
import { isTaskRunning, startTask, stopTask } from '../tasks/spatialSound';
import { calculateSpeakerVolume, calculateVolumeBasedOnDistance, getAudioSourcesWithSpatialSound, getDistanceFromPosition } from '../tasks/spatialSound.funcs';
import { createInstance, deleteInstance, instances, updateInstance } from './data';

// @Broswer event triggered: Informs us when an audio instance is created.
rpc.on('audio@created', (args) => {
	try {
		const { identifier, pan, biquadFilter, spatialSound, volume } = JSON.parse(args);

		// Add it to our instance
		createInstance({
			identifier,
			pan,
			biquadFilter,
			spatialSound,
			volume
		});

		// If we have a spatial sound and the task is not running we need to start it.
		if (spatialSound && !isTaskRunning()) {
			startTask();
		}

		return true;
	} catch (err) {
		logClientsideError(`audio@created`, err, args);
		return false;
	}
});

// @Broswer event triggered: Informs us when an audio instance is updated.
rpc.on('audio@updated', (args: ExpectedAny) => {
	try {
		const { identifier, spatialSound, pan, biquadFilter, volume } = JSON.parse(args);

		// Update..
		updateInstance(identifier, {
			spatialSound,
			pan,
			biquadFilter,
			volume
		});

		// If we have a spatial sound and the task is not running we need to start it.
		if (spatialSound && !isTaskRunning()) {
			startTask();
		}

		return true;
	} catch (err) {
		logClientsideError(`audio@updated`, err, args);
		return false;
	}
});

// @Broswer event triggered: Informs us when an audio instance is deleted.
rpc.on('audio@deleted', (args) => {
	try {
		const { identifier } = JSON.parse(args);

		// Delete it.
		deleteInstance(identifier);

		// If we have a spatial sound and the task is not running we need to start it.
		if (isTaskRunning() && getAudioSourcesWithSpatialSound().length < 1) {
			stopTask();
		}

		return true;
	} catch (err) {
		logClientsideError(`audio@deleted`, err, args);
		return false;
	}
});
