import { logError } from '@/utils/helpers';
import { useEffect } from 'react';

// Context
import { AudioService } from '..';
import { dispatchAudioEvent } from '../utils/functions';

const Component = () => {
	const { getInstance, playAudio, stopAudio, updatePreferences: updateAudioPreferences } = AudioService();

	const onPlayAudio = async (args: string) => {
		try {
			// Get the instance details passed
			const { sourcePath, options } = JSON.parse(args);

			// Creating the audio..
			playAudio(sourcePath, options);
		} catch (err) {
			await logError(`services.audio.api.onPlayAudio`, err);
			return false;
		}
	};

	/**
	 *  This event can be called by the game client to stop an audio.
	 */

	const onStopAudio = async (args: string) => {
		try {
			const { identifier } = JSON.parse(args);

			// Delete it
			stopAudio(identifier);
		} catch (err) {
			await logError(`services.audio.api.onStopAudio`, err);
		}
	};

	/**
	 *  This event can be called by the game client to stop an audio.
	 */

	const onSetAudioVolume = async (args: string) => {
		try {
			const { identifier, value, updatePreferences = false } = JSON.parse(args);

			// Get instance
			const instance = getInstance(identifier, true);
			if (!instance) return false;

			// Set volume
			instance.controller.setVolume(value);

			// If the game client-side wants to also update the preferences on instance.
			if (updatePreferences) {
				updateAudioPreferences(identifier, { volume: value });
			}
		} catch (err) {
			await logError(`services.audio.api.onSetAudioVolume`, err);
		}
	};

	const onSetPaused = async (args: string) => {
		try {
			const { identifier, state } = JSON.parse(args);

			// Get instance
			const instance = getInstance(identifier, true);
			if (!instance) return false;

			if (state === true) {
				instance.controller.pause();
			} else {
				instance.controller.play();
			}
		} catch (err) {
			await logError(`services.audio.api.onSetPaused`, err);
		}
	};

	const onSetCurrentTime = async (args: string) => {
		try {
			const { identifier, value } = JSON.parse(args);

			// Get instance
			const instance = getInstance(identifier, true);
			if (!instance) return false;

			instance.controller.setCurrentTime(value);
		} catch (err) {
			await logError(`services.audio.api.onSetCurrentTime`, err);
		}
	};

	const onSetPan = async (args: string) => {
		try {
			const { identifier, value } = JSON.parse(args);

			// Get instance
			const instance = getInstance(identifier, true);
			if (!instance) return false;

			// Set volume
			instance.controller.setPan(value);

			// Dispatch event
			dispatchAudioEvent(identifier, 'updated');
		} catch (err) {
			await logError(`services.audio.api.onSetPan`, err);
		}
	};

	const onSetBiquadFilter = async (args: string) => {
		try {
			const { identifier, value } = JSON.parse(args);

			// Get instance
			const instance = getInstance(identifier, true);
			if (!instance) return false;

			// Set volume
			instance.controller.setBiquadFilter(value || undefined);

			// Dispatch event
			dispatchAudioEvent(identifier, 'updated');
		} catch (err) {
			await logError(`services.audio.api.onSetBiquadFilter`, err);
		}
	};

	const getAudioCurrentTime = async (args: string) => {
		try {
			const { identifier } = JSON.parse(args);

			// Get instance
			const instance = getInstance(identifier, true);
			if (!instance) return false;

			// Get current time
			return instance.controller.getCurrentTime();
		} catch (err) {
			await logError(`services.audio.api.getAudioCurrentTime`, err);
			return false;
		}
	};

	useEffect(() => {
		// Game events
		window.rpc.on('services.audio@play', onPlayAudio);
		window.rpc.on(`services.audio@stop`, onStopAudio);
		window.rpc.on(`services.audio@setVolume`, onSetAudioVolume);
		window.rpc.on(`services.audio@setPan`, onSetPan);
		window.rpc.on(`services.audio@setBiquadFilter`, onSetBiquadFilter);
		window.rpc.on(`services.audio@setPaused`, onSetPaused);
		window.rpc.on(`services.audio@setCurrentTime`, onSetCurrentTime);

		// Registers
		window.rpc.register(`services.audio@getAudioCurrentTime`, getAudioCurrentTime);
		return () => {
			// Game events
			window.rpc.off('services.audio@play', onPlayAudio);
			window.rpc.off(`services.audio@stop`, onStopAudio);
			window.rpc.off(`services.audio@setVolume`, onSetAudioVolume);
			window.rpc.off(`services.audio@setPan`, onSetPan);
			window.rpc.off(`services.audio@setBiquadFilter`, onSetBiquadFilter);
			window.rpc.off(`services.audio@setPaused`, onSetPaused);
			window.rpc.off(`services.audio@setCurrentTime`, onSetCurrentTime);

			window.rpc.unregister(`services.audio@getAudioCurrentTime`);
		};
	}, []);

	return null;
};

export default Component;
