import React, { useEffect } from 'react';

// Context
import { AppContext } from '@/utils/context';
import { ComponentState } from '..';

// Dependencies
import { isNativePhoneRoute } from '@/views/phone/utils/helpers';
import { PhoneState } from '@/views/phone';
import { getTimeElapsed } from '@/utils/helpers';

// Response
import Response from '../utils/response';

// Timer
let hangoutTimerAutomatic: ExpectedAny = null;
let rejectTimer: ExpectedAny = null;
let timerElapsed: ExpectedAny = null;

const Component = () => {
	const { playSoundEffect, startRingtone, stopRingtone, stopSoundEfect } = ComponentState();
	const { getParticipantData, setTimeElapsed, soundsPlaying, setIsMuted } = ComponentState();
	const { hangUp, respondCall, minimal, setMinimal, setOverlayActive } = ComponentState();
	const { phoneCall, phoneCallRef, setPhoneCall } = AppContext();
	const { routeRef, setUiState } = PhoneState();
	const { soundsPlayingRef } = ComponentState();

	/**
	 * Callback to when call data is changed. we must play the right sounds accordingly.
	 */

	const soundsCallback = () => {
		// Get local data
		const localData: phoneLineParticipant = phoneCall.participants.find(
			(c: ExpectedAny) => c._isLocalPlayer === true
		);
		const otherData: phoneLineParticipant = phoneCall.participants.find(
			(c: ExpectedAny) => c._isLocalPlayer === false
		);

		// Shortcuts
		const localStatus = localData.status;
		const localRole = localData.role;
		const otherStatus = otherData.status;

		// If the other person just hanged up on us we
		if (localStatus === 'active' && otherStatus === 'hangedUp' && !soundsPlaying.hangedUp) {
			playSoundEffect('hangedUp');
		}

		// If someone calls us
		if (localStatus === 'pending' && localRole === 'participant' && !soundsPlaying.ringtone) {
			startRingtone();
		}

		// If we are participant, we just responded to this call we should stop the phone ringing.
		if (localRole === 'participant' && localStatus === 'active' && soundsPlaying.ringtone) {
			stopRingtone();
		}

		// If we are the caller and we're calling someone and waiting for him to answer.
		if (localRole === 'caller' && otherStatus === 'pending' && !soundsPlaying.calling) {
			playSoundEffect('calling');
		}

		// If we were calling someone and now he replied we need to stop that sound effect.
		if (localRole === 'caller' && soundsPlaying.calling) {
			stopSoundEfect();
		}

		// If the other party is unavailable or busy
		if (['unreachable', 'busy'].includes(otherStatus) && !soundsPlaying.busy) {
			playSoundEffect('busy');
		}
	};

	/**
	 *  Callback when the server sents us new data.
	 */

	const onDataReceived = (args: string) => {
		const { id, participants, localInfo = {} } = JSON.parse(args);

		// Set the data..
		setPhoneCall({ id, participants, localInfo });

		// Get local data
		const localData: phoneLineParticipant = participants.find((c: ExpectedAny) => c._isLocalPlayer === true);
		const otherData: phoneLineParticipant = participants.find((c: ExpectedAny) => c._isLocalPlayer === false);

		// If the other person just hanged up on us we will hang up too in 3 seconds
		if (localData.status === 'active' && otherData.status === 'hangedUp') {
			hangoutTimerAutomatic = setTimeout(() => {
				// Callback function
				hangUp(true);

				// Reset timer id
				hangoutTimerAutomatic = null;
			}, 3000);
		}

		// If the other person is busy or unreachable.
		if (localData.status === 'active' && ['unreachable', 'busy'].includes(otherData.status)) {
			hangoutTimerAutomatic = setTimeout(() => {
				// Callback function
				hangUp(true);

				// Reset timer id
				hangoutTimerAutomatic = null;
			}, 3000);
		}

		// If someone calls us we will automatically reject in 15 seconds with a reject if we don't answer.
		if (localData.status === 'pending' && localData.role === 'participant') {
			rejectTimer = setTimeout(() => {
				// Callback function
				respondCall(false);

				// Reset timer ID
				rejectTimer = null;
			}, 15000);
		}

		// If we were pending and now we responded..
		if (localData.status === 'active' && rejectTimer !== null) {
			// Clear timeout
			clearTimeout(rejectTimer);

			// Reset timer id
			rejectTimer = null;
		}
	};

	/**
	 * Asks the server to send us call data.
	 */

	const requestData = () => {
		// Ask server for the data.
		window.rpc.triggerServer(`phone:requestCallData`);
	};

	/**
	 *  Set the overlay state state. If false the whole interface doesn't show anymore.
	 */

	const setOverlayState = (args: string) => {
		const { active } = JSON.parse(args);

		// If overlay is now active and we have no data available.
		if (active === true && phoneCallRef.current === null) {
			// Ask the server for the data..
			requestData();
		}

		if (active === true) {
			// If is on native routes we want full screen call.
			const isNativeRoute = isNativePhoneRoute(routeRef.current.id);

			// Set the response
			setMinimal(isNativeRoute ? false : true);
		}

		// We now clear this data if we finished the call interface.
		if (active === false) {
			setPhoneCall(null); // Clearing data.

			// Stop ringing if it was active
			if (soundsPlayingRef.current.ringtone) {
				stopRingtone();
			}

			// Stop any sound effect in case we have any on loop.
			stopSoundEfect();
		}

		// Set overlay state overall..
		setOverlayActive(active);
	};

	/**
	 * Updates the timing countdown since you joined the call.
	 */

	const updateTimeElapsed = () => {
		// Get the local data..
		const localData = getParticipantData(true, true);

		// If we don't have a joined at date yet (we get one when we become active)
		if (!localData || !localData.joinedAt) return false;

		// Get local data
		const date: ExpectedAny = new Date(localData.joinedAt);

		// If we got back invalid date
		if (isNaN(date)) return false;

		// Get time elapsed
		const value = getTimeElapsed(date);

		// Update..
		setTimeElapsed(value);
	};

	/**
	 * This is needed to simulate on localhost.
	 */

	const startDevSimulation = () => {
		setTimeout(() => {
			// Set this active true to see it.
			setOverlayActive(true);

			// Preparing simulated data...
			const ResponseChanged = {
				...Response,
				participants: Response.participants.map((c) => ({
					...c,
					joinedAt: new Date().toISOString()
				}))
			};

			// Simulate the data
			onDataReceived(JSON.stringify(ResponseChanged));

			// Set the minimalistic too
			setMinimal(window.location.href.includes('minimal=true') ? true : false);
		}, 1000);
	};

	const onCallEndedResets = () => {
		setTimeElapsed('00:00');
		setIsMuted(false);
	};

	useEffect(() => {
		if (phoneCall !== null) {
			// We need to manage the sounds whenever data changes.
			soundsCallback();
		}

		if (phoneCall === null) {
			// Reset the values
			onCallEndedResets();
		}
	}, [phoneCall]);

	// Hide original close line when fullscreen so we can minimize fullscreen phonecall.
	useEffect(() => {
		if (phoneCall) {
			setUiState('closeLineVisible', minimal === true ? true : false);
		} else {
			setUiState('closeLineVisible', true);
		}
	}, [minimal, phoneCall]);

	useEffect(() => {
		window.rpc.on('phoneCall:setOverlayState', setOverlayState);
		window.rpc.on('phoneCall:refreshData', requestData);
		window.rpc.on('phone:setCallData', onDataReceived);

		// Countdown for the joinedAt for local participant.
		timerElapsed = setInterval(updateTimeElapsed, 1000);

		if (window.mp.fake && window.location.href.includes(`simulateCall=true`)) {
			startDevSimulation();
		}

		return () => {
			window.rpc.off('phoneCall:setOverlayState', setOverlayState);
			window.rpc.off('phoneCall:refreshData', requestData);
			window.rpc.off('phone:setCallData', onDataReceived);

			// Clearing these out.
			if (hangoutTimerAutomatic !== null) {
				// Clear timeout
				clearTimeout(hangoutTimerAutomatic);

				// Reset timer id
				hangoutTimerAutomatic = null;
			}

			if (rejectTimer !== null) {
				// Clear timeout
				clearTimeout(rejectTimer);

				// Reset timer id
				rejectTimer = null;
			}

			if (timerElapsed !== null) {
				// Clear interval
				clearInterval(timerElapsed);

				// Reset timer id
				timerElapsed = null;
			}
		};
	}, []);

	return null;
};

export default Component;
