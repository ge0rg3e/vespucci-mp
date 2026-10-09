import React, { createContext, useContext, useEffect, useState } from 'react';

// Dependencies
import { VespifyMusicService } from '@/services/vespify/music';
import { logError } from '@/utils/helpers';

// Components
import Header from './components/header';
import CurrentSong from './components/currentSong';
import Controls from './components/controls';
import Queue from './components/queue';

// Language
import * as i18n from '@vmp/i18n';
import LanguagePack from './language';
const languagePackId = `phone.vespifyMusic.player`;
i18n.createLanguagePack(languagePackId, LanguagePack);

// Context
import { AppState } from '../..';
import { AudioService } from '@/services/audio';
import { getGameLocalStorage } from '@/views/phone/utils/helpers';

// Context
const Context = createContext({});
export const ScreenState: ExpectedAny = () => useContext(Context);

const Component = () => {
	const { screen } = AppState();

	// We need to know where we are.
	const [screenState, setScreenState] = useState<'loading' | 'idle' | 'error'>('loading');

	// Context dependencies for Vespify Music
	const { getInstance, createInstance, deleteInstance, speakersRef } = VespifyMusicService();
	const { getInstance: getAudioInstance } = AudioService();

	// Language pack
	const lang = i18n.getLanguagePack(languagePackId, window.language);

	const loadData = async () => {
		try {
			// Get current music instance
			const instance = getInstance('phone.vespifyMusic');

			// If the new data received is the same it means they are resuming
			if (
				instance &&
				instance.metadata.type === screen.payload.type &&
				instance.metadata.remoteId === screen.payload.id
			) {
				// Set screen as idle.
				setScreenState('idle');

				return false;
			}

			// Mark as loading
			setScreenState('loading');

			// Get the volume from the game
			const musicPreferences = await getGameLocalStorage(`phone.vespifyMusic`);
			const { volume = 1, autoplay = true } = musicPreferences || {}; // 1 means full 100% volume.

			// Create the instance playing for this instance.
			await createInstance({
				// The id of this instance
				identifier: 'phone.vespifyMusic',
				// What we're trying to play
				type: screen.payload.type,
				// The ID of what we're playing
				remoteId: screen.payload.id,
				// Controls for this
				controls: {
					repeat: 'off',
					shuffle: false,
					autoplay
				},
				// The volume of the music
				volume
			});

			// We finished loading
			setScreenState('idle');
		} catch (err) {
			await logError(`vespifyMusic.player.loadData`, err);

			// Setting these accordingly..
			setScreenState('error');
		}
	};

	const onScreenClosing = () => {
		// Get current music instance
		const instance = getInstance('phone.vespifyMusic', true);
		if (!instance) return false;

		// Get audio..
		const audio = getAudioInstance(`vespify.music@${instance.identifier}`, true);
		if (!audio) return false;

		// If the song is not paused we don't kill the instance
		if (audio.preferences.paused === false || instance.loading) return false;

		// Delete vespify music instance
		deleteInstance('phone.vespifyMusic');

		// Inform the speakers that is now paused.
		if (speakersRef.current.length > 0) {
			window.rpc.triggerServer(`speakers@closedPlayer`);
		}
	};

	useEffect(() => {
		// Load the song and its data initially.
		loadData();

		return () => {
			onScreenClosing();
		};
	}, []);

	const PassedProps = {
		// The screen state
		screenState,
		setScreenState, // Language pack
		lang,
		data: getInstance('phone.vespifyMusic')
	};

	if (screenState === 'loading') {
		return (
			<Context.Provider value={PassedProps}>
				<Header />
				<div className="component-having-difficulties">
					<div className="icon loading-icon">
						<i className="elm fa-thin fa-spinner-third fa-spin"></i>
					</div>
					<div className="heading">{lang.get('LoadingTitle')}</div>
					<div className="message">{lang.get('LoadingMessage')}</div>
				</div>
			</Context.Provider>
		);
	}

	if (screenState === 'error') {
		return (
			<Context.Provider value={PassedProps}>
				<Header />
				<div className="component-having-difficulties">
					<div className="icon">
						<i className="elm fa-solid fa-triangle-exclamation"></i>
					</div>
					<div className="heading">{lang.get('HavingDifficultiesTitle')}</div>
					<div className="message">{lang.get('HavingDifficultiesMessage')}</div>
				</div>
			</Context.Provider>
		);
	}

	return (
		<Context.Provider value={PassedProps}>
			<Header />
			<CurrentSong />
			<Controls />
			<Queue />
		</Context.Provider>
	);
};

export default Component;
