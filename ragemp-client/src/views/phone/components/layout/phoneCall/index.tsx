import { useState, createContext, useContext } from 'react';

// Other context
import { AppContext } from '@/utils/context';

// Context
const Context = createContext({});
export const ComponentState: ExpectedAny = () => useContext(Context);

// Map of views
import MapViews from './components/views/map';

// Components
import API from './components/api';
import { validateAudioLink } from '@/views/phone/utils/helpers';
import { useStateRef } from '@/utils/helpers';
import { AudioService } from '@/services/audio';

const Component = () => {
	// Context
	const { phoneCall, phoneCallRef } = AppContext();
	const { playAudio, stopAudio } = AudioService();

	// Data
	const [timeElapsed, setTimeElapsed] = useState('00:00');
	const [overlayActive, setOverlayActive] = useState(false);
	const [minimal, setMinimal] = useState(false);
	const [isMuted, setIsMuted] = useState(false);
	const [soundsPlaying, setSoundsPlaying, soundsPlayingRef] = useStateRef({
		ringtone: false,
		calling: false,
		busy: false,
		hangedUp: false
	});

	/**
	 * Hangs up on the current call. When is Automatic true it shows in Amplitude "Call Ended"
	 * @param isAutomatic - boolean
	 */

	const hangUp = (isAutomatic: boolean = false) => {
		window.rpc.triggerServer(
			`phone:hangupCall`,
			JSON.stringify({
				type: isAutomatic ? 'automatic' : 'manual'
			})
		);
	};

	/**
	 * This will decide your response to a player's call: Accept or reject his call.
	 * @param response - boolean
	 */

	const respondCall = (response: boolean) => {
		window.rpc.triggerServer(`phone:${response ? 'acceptCall' : 'rejectCall'}`);
		setTimeElapsed('00:00')
	};

	/**
	 *
	 * @param local - if you want the local participant data or not.
	 * @param useRef - if it should use ref or not.
	 * @returns The data or null.
	 */

	const getParticipantData = (local = false, useRef = false) => {
		const src = useRef ? phoneCallRef.current : phoneCall;

		if (!src) return null;

		return src.participants.find((c: phoneLineParticipant) => (c._isLocalPlayer === local ? true : false)) || null;
	};

	/**
	 * Switches from minimal to fullScreen when clicking on certain elements.
	 *
	 */

	const switchOverlayTheme = () => {
		setMinimal(!minimal);
	};

	/**
	 *
	 * @returns The status text for the call that explains what's happening.
	 */

	const getCallStatusText = () => {
		// Get the data
		const localData = getParticipantData(true);
		const participantData = getParticipantData(false);

		// Get the status
		const otherStatus = participantData.status;
		const localStatus = localData.status;

		// Check status state..
		const callActive = otherStatus === 'active' && localStatus === 'active';

		// if we are both active and time elapsed is calculated.
		if (callActive) return `${timeElapsed}`;

		if (localStatus === 'active' && otherStatus === 'pending') return `calling..`;

		// If the other participant hanged up on us.
		if (otherStatus === 'hangedUp') return `Hanged up`;

		// If we are the caller..
		if (localData.role === 'caller') {
			// If the other participant is unreachable
			if (otherStatus === 'unreachable') return `User Unreachable`;

			// If the other participant is busy. (aka they rejected our call)
			if (otherStatus === 'busy') return `User Busy`;
		}

		// If we are participant
		if (localData.role === 'participant') {
			if (localData.status === 'pending') return `Incoming Call`;
		}

		// For debugging reasons
		return ``;
	};

	/**
	 * Start the player's phone ringtone.
	 */

	const startRingtone = () => {
		const ringtone = phoneCall.localInfo.ringtone;

		let ringtoneAudio: ExpectedAny = null;

		// If is a preset offered by our server
		if (ringtone.type == 'preset') {
			ringtoneAudio = `${__ASSETS__}/audios/phone/ringtones/${ringtone.value}.mp3`;
		}

		// TBD: Here to handle custom.

		// If ringtone audio is not valid or missing we will default to normal one.
		if (!ringtoneAudio || !validateAudioLink(ringtoneAudio)) {
			ringtoneAudio = `${__ASSETS__}/audios/phone/ringtones/default.mp3`;
		}

		// Play the audio
		playAudio(ringtoneAudio, {
			identifier: `phoneRingtone`,
			loop: true,
			volume: 1
		});

		// Update var
		setSoundsPlaying({ ...soundsPlaying, ringtone: true });
	};

	/**
	 * Stop the player's phone ringtone.
	 */

	const stopRingtone = () => {
		// Stop the audio
		stopAudio(`phoneRingtone`);

		// Update var
		setSoundsPlaying({ ...soundsPlaying, ringtone: false });
	};

	/**
	 *
	 * @param id The sound effect id
	 * Plays a sound effect to make the phone more real.
	 */

	const playSoundEffect = (id: 'calling' | 'hangedUp' | 'busy') => {
		let soundOptions: ExpectedAny = {
			identifier: `phoneCallSFX`,
			loop: true,
			volume: 1
		};

		let sourcePath = '';

		// If is the sound that we hear while we call someone..
		if (id === 'calling') {
			sourcePath = `${__ASSETS__}/audios/phone/call/calling.mp3`;
		}

		// If is the busy sound
		if (id === 'busy') {
			sourcePath = `${__ASSETS__}/audios/phone/call/busy.mp3`;
			soundOptions.loop = false;
		}

		// If is the "hanged up" sound
		if (id === 'hangedUp') {
			sourcePath = `${__ASSETS__}/audios/phone/call/callEnded.mp3`;
		}

		// Play the audio
		playAudio(sourcePath, soundOptions);

		// Save sounds..
		const newSounds = { ...soundsPlaying };
		newSounds[id] = true;
		setSoundsPlaying(newSounds);
	};

	/**
	 * Stops all sound effects playing.
	 */

	const stopSoundEfect = () => {
		// Stop the sound..
		stopAudio('phoneCallSFX');

		// Set all keys to false..
		const keys = Object.keys(soundsPlaying);
		const newSounds: ExpectedAny = { ...soundsPlaying };
		keys.forEach((key) => {
			newSounds[key] = false;
		});
		setSoundsPlaying(newSounds);
	};

	const PassedProps = {
		// Data
		localData: getParticipantData(true),
		participantData: getParticipantData(false),
		getParticipantData,
		// Overlay
		overlayActive,
		setOverlayActive,
		// Callbacks
		respondCall,
		hangUp,
		switchOverlayTheme,
		getCallStatusText,
		// Sounds
		playSoundEffect,
		startRingtone,
		stopRingtone,
		stopSoundEfect,
		soundsPlaying,
		soundsPlayingRef,
		// Minimal
		minimal,
		setMinimal,
		// Time Elapsed
		timeElapsed,
		setTimeElapsed,
		// Options
		setIsMuted,
		isMuted
	};

	// Get the component
	const Component: ExpectedAny = MapViews[minimal ? 'minimal' : 'fullScreen'];

	// If we have no phone call available data yet or is not active overlay, or we're missing a component we won't
	const ComponentVisible = phoneCall === null || overlayActive === false ? false : true;

	return (
		<Context.Provider value={PassedProps}>
			{ComponentVisible && (
				<div className={`phoneCall-overlay ${minimal ? 'minimal' : 'fullScreen'} `}>
					<Component />
				</div>
			)}
			<API />
		</Context.Provider>
	);
};

export default Component;
