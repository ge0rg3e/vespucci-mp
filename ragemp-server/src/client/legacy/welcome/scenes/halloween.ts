import { finishScene, startScene } from '../utils';
import * as rpc from 'rage-rpc';

// An array of scenes prepared.
const scenes = [
	// Forest
	{
		start: {
			coords: new mp.Vector3(-271.3558, 2105.766, 146.756),
			rot: new mp.Vector3(-5.645905, 1.0724192, -19.0658)
		},
		end: {
			coords: new mp.Vector3(-204.8936, 2534.6274, 75.7508),
			rot: new mp.Vector3(-6.8663, 0, 13.9264)
		},
		auth: {
			coords: new mp.Vector3(-204.8936, 2534.6274, 75.7508),
			rot: new mp.Vector3(-6.8663, 0, 13.9264)
		},
		seconds: 200,
		timeOfDay: 21,
		weather: 'HALLOWEEN',
		authInterpolationTiming: 500
	},
	// Church
	{
		start: {
			coords: new mp.Vector3(-457.5891, 2869.087, 36.8601),
			rot: new mp.Vector3(13.488, 0, -114.894)
		},
		end: {
			coords: new mp.Vector3(-365.6047, 2833.301, 57.9543),
			rot: new mp.Vector3(10.5352, 0, -112.0987)
		},
		auth: {
			coords: new mp.Vector3(-365.6047, 2833.301, 57.9543),
			rot: new mp.Vector3(10.5352, 0, -112.0987)
		},
		seconds: 120,
		timeOfDay: 3,
		weather: 'HALLOWEEN',
		authInterpolationTiming: 500
	},
	// Mine Shaft
	{
		start: {
			coords: new mp.Vector3(-586.07427, 2045.3356, 130.4638),
			rot: new mp.Vector3(0.7407, 1.3341, 10.2161)
		},
		end: {
			coords: new mp.Vector3(-595.983, 2089.9816, 132.3316),
			rot: new mp.Vector3(-6.8183, 2.14963, 26.3956)
		},
		auth: {
			coords: new mp.Vector3(-595.983, 2089.9816, 132.3316),
			rot: new mp.Vector3(-6.8183, 2.14963, 26.3956)
		},
		seconds: 100,
		timeOfDay: 18,
		weather: 'SMOG'
	}
];

rpc.on(`welcome:startScene`, async (args: string) => {
	const { id, musicMuted } = JSON.parse(args);

	// We must execute this code only when is scene default.
	if (id !== 'halloween') return false;

	startScene('halloween', scenes, musicMuted);

	return true;
});

rpc.on(`welcome:finishScene`, async (args) => {
	const { id } = JSON.parse(args);

	// We must execute this code only when is scene default.
	if (id !== 'halloween') return false;

	finishScene(scenes);
	return true;
});
