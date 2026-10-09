import { finishScene, startScene } from '../utils';
import * as rpc from 'rage-rpc';

// An array of scenes prepared.
const scenes = [
	// Walk on the beach
	{
		start: {
			coords: new mp.Vector3(-1846.96, -927.99, 16.11),
			rot: new mp.Vector3(0, 0, 10)
		},
		end: {
			coords: new mp.Vector3(-2092.75, -592.62, 12.78),
			rot: new mp.Vector3(0, 0, 10)
		},
		auth: {
			coords: new mp.Vector3(-1920.38, -729.96, 10.36),
			rot: new mp.Vector3(0, 0, -20)
		},
		seconds: 160,
		timeOfDay: 12,
		weather: 'EXTRASUNNY',
		authInterpolationTiming: 500
	},
	// Through canals
	{
		start: {
			coords: new mp.Vector3(-886.35, -1114.39, 11.84),
			rot: new mp.Vector3(0, 0, 30)
		},
		end: {
			coords: new mp.Vector3(-986.82, -934.05, 5.76),
			rot: new mp.Vector3(0, 0, 30)
		},
		auth: {
			coords: new mp.Vector3(-938.15, -1007.15, 13.06),
			rot: new mp.Vector3(0, 0, 50)
		},
		seconds: 120,
		timeOfDay: 12,
		weather: 'EXTRASUNNY',
		authInterpolationTiming: 500
	},
	// A transiiton on the street near the beach markets
	{
		start: {
			coords: new mp.Vector3(-1223.65, -1507.52, 8.55),
			rot: new mp.Vector3(0, 0, 40)
		},
		end: {
			coords: new mp.Vector3(-1288.07, -1418.03, 6.17),
			rot: new mp.Vector3(0, 0, 40)
		},
		auth: {
			coords: new mp.Vector3(-1260.6, -1476.81, 8.53),
			rot: new mp.Vector3(0, 0, -60)
		},
		seconds: 100,
		timeOfDay: 16,
		weather: 'CLEAR'
	},
	// Transition to that lake that is the samp loadings screen from  2009
	{
		start: {
			coords: new mp.Vector3(1043.192, -461.621, 87.3196),
			rot: new mp.Vector3(-5, 0, -160)
		},
		end: {
			coords: new mp.Vector3(1117.3787, -668.3692, 73.3819),
			rot: new mp.Vector3(-1.299, 0, -178)
		},
		auth: {
			coords: new mp.Vector3(1100.32714, -719.55, 62.0138),
			rot: new mp.Vector3(-3.6612, 0, 88)
		},
		seconds: 100,
		timeOfDay: 16,
		weather: 'CLEAR'
	}
];

rpc.on(`welcome:startScene`, async (args: string) => {
	const { id, musicMuted } = JSON.parse(args);

	// We must execute this code only when is scene default.
	if (id !== 'summer') return false;

	startScene('summer', scenes, musicMuted);

	return true;
});

rpc.on(`welcome:finishScene`, async (args) => {
	const { id } = JSON.parse(args);

	// We must execute this code only when is scene default.
	if (id !== 'summer') return false;

	finishScene(scenes);
	return true;
});
