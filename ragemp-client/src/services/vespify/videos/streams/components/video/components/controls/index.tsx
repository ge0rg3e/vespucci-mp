import React, { useEffect } from 'react';

// Components
import MiddleControls from './components/middleControls';
import BottomBar from './components/bottomBar';
import Buttons from './components/buttons';
import MuteWarning from './components/muteWarning';

// Context
import { ComponentContext } from '../..';
import { VespifyService } from '@/services/vespify/videos';

const Component = () => {
	const { instance, showControls, showControlsRef, setShowControls } = ComponentContext();
	const { getInstance } = VespifyService();

	const onClickAway = (ev: ExpectedAny) => {
		if (!showControlsRef.current) return false;

		// Get data ref..
		const refData: ExpectedAny = getInstance(instance.identifier, true);

		// Check if video is now inside phone.
		const isWindowMode = refData.elementIdDestination !== `phone-app-vespify::video-player`;

		// Get the click coordinates
		const clickX = ev.clientX;
		const clickY = ev.clientY;

		// Get the element at the click coordinates
		const clickedElements = document.elementsFromPoint(clickX, clickY);

		// If is inside phone..
		if (!isWindowMode) {
			// He didn't click inside phone.
			const isWithinDevice = clickedElements.find(
				(c) => typeof c.className === 'string' && c.className.includes('phone-mockup')
			);
			if (!isWithinDevice) return false;
		}

		const isWithinControls = clickedElements.find(
			(c) => typeof c.className === 'string' && c.className.includes('component-controls')
		);

		// He clicked inside controls to hide it
		if (ev.target.className === `--container` && isWithinControls) {
			setShowControls(false);
			return false;
		}

		// He clicked inside controls. (Meaning: buttons, volume bar etc.)
		if (isWithinControls) return false;

		// He clicked on progress bar.
		const isProgressBar = clickedElements.find(
			(c) => typeof c.className === 'string' && c.className.includes('component-progress-bar')
		);
		if (isProgressBar) return false;

		setShowControls(false);
	};

	useEffect(() => {
		document.addEventListener('click', onClickAway);

		return () => {
			document.removeEventListener('click', onClickAway);
		};
	}, []);

	return (
		<React.Fragment>
			<div className={`component-controls ${showControls && 'visible'}`}>
				<div className="--container">
					<MiddleControls />
					<BottomBar />
					<Buttons />
				</div>
			</div>
			<MuteWarning />
		</React.Fragment>
	);
};

export default Component;
