import React, { useEffect, useState } from 'react';
import ReactDOM from 'react-dom';

// Language
import * as i18n from '@vmp/i18n';
import LanguagePack from './pairing.lang';
const languagePackId = `phone.vespifyMusic.player.pairing`;
i18n.createLanguagePack(languagePackId, LanguagePack);

// Dependencies
import { logError } from '@/utils/helpers';

// Context
import { VespifyMusicService } from '@/services/vespify/music';
import { AudioService } from '@/services/audio';

const Popout = (props: ExpectedAny) => {
	// Context needed
	const { getInstance, speakers } = VespifyMusicService();
	const { getInstance: getAudioInstance } = AudioService();

	// Get the instance data..
	const data = getInstance('phone.vespifyMusic');
	if (!data) return null; // Instance is not there yet.

	// Get the audio playing
	const audio = getAudioInstance(`vespify.music@${data.identifier}`);
	if (!audio) return null;

	// Language pack
	const lang = i18n.getLanguagePack(languagePackId, window.language);

	// Data
	const [list, setList] = useState([]);
	const [loading, setLoading] = useState(true);

	const onClickAway = (ev: ExpectedAny) => {
		// Get the click coordinates
		const clickX = ev.clientX;
		const clickY = ev.clientY;

		// Get the element at the click coordinates
		const clickedElements = document.elementsFromPoint(clickX, clickY);

		// He didn't click inside phone.
		const isWithinDevice = clickedElements.find(
			(c) => typeof c.className === 'string' && c.className.includes('phone-mockup')
		);

		if (!isWithinDevice) return false;

		const isWithinPopout = clickedElements.find(
			(c) => typeof c.className === 'string' && c.className.includes('component-popout container')
		);

		// He clicked inside popout.
		if (isWithinPopout) return false;

		props.dismissPopout();
	};

	const getSpeakersAvailable = async () => {
		try {
			setLoading(true);

			// Get the speakers
			const res = await window.rpc.callServer(`speakers@getDevices`);

			// Set the list
			setList(res);

			// Finished loading
			setLoading(false);
		} catch (err) {
			await logError(`phone.vespify.pairing.getDevices`, err);
			setLoading(false);
			setList([]);
		}
	};

	const handleConnection = async (speaker: ExpectedAny) => {
		try {
			if (loading) return false;

			// Are we already connected?
			const isAlreadyConnected = speakers.includes(speaker.id);

			// Execute event based on current state.
			window.rpc.triggerServer(
				`speakers@${isAlreadyConnected ? 'disconnect' : 'connect'}`,
				JSON.stringify({
					id: speaker.id,
					currentAudio: {
						volume: audio.preferences.volume,
						sourcePath: audio.sourcePath,
						paused: audio.preferences.paused,
						startTime: audio.controller.getCurrentTime()
					}
				})
			);
		} catch (err) {
			await logError(`phone.vespify.pairing.handleConnection`, err);
			return false;
		}
	};

	useEffect(() => {
		document.addEventListener('click', onClickAway);

		// Load the data..
		getSpeakersAvailable();

		return () => {
			document.removeEventListener('click', onClickAway);
		};
	}, []);

	// Get the element..
	const element = document.getElementsByClassName('component-view screen-player')[0];
	if (!element) return null;

	return ReactDOM.createPortal(
		<div className="component-popout pairing">
			<div className="container">
				<div className="header">Select device</div>
				<div className="content">
					<div className="entries">
						{list.map((c: ExpectedAny, ix) => (
							<div className={`entry`} key={ix} onClick={() => handleConnection(c)}>
								<div className="label">{c.label}</div>
								{speakers.includes(c.id) && (
									<div className={`connected`}>
										<i className="icon fa-light fa-link"></i>
									</div>
								)}
							</div>
						))}
						{list.length < 1 && <div className="entry">{lang.get('NoneAvailable')}</div>}
					</div>
				</div>
			</div>
		</div>,
		element
	);
};

const Button = () => {
	const [show, setShow] = useState(false);
	const { speakers } = VespifyMusicService();

	const showPopout = () => {
		setShow(!show);
	};

	return (
		<React.Fragment>
			<div className={`entry speakers ${speakers.length > 0 && 'active'}`} onClick={showPopout}>
				<i className="icon fa-solid fa-screencast"></i>
			</div>

			{/* When the button has been pressed.. */}
			{show && <Popout dismissPopout={() => setShow(false)} />}
		</React.Fragment>
	);
};

export default Button;
