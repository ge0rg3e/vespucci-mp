import * as rpc from 'rage-rpc';

// Dependencies
import { setCameraFocusAt } from './components/functions';
import { playAudio } from '@client/natives/audio/components/functions';

// Variables
let sceneActive = false;
let sceneId: string | null = null;

// Cameras..
let startCam: CameraMp | undefined = undefined;
let endCam: CameraMp | undefined = undefined;
let authCam: CameraMp | undefined = undefined;

// Timers..
let streamIntervalId: NodeJS.Timeout | null = null;
let clearStreamingTimeoutId: NodeJS.Timeout | null = null;

interface SceneData {
	start: {
		coords: Vector3;
		rot: Vector3;
	};
	end: {
		coords: Vector3;
		rot: Vector3;
	};
	auth: {
		coords: Vector3;
		rot: Vector3;
	};
	seconds: number;
	timeOfDay: number;
	weather: string;
	authInterpolationTiming?: number;
}

export const startScene = (name: string, sceneData: SceneData[], musicMuted: boolean): boolean => {
	// Pick a scene...
	sceneId = '2';
	const scene: SceneData = sceneData[parseInt(sceneId)];

	// Mark this as active..
	sceneActive = true;

	// Stream location once
	setCameraFocusAt(scene.start.coords);

	// Set the camera..
	startCam = mp.cameras.new('default', scene.start.coords, scene.start.rot, 35);

	// Activate the first cam
	startCam.setActive(true);

	// Render scripts..
	mp.game.cam.renderScriptCams(true, false, 0, true, false, 0);

	// Create final camera..
	endCam = mp.cameras.new('default', scene.end.coords, scene.end.rot, 35);

	// Activate it with interpolate..
	endCam.setActiveWithInterp(startCam.handle, scene.seconds * 1000, 0, 0); // for smooth transition

	// Start the music DJ!
	playAudio(`${`__ASSETS__`}/audios/systems/welcome/${name}/scene_${parseInt(sceneId) + 1}.mp3`, {
		// So we can stop the music on demand.
		identifier: `welcomeMusic`,
		// Preferences
		loop: true,
		autoplay: musicMuted ? false : true,
		volume: 0.1
	});

	// Set it once..
	rpc.triggerClient(`setGameWeather`, JSON.stringify({ weatherString: scene.weather }));
	rpc.triggerClient(`setGameTime`, JSON.stringify({ hour: scene.timeOfDay, minutes: 0, seconds: 0 }));

	// @Bugfix: The interface was calling too soon if I was attempting to get client-side time.
	rpc.triggerBrowsers(
		`welcome:setIsNight`,
		JSON.stringify({
			value: [0, 1, 2, 3, 4, 5, 23].includes(scene.timeOfDay) ? true : false
		})
	);

	// @Bugfix: During interpolation, the camera location gets streamed out sometimes.
	streamIntervalId = setInterval(() => {
		// Make sure camera is on stream..
		const coords = endCam?.getCoord() as Vector3;
		setCameraFocusAt(coords);

		// @Bugfix: Re-set these to make sure the server is not affecting it when an hour clocks in (mp.server weather overwrites it)
		rpc.triggerClient(`setGameWeather`, JSON.stringify({ weatherString: scene.weather }));
		rpc.triggerClient(`setGameTime`, JSON.stringify({ hour: scene.timeOfDay, minutes: 0, seconds: 0 }));
	}, 500);

	// Clear the re-streaming once interpolation reaches its end.
	clearStreamingTimeoutId = setTimeout(() => {
		// Clear interval
		if (streamIntervalId !== null) {
			// Clear..
			clearInterval(streamIntervalId);

			// Reset variable
			streamIntervalId = null;
		}

		// Reset variable here
		clearStreamingTimeoutId = null;
	}, scene.seconds * 1000);

	return true;
};

export const finishScene = (sceneData: SceneData[]): boolean => {
	// We must execute this code only when a scene is active.
	if (!sceneActive) return false;
	if (!endCam || sceneId === null) return false;

	// Clear timeouts..
	if (clearStreamingTimeoutId !== null) {
		// Clear timeout
		clearTimeout(clearStreamingTimeoutId);

		// Clear variable
		clearStreamingTimeoutId = null;
	}

	if (streamIntervalId !== null) {
		// Clear interval
		clearInterval(streamIntervalId);

		// Clear variable
		streamIntervalId = null;
	}

	// Get the scene to get the auth camera now..
	const scene: SceneData = sceneData[parseInt(sceneId)];

	// Set the final auth camera now..
	authCam = mp.cameras.new('default', scene.auth.coords, scene.auth.rot, 35);
	authCam.setActiveWithInterp(endCam.handle, scene.authInterpolationTiming || 1500, 0, 0); // for smooth transition
	// endCam.setActive(false); // for smooth transition

	// Focus it there..
	setCameraFocusAt(scene.auth.coords);

	sceneId = null;
	endCam = undefined;

	return true;
};
