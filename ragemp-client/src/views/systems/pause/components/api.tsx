import React, { useEffect } from 'react';

// Dependencies
import Response from '../response';
import { logError } from '@/utils/helpers';

//  Context
import { PauseState } from '..';
import { getGameSettings } from './functions';

// Variables
let timerId: ExpectedAny = null;

const Component = () => {
	const { settings, setSettings } = PauseState();

	const loadSettings = async () => {
		try {
			// If we're developing..
			if (window.mp.fake) {
				setSettings({
					// Default response
					...Response,
					// Language
					language: window.language
				});
				return false;
			}

			// Get the settings from the client
			const response = await getGameSettings();

			// Set settings
			setSettings({
				// All the settings
				...response,
				// The language
				language: window.language
			});
		} catch (err) {
			logError(`pause.loadSettings`, err);
		}
	};

	const saveSettings = async () => {
		try {
			const { language, ...payload } = settings;

			// Update language
			if (language !== window.language) {
				window.rpc.triggerServer(`settings:updateLanguageAndSave`, JSON.stringify({ language }));
			}

			// Save setttings
			window.rpc.triggerServer(`settings:saveSettings`, JSON.stringify({ settings: payload }));

			// Inform the client-side to update audios
			window.rpc.triggerClient(`settings:updated`, JSON.stringify({ settings: payload }));
		} catch (err) {
			await logError(`pause.saveSettings`, err);
		}
	};

	useEffect(() => {
		if (timerId) {
			clearTimeout(timerId);
			timerId = null;
		}

		timerId = setTimeout(() => {
			saveSettings();
			timerId = null;
		}, 1000);

		// eslint-disable-next-line
	}, [settings]);

	useEffect(() => {
		// Load settings
		loadSettings();
	}, []);

	return null;
};

export default Component;
