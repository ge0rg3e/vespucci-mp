import { AudioInstance } from './types';

// Variables
export let instances: Array<AudioInstance> = [];

// @Reminder: This is here to avoid the error from rollup about circular dependency. (callback is importing spatial and viceversa)

export const createInstance = (data: AudioInstance) => {
	// Add it to our instance
	instances.push({
		identifier: data.identifier,
		pan: data.pan,
		biquadFilter: data.biquadFilter,
		spatialSound: data.spatialSound,
		volume: data.volume
	});
};

export const updateInstance = (identifier: string, payload: Partial<AudioInstance>) => {
	// Get current instance
	const index = instances.findIndex((c) => c.identifier === identifier);
	if (index === -1) return false;

	// Update..
	instances[index] = {
		...instances[index],
		...payload
	};

	return true;
};

export const deleteInstance = (identifier: string) => {
	// Get current instance
	const index = instances.findIndex((c) => c.identifier === identifier);
	if (index === -1) return false;

	instances.splice(index, 1);

	return true;
};
