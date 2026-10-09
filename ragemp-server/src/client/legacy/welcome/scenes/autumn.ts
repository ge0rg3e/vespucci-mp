import { finishScene, startScene } from '../utils';
import * as rpc from 'rage-rpc';

// An array of scenes prepared.
const scenes = [
	{
		start: {
			coords: new mp.Vector3(-1787.535, 2045.109, 130.486),
			rot: new mp.Vector3(0, 0, -21.526)
		},
		end: {
			coords: new mp.Vector3(-1702.478, 2120.289, 112.977),
			rot: new mp.Vector3(0, 0, -21.526)
		},
		auth: {
			coords: new mp.Vector3(-1837.039, 2131.127, 179.689),
			rot: new mp.Vector3(0, 0, -21.526)
		},
		seconds: 200,
		timeOfDay: 18,
		weather: 'OVERCAST',
		authInterpolationTiming: 500
	},

	{
		start: {
			coords: new mp.Vector3(-534.223, 442.938, 101.383),
			rot: new mp.Vector3(0, 0, 165.73)
		},
		end: {
			coords: new mp.Vector3(-535.325, 287.66, 88.717),
			rot: new mp.Vector3(0, 0, 165.73)
		},
		auth: {
			coords: new mp.Vector3(-542.799, 296.905, 103.946),
			rot: new mp.Vector3(0, 0, 165.73)
		},
		seconds: 200,
		timeOfDay: 17,
		weather: 'RAIN',
		authInterpolationTiming: 500
	},

	{
		start: {
			coords: new mp.Vector3(-1558.135, 1290.013, 203.175),
			rot: new mp.Vector3(0, 0, 165.73)
		},
		end: {
			coords: new mp.Vector3(-1509.443, 1629.729, 153.818),
			rot: new mp.Vector3(0, 0, 165.73)
		},
		auth: {
			coords: new mp.Vector3(-1426.29, 2086.763, 163.557),
			rot: new mp.Vector3(0, 0, 165.73)
		},
		seconds: 200,
		timeOfDay: 12,
		weather: 'SMOG',
		authInterpolationTiming: 500
	}
];

rpc.on(`welcome:startScene`, async (args: string) => {
	const { id, musicMuted } = JSON.parse(args);

	// We must execute this code only when is scene default.
	if (id !== 'autumn') return false;

	startScene('autumn', scenes, musicMuted);

	return true;
});

rpc.on(`welcome:finishScene`, async (args) => {
	const { id } = JSON.parse(args);

	// We must execute this code only when is scene default.
	if (id !== 'autumn') return false;

	finishScene(scenes);
	return true;
});
