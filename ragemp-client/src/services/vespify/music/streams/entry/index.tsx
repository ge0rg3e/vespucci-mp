import React, { useEffect } from 'react';

// Audio
import { AudioService } from '@/services/audio';
import { AudioControls } from '@/services/audio/components/controls';

// Music
import { VespifyMusicService } from '../..';
import { VespifyMusicControls } from '../../utils/controls';
import { getSong, shuffleIndexOfSongs } from '../../utils/functions';
import { Instance } from '@/services/vespify/music/types/context';

//  Dependencies
import { logError } from '@/utils/helpers';
import { setGameLocalStorage } from '@/views/phone/utils/helpers';

const Component = (props: Props) => {
	// Audio dependencies
	const { playAudio, getInstance: getAudio, stopAudio, updateInstance: updateAudio } = AudioService();
	const { setCurrentTime } = AudioControls();

	// Music dependencies
	const { speakersRef, getInstance, updateInstance } = VespifyMusicService();
	const { changeSong, getSongByDirection, refreshRecommendations } = VespifyMusicControls();

	// @Function: It will start the new sound.
	const startMusic = async (ev: ExpectedAny) => {
		// Getting the current song
		const currentSong = ev === null ? props.data.currentSong : ev.detail.payload.currentSong;

		// Volume is either set on creation or is passed down by ChangeSong function.
		const volume = ev === null ? props.data.volume : ev.detail.payload.volume;

		// We find out if the music should be muted if is connected to speakers.
		const muted = speakersRef.current.length > 0 ? true : false;

		// If we need a hook state update on current time
		const reactiveCurrentTime = props.data.identifier === 'phone.vespifyMusic' ? true : false;

		try {
			// Format source path
			const sourcePath = `${__VESPIFY_API__}/storage/music/${currentSong.id}.mp4`;

			// Play the song
			playAudio(sourcePath, {
				// The identifier of this audio so we can find it later
				identifier: `vespify.music@${props.data.identifier}`,
				// Preferences
				volume,
				muted,
				// We need this audio instance to stay there.
				preventCleanup: true,
				// If we need a reactive current time
				reactiveCurrentTime
			});

			// If we are connected to speakers let's inform our speakers that we set the song.
			if (speakersRef.current.length > 0) {
				window.rpc.triggerServer(
					`speakers@setSong`,
					JSON.stringify({
						volume,
						sourcePath
					})
				);
			}
		} catch (err) {
			logError(`services.vespify.music@startMusic`, err, {
				identifier: props.data.identifier
			});
			return false;
		}
	};

	// @Function: It will stop the sound from current song.
	const stopMusic = async () => {
		try {
			stopAudio(`vespify.music@${props.data.identifier}`);
		} catch (err) {
			await logError(`services.vespify.music@stopMusic`, err, {
				identifier: props.data.identifier
			});
		}
	};

	// @Function: When songs ends it will load the next song (from recommendations or queue)
	const playNextSongOnEnd = async () => {
		try {
			// Get data
			const instance = getInstance(props.data.identifier, true);
			if (!instance) return false;

			// Get the next song forward.
			let song = getSongByDirection(props.data.identifier, 'forward');

			// There's no other song to go forward but the song finished.
			if (!song) {
				// Get audio
				const audio = getAudio(`vespify.music@${props.data.identifier}`, true);
				if (!audio) return false;

				// Is too complicated to use the functions since the functions both use same sdk functions. Leave it like this.
				updateAudio(`vespify.music@${props.data.identifier}`, {
					currentTime: 0,
					preferences: {
						...audio.preferences,
						paused: true
					}
				});

				// Manually pause the audio and then switch it to current time zero
				audio.controller.pause();
				audio.controller.setCurrentTime(0);

				return false;
			}

			// It means we're loading the next song so it will trigger an event of ending when the previous song is deleted.
			if (instance.loading === true) return false;

			// Play next song and get the data of the new song playing.
			const res = await changeSong(instance.identifier, song.id);

			// If autoplay recommendations is empty due to playing all the songs.
			if (res && instance.recommendations.length === 1) {
				refreshRecommendations(instance.identifier, res);
			}
		} catch (err) {
			await logError(`services.audio.api.playNextSongOnEnd`, err);
			return false;
		}
	};

	// @Function: Repeats the current song or queue.
	const repeatSongOrQueue = async () => {
		try {
			// Get data
			const instance = getInstance(props.data.identifier, true);
			if (!instance) return false;

			// They want to repeat current song.
			if (instance.controls.repeat === 'song') {
				// Update current time of the audio
				setCurrentTime(`vespify.music@${props.data.identifier}`, 0);
				return true;
			}

			// Otherwise it means they want to repeat the queue: Check if this current song is the last one.
			const currentIndex = instance.queue.findIndex((c) => c.id === instance.currentSong.id);
			if (currentIndex == -1) return false;

			// Get next song
			let song = instance.queue[currentIndex + 1];

			// If there is no next song
			if (song === undefined) return false; // It means the queue is finished.

			// Change song
			changeSong(instance.identifier, song.id);
		} catch (err) {
			await logError(`services.audio.api.repeatSongOrQueue`, err);
			return false;
		}
	};

	// @Function: Picks a random song from queue.
	const shuffleNextSongFromQueue = async () => {
		try {
			// Get data
			const instance = getInstance(props.data.identifier, true);
			if (!instance) return false;

			// Otherwise it means they want to repeat the queue: Check if this current song is the last one.
			const currentIndex = instance.queue.findIndex((c) => c.id === instance.currentSong.id);
			if (currentIndex == -1) return false;

			// Shuffle and get a random index.
			const shuffledIndex = shuffleIndexOfSongs(currentIndex, instance.queue.length);

			// Get next song
			let song = instance.queue[shuffledIndex];
			if (song === undefined) return false; // It means the shuffle is fucked up.

			// Play first song again
			changeSong(instance.identifier, song.id);
		} catch (err) {
			await logError(`services.audio.api.shuffleNextSongFromQueue`, err);
			return false;
		}
	};

	// @Event: Audio service emits event when is 10 seconds until sound is ending so we can prefetch the next song for smooth experience.
	const preloadNextSong = async ({ detail }: ExpectedAny) => {
		try {
			// Get data
			const instance = getInstance(props.data.identifier, true);
			if (!instance) return false;

			// Is not this instance.
			if (detail.identifier !== `vespify.music@${instance.identifier}`) return false;

			// If is shuffle we don't know how's next.
			if (instance.controls.shuffle) return false;

			// If they want it on repeat there's no need to preload now
			if (instance.controls.repeat !== 'off') return false;

			// Get next or previous song
			let song = getSongByDirection(props.data.identifier, 'forward');
			if (!song) return false;

			// Pre-fetch the next song so we have it on our server.
			await getSong(song.id);
		} catch (err) {
			await logError(`services.audio.api.onAudioEnded`, err);
			return false;
		}
	};

	// @Event: When current song ends.
	const onCurrentSongEnded = async ({ detail }: ExpectedAny) => {
		try {
			// Get data
			const instance = getInstance(props.data.identifier, true);
			if (!instance) return false;

			// Is not this instance.
			if (detail.identifier !== `vespify.music@${instance.identifier}`) return false;

			// It means we're loading the next song so it will trigger an event of ending when the previous song is deleted.
			if (instance.loading === true) return false;

			// If they have controls enabled..
			if (instance.controls.repeat !== 'off') return repeatSongOrQueue();

			// If they want to shuffle.
			if (instance.controls.shuffle) return shuffleNextSongFromQueue();

			// Play next song
			playNextSongOnEnd();
		} catch (err) {
			await logError(`services.audio.api.onCurrentSongEnded`, err);
			return false;
		}
	};

	// @Event: When the current song finishes loading up.
	const onCurrentSongLoaded = async ({ detail }: ExpectedAny) => {
		try {
			// Get data
			const instance = getInstance(props.data.identifier, true);
			if (!instance) return false;

			// Is not this instance.
			if (detail.identifier !== `vespify.music@${instance.identifier}`) return false;

			// Update instance
			updateInstance(instance.identifier, { loading: false });
		} catch (err) {
			await logError(`services.audio.api.onCurrentSongLoaded`, err);
			return false;
		}
	};

	// @Event: When the current song failed to load
	const onSongFailedToLoad = async ({ detail }: ExpectedAny) => {
		try {
			// Get data
			const instance = getInstance(props.data.identifier, true);
			if (!instance) return false;

			// Is not this instance.
			if (detail.identifier !== `vespify.music@${instance.identifier}`) return false;

			// Update instance
			updateInstance(instance.identifier, { loading: false });

			// Reminder: The player is in game, one song failes to load. Is ok, he won't be able to change volume ,etc, but he can skip forward.
			// To do that we need them to be able to use the "forward" buttons.
		} catch (err) {
			await logError(`services.audio.api.onSongFailedToLoad`, err);
			return false;
		}
	};

	// @Event: Whent he volume has changed in the normal music app we need to track it down to Rage.
	const onVolumeChanged = async ({ detail }: ExpectedAny) => {
		try {
			// Get data
			const instance = getInstance(props.data.identifier, true);
			if (!instance) return false;

			// Is not the sound from the main music app
			if (instance.identifier !== 'phone.vespifyMusic') return false;

			// Is not this instance.
			if (detail.identifier !== `vespify.music@${instance.identifier}`) return false;

			//  Update ragemp - @Reminder this is in two places.
			setGameLocalStorage(`phone.vespifyMusic`, {
				volume: detail.payload.volume,
				autoplay: instance.controls.autoplay
			});
		} catch (err) {
			await logError(`services.audio.api.onCurrentSongLoaded`, err);
			return false;
		}
	};

	useEffect(() => {
		// Start the music by default
		startMusic(null);

		// Audio events
		document.addEventListener('services.audio@loaded', onCurrentSongLoaded);
		document.addEventListener('services.audio@failedToLoad', onSongFailedToLoad);
		document.addEventListener('services.audio@finished', onCurrentSongEnded);
		document.addEventListener('services.audio@finishesSoon', preloadNextSong);
		document.addEventListener('services.audio@volumeChanged', onVolumeChanged);

		// Music events
		document.addEventListener(`services.vespify.music@startMusic`, startMusic);
		document.addEventListener(`services.vespify.music@stopMusic`, stopMusic);

		return () => {
			// Stop the music by default
			stopMusic();

			// Remove audio events
			document.removeEventListener('services.audio@loaded', onCurrentSongLoaded);
			document.removeEventListener('services.audio@failedToLoad', onSongFailedToLoad);
			document.removeEventListener('services.audio@finished', onCurrentSongEnded);
			document.removeEventListener('services.audio@finishesSoon', preloadNextSong);
			document.removeEventListener('services.audio@volumeChanged', onVolumeChanged);

			// Remove music events
			document.removeEventListener(`services.vespify.music@startMusic`, startMusic);
			document.removeEventListener(`services.vespify.music@stopMusic`, stopMusic);
		};
	}, []);

	return null;
};

type Props = {
	data: Instance;
};

export default Component;
