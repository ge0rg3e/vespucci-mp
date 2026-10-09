import React, { useEffect } from 'react';

// Context
import { AppState } from '..';
import { VespifyService } from '@/services/vespify/videos';
import { PhoneState } from '@/views/phone';

// Dependencies
import FakeResponse from './response';
import { logError } from '@/utils/helpers';

const Component = () => {
	const { dataRef, setData, screen } = AppState();
	const { raised } = PhoneState();
	const { getInstance, updateInstance, deleteInstance } = VespifyService();

	// @Event: This will be called when the server has sent us the data for the app.
	const onDataReceived = (args: string) => {
		const { permissions } = JSON.parse(args);

		// Update data
		setData((currentState: ExpectedAny) => ({
			// Other data not set by the server. (maybe?)
			...currentState,
			// The permissisions
			permissions
		}));
	};

	// @Event: When the player raises the phone with miniplayer on
	const onPhoneRaisedChanged = async () => {
		try {
			// Get the instance if there's any
			const instance = getInstance(`phone.vespify`);
			if (!instance) return false;

			// Check if screen is video
			if (screen.id !== 'video') return false;

			// If phone is now down
			if (raised === false) {
				// Check if mini player is turned on
				if (instance.controls.miniPlayer === false) return false; // They don't want the mini player

				// If video has failed to load.
				if (instance.controls.error === true) return false;

				// Move the phone now to mini player.
				updateInstance(`phone.vespify`, {
					elementIdDestination: `services::vespify-miniPlayer`
				});
			}

			// If phone is now raised.
			if (raised === true) {
				// Shortcut..
				const elmId = `phone-app-vespify::video-player`;

				// If video is already there no need to change anything
				if (instance.elementIdDestination === elmId) return false;

				// Put it back to vespify app
				updateInstance(`phone.vespify`, {
					elementIdDestination: elmId
				});
			}
		} catch (err) {
			await logError(`phone.vespify.onPhoneRaisedChanged`, err);
			return false;
		}
	};

	// A bunch of checks that will tell us if we can keep the video in the background in minimap when the app is closed. (Not affecting the raising)
	const canKeepVideoInBackground = async () => {
		try {
			// Get the instance if there's any
			const instance = getInstance(`phone.vespify`, true);

			// In case they leave from video screen.
			if (!instance) return false;

			// Check if mini player is turned on
			if (instance.controls.miniPlayer === false) return false; // They don't want the mini player

			// Do they have the permission?
			if (!dataRef.current.permissions.keepVideoInBackground) return false;

			// If this video has failed to load.
			if (instance.controls.error === true) return false;

			return true;
		} catch (err) {
			await logError(`phone.vespify.canKeepVideoInBackground`, err);
			return false;
		}
	};
	// @Event: When we close the app we want to keep the video in miniplayer
	const keepVideoInBackground = async () => {
		try {
			// Get the instance if there's any
			const instance = getInstance(`phone.vespify`, true);

			// In case they leave from video screen.
			if (!instance) return false;

			// Can we keep the video in background?
			const canKeep = await canKeepVideoInBackground();

			if (!canKeep) {
				deleteInstance(`phone.vespify`);
				return true;
			}

			// Already in mini player (In case they close the app from video screen)
			if (instance.elementIdDestination === `services::vespify-miniPlayer`) return false;

			// Move the phone now to mini player.
			updateInstance(`phone.vespify`, {
				elementIdDestination: `services::vespify-miniPlayer`
			});
		} catch (err) {
			await logError(`phone.vespify.keepVideoInBackground`, err);
			return false;
		}
	};

	// Whenever the phone raises or goes down we must turn on miniplayer if is active.
	useEffect(() => {
		onPhoneRaisedChanged();
	}, [raised]);

	useEffect(() => {
		// Ask the server for our information
		window.rpc.triggerServer(`vespify:getApplicationData`);

		// When the server will respond..
		window.rpc.on(`phone.vespify@receivedApplicationData`, onDataReceived);

		// When they close the video screen
		document.addEventListener('phone.vespify@onVideoScreenClosed', keepVideoInBackground);

		// When we are developing..
		if (window.mp.fake) {
			setData(FakeResponse);
		}

		return () => {
			// Keep video in background when application is closed completely
			keepVideoInBackground();

			// Clear events
			window.rpc.off(`phone.vespify@receivedApplicationData`, onDataReceived);

			// Remove listener
			document.removeEventListener('phone.vespify@onVideoScreenClosed', keepVideoInBackground);
		};
	}, []);

	return null;
};
export default Component;
