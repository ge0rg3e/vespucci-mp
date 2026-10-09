import React, { useEffect, useState } from 'react';
import ReactDOM from 'react-dom';

// Contexts
import { AppState } from '@/views/phone/applications/vespifyMusic';
import { VespifyMusicService } from '@/services/vespify/music';

// Language
import * as i18n from '@vmp/i18n';
import LanguagePack from './options.lang';
const languagePackId = `phone.vespifyMusic.player.options`;
i18n.createLanguagePack(languagePackId, LanguagePack);

const Popout = (props: ExpectedAny) => {
	const { pushScreen } = AppState();

	// Context dependencies for Vespify Music
	const { getInstance } = VespifyMusicService();

	// Language pack
	const lang = i18n.getLanguagePack(languagePackId, window.language);

	// Get the instance data..
	const data = getInstance('phone.vespifyMusic');
	if (!data) return null; // Instance is not there yet.

	const goToArtist = () => {
		pushScreen('artist', { id: data.currentSong.artistId });
	};

	const goToAlbum = () => {
		pushScreen('album', { id: data.currentSong.albumId });
	};

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

	useEffect(() => {
		document.addEventListener('click', onClickAway);

		return () => {
			document.removeEventListener('click', onClickAway);
		};
	}, []);

	// Get the element..
	const element = document.getElementsByClassName('component-view screen-player')[0];
	if (!element) return null;

	return ReactDOM.createPortal(
		<div className="component-popout options">
			<div className="container">
				<div className="content">
					<div className="header">Options</div>

					<div className="entries">
						<div className="entry" onClick={goToArtist}>
							{lang.get('goToArtist')}
						</div>
						<div className="entry" onClick={goToAlbum}>
							{lang.get('goToAlbum')}
						</div>
					</div>
				</div>
			</div>
		</div>,
		element
	);
};

const Button = () => {
	const [show, setShow] = useState(false);

	const showPopout = () => {
		setShow(!show);
	};

	return (
		<React.Fragment>
			<div className="entry" onClick={showPopout}>
				<i className="icon fa-regular fa-ellipsis-vertical"></i>
			</div>
			{/* When the button hasb een pressed.. */}
			{show && <Popout dismissPopout={() => setShow(false)} />}
		</React.Fragment>
	);
};

export default Button;
