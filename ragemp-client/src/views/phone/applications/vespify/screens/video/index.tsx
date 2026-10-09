import React, { createContext, useContext, useEffect, useState } from 'react';

// Components
import AppBar from '../../components/appBar';
import ScrollableView from '../../components/scrollableView';
import Information from './components/information';
import Modals from './components/modals';
import API from './utils/api';

// Dependencies
import { logError, useStateRef } from '@/utils/helpers';
import { getGameLocalStorage, setGameLocalStorage } from '@/views/phone/utils/helpers';

// Context
const Context = createContext({});
export const ScreenState: ExpectedAny = () => useContext(Context);

// Other contexts
import { AppState } from '../..';
import { VespifyService } from '@/services/vespify/videos';
import { getVideo } from '@/services/vespify/videos/utils/functions';

// Language
import * as i18n from '@vmp/i18n';
import LanguagePack from './language';

// Language translation
const languagePackId = `phone.vespify.video.main`;
i18n.createLanguagePack(languagePackId, LanguagePack);

const Component = () => {
	const [data, setData, dataRef] = useStateRef(null);
	const [loading, setLoading] = useState(true);
	const [expandedModalId, setExpandedModalId] = useState(null);

	// Context dependencies
	const { screen } = AppState();
	const { getInstance, createInstance, updateInstance } = VespifyService();

	// Get translation
	const lang = i18n.getLanguagePack(languagePackId, window.language);

	// @Event: Load the data of this video
	const loadVideo = async (idPassed: string | null = null) => {
		try {
			// Id used
			const idUsed = idPassed !== null ? idPassed : screen.payload.id;

			// Get the current vespify instance if exists
			const instance = getInstance('phone.vespify');

			// It means the video is already playing in the background all we need to is just put it back into place.
			if (instance && instance.metadata.id === idUsed) return resumeVideo();

			// Mark the app that we loading...
			setLoading(true);

			// Get the player's meta about his controls (so we know what volume to set etc)
			let preferredControls = await getGameLocalStorage(`phone.vespify`);
			const { volume = 100, loop = false, miniPlayer = true } = preferredControls || {};

			// Ask the service to play this in the background.
			const { response } = await createInstance({
				// Details for the instance
				identifier: `phone.vespify`,
				remoteId: idUsed,
				// Some controls preferences
				controls: {
					paused: true, // Will unpause after data is loaded (by utils/api)
					muted: false,
					// Apply player prefernces
					volume,
					loop,
					// This will be actioned only when phone is raised down or app is closed
					miniPlayer
				},
				// Helpful callbacks.
				callbacks: {
					onControlsUpdated: async (newState) => {
						// Update game
						setGameLocalStorage(`phone.vespify`, {
							volume: newState.volume,
							loop: newState.loop,
							miniPlayer: newState.miniPlayer
						});
					}
				}
			});

			// Set the front-end data
			setData(response);

			// Mark loading finished
			setLoading(false);
		} catch (err) {
			await logError(`phone.vespify@loadVideo`, err, { id: screen.payload.id });
			setLoading(false);
		}
	};

	// @Event: When the user accesses the video he's playing in his background.
	const resumeVideo = async () => {
		try {
			// Get instance data again
			const instance = getInstance('phone.vespify');
			if (!instance) throw new Error(`Failed to resume due to not having an instane.`);

			// Mark the interface as loading
			setLoading(true);

			// Get the data about the video
			const videoFetched = await getVideo(instance.metadata.id);

			// Set the data for the interface
			setData(videoFetched);

			// Put video back in dock
			updateInstance(`phone.vespify`, {
				elementIdDestination: `phone-app-vespify::video-player`
			});

			// Stop loading
			setLoading(false);
		} catch (err) {
			await logError(`phone.vespify@resumeVideo`, err);
			setLoading(false);
			setData(null);
		}
	};

	useEffect(() => {
		// When screen shows up let's load the video..
		loadVideo();
	}, []);

	const PassedProps = {
		// Data
		data,
		dataRef,
		setData,
		// Language
		lang,
		// Functions
		loadVideo,
		// Expanded modal
		expandedModalId,
		setExpandedModalId,
		// Loading
		loading,
		setLoading
	};

	// If we failed to load the video
	if (loading === false && data === null) {
		return (
			<React.Fragment>
				<AppBar />
				<div className="component-having-difficulties">
					<div className="icon">
						<i className="elm fa-light fa-circle-info"></i>
					</div>
					<div className="heading">{lang.get('HavingDifficultiesTitle')}</div>
					<div className="message">{lang.get('HavingDifficultiesMessage')}</div>
				</div>
			</React.Fragment>
		);
	}

	//  If we are loading
	if (!data && loading === true) {
		return (
			<React.Fragment>
				<AppBar loading={true} />
				<div className="component-ghosts">
					<div className="video"></div>
					<div className="sections">
						<div className="icon">
							<i className="elm fa-thin fa-spinner-third fa-spin"></i>
						</div>
						<div className="heading">{lang.get('LoadingTitle')}</div>
						<div className="message">{lang.get('LoadingMessage')}</div>
					</div>
				</div>
			</React.Fragment>
		);
	}

	return (
		<React.Fragment>
			<AppBar />
			<ScrollableView>
				<Context.Provider value={PassedProps}>
					{/* We will render the player here through React Portal */}
					<div id="phone-app-vespify::video-player"></div>
					{/* Other sections */}
					<Information />
					<Modals />
					{/* API */}
					<API />
				</Context.Provider>
			</ScrollableView>
		</React.Fragment>
	);
};

export default Component;
