import { logError } from '@/utils/helpers';
import { useEffect } from 'react';

// Context
import { AudioService } from '..';
import { Instance } from '../utils/types';
import { dispatchAudioEvent } from '../utils/functions';

// Variables
let updateRunTimeTimerId: ExpectedAny = null;

const Component = () => {
	const { instancesRef, stopAudio, getInstance } = AudioService();
	const { updateInstance } = AudioService();

	const onAudioFinished = async ({ detail }: ExpectedAny) => {
		try {
			const { identifier } = detail;

			// Get data
			const instance = getInstance(identifier, true);
			if (!instance) return false;

			// If is not meant to be cleared.
			if (instance.preferences.preventCleanup) return false;

			// This will delete the audio from our instances.
			stopAudio(identifier);
		} catch (err) {
			await logError(`services.audio.api.onAudioEnded`, err);
		}
	};

	const onAudioLoaded = async ({ detail }: ExpectedAny) => {
		try {
			const { identifier } = detail;

			// Get data
			const instance = getInstance(identifier, true);
			if (!instance) return false;

			// @ts-ignore - Get audio duration
			const duration = instance.controller.getDuration();

			// Update instance
			updateInstance(identifier, { loaded: true, duration });
		} catch (err) {
			await logError(`services.audio.api.onAudioLoaded`, err);
		}
	};

	const updateCurrentTimeForAudios = async () => {
		try {
			// Is there any instances?
			if (instancesRef.current.length < 1) return false; // Nothing to check.

			for (const instance of instancesRef.current) {
				// Nothing to update when sound is paused.
				if (instance.preferences.paused) continue;

				// If the audio is not loaded yet
				if (!instance.loaded) continue;

				// Get the current time
				let newCurrentTime = instance.controller.getCurrentTime();

				// Update instance current time for vespify music controller.
				// Not all sounds need a hook reactive current time.
				if (instance.reactiveCurrentTime) {
					// @reminder:  We must execute events AFTER this update state is update in case we have events updating it too)
					updateInstance(instance.identifier, { currentTime: newCurrentTime });
				}

				// Some web services may need to know when the sound will end soon (ex: 10 seconds) -- This is needed by Vespify Music for preloading next song.
				if (parseInt((instance.duration - newCurrentTime).toFixed(0)) === 10) {
					dispatchAudioEvent(instance.identifier, `finishesSoon`);
				}

				// We do it this way because for Vespify Music when changing the song still counts as "ending" the song. (Pizzicato has an event.on end)
				// So we need to know when current time passed instance duration.

				// A reusable function
				const parseTiming = (nr: number) => parseInt(nr.toFixed(0));

				if (
					parseTiming(newCurrentTime) === parseTiming(instance.duration) &&
					// We don't want to spam this event. We had a scenario where a song ended and there was no next song, without this check it was spammed.
					parseTiming(instance.currentTime) !== parseTiming(newCurrentTime)
				) {
					dispatchAudioEvent(instance.identifier, 'finished');
				}
			}
		} catch (err) {
			await logError(`services.audio.updateCurrentTimeForAudios`, err);
			return false;
		}
	};

	// @Event: Needed for game 3D Positioning to keep track of audios playing
	const onAudioCreated = async ({ detail }: ExpectedAny) => {
		try {
			const { identifier, payload } = detail;

			// We get new instance passed down via payload.
			const instance = payload.instance;

			// Inform game client that a new audio has been created
			window.rpc.triggerClient(
				`audio@created`,
				JSON.stringify({
					identifier,
					volume: instance.preferences.volume,
					// Spatial sound 3D
					spatialSound: instance.spatialSound,
					// What special effects it has
					pan: instance.controller.pan,
					biquadFilter: instance.controller.biquadFilter
				})
			);
		} catch (err) {
			await logError(`services.audio.onAudioCreated`, err);
			return false;
		}
	};

	// @Event: Needed for game 3D Positioning to clean out once done
	const onAudioDeleted = async ({ detail }: ExpectedAny) => {
		try {
			const { identifier } = detail;

			// Inform game client that a new audio has been created
			window.rpc.triggerClient(
				`audio@deleted`,
				JSON.stringify({
					identifier
				})
			);
		} catch (err) {
			await logError(`services.audio.onAudioDeleted`, err);
			return false;
		}
	};

	// @Event: Needed for game 3D Positioning to clean out once done
	const onAudioUpdated = async ({ detail }: ExpectedAny) => {
		try {
			const { identifier, payload: eventPayload } = detail;

			// Get data
			const instance = getInstance(identifier, true);
			if (!instance) return false;

			// If event payload is passed..
			if (eventPayload && eventPayload.payload) {
				// Get payload keys
				const keys = Object.keys(eventPayload.payload);

				// If the only thing updated was current time we don't care. (Preventing spam on client-side)
				if (keys.length === 1 && keys[0] === 'currentTime') return false;
			}

			// We'll get the event payload like this
			const source = eventPayload && eventPayload.payload ? eventPayload.payload : {};

			// We need to extract volume if is part of payload and spatial sound if not we'll default it.
			const { volume = instance.preferences.volume, spatialSound = instance.spatialSound } = source;

			// Inform game client that an audio has been updated
			window.rpc.triggerClient(
				`audio@updated`,
				JSON.stringify({
					identifier,
					volume,
					spatialSound,
					// What special effects it has
					pan: instance.controller.pan,
					biquadFilter: instance.controller.biquadFilter
				})
			);
		} catch (err) {
			await logError(`services.audio.onAudioUpdated`, err);
			return false;
		}
	};

	useEffect(() => {
		// Update timer
		updateRunTimeTimerId = setInterval(updateCurrentTimeForAudios, 1000);

		// Browser events
		document.addEventListener('services.audio@created', onAudioCreated);
		document.addEventListener('services.audio@finished', onAudioFinished);
		document.addEventListener('services.audio@loaded', onAudioLoaded);
		document.addEventListener('services.audio@deleted', onAudioDeleted);
		document.addEventListener('services.audio@updated', onAudioUpdated);

		return () => {
			if (updateRunTimeTimerId !== null) {
				clearInterval(updateRunTimeTimerId);
				updateRunTimeTimerId = null;
			}

			// Browser events
			document.removeEventListener('services.audio@created', onAudioCreated);
			document.removeEventListener('services.audio@finished', onAudioFinished);
			document.removeEventListener('services.audio@loaded', onAudioLoaded);
			document.removeEventListener('services.audio@deleted', onAudioDeleted);
			document.removeEventListener('services.audio@updated', onAudioUpdated);
		};
	}, []);

	return null;
};

export default Component;
