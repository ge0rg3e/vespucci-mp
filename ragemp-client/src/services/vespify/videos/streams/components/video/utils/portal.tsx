import React, { useEffect } from 'react';
import ReactDOM from 'react-dom';

// Components
import VideoSource from '../components/source';
import Controls from '../components/controls';
import ProgressBar from '../components/progressBar';

// Context
import { ComponentContext } from '..';
import { VespifyService } from '@/services/vespify/videos';

// Variable dependencies
let mountingTimerId: ExpectedAny = null;

const Component = () => {
	const { instance, showControls, setShowControls, failedToLoad } = ComponentContext();
	const { destinationDomID, setDestiationDomID } = ComponentContext();
	const { updateControls } = VespifyService();

	/**
	 * This function will ensure that the new dom exists and save the props from the old video playe.r
	 */

	const onInstanceDestinationDomChanged = () => {
		// Get the dest id
		let destId = instance.elementIdDestination || 'services::vespify-videos'; // If is null we'll play it in background.

		// Check element exists
		const elementExists: ExpectedAny = document.getElementById(destId);
		if (!elementExists) return false;

		// Update instance again to loaded false since the video will be unloaded.
		updateControls(instance.identifier, {
			loaded: false
		});

		// Set the new dom
		setDestiationDomID(destId);

		return true;
	};

	// Whenever the instance dom id is changed we do this.
	useEffect(() => {
		// We change the dom then..
		onInstanceDestinationDomChanged();
	}, [instance.elementIdDestination]);

	// When they click on the video we need to show the controls.
	const onVideoIsClicked = () => {
		if (showControls) return false;
		setShowControls(true);
	};

	const getFailedToLoadMessage = () => {
		if (window.language === 'RO') return `Uploader-ul nu a făcut acest videoclip disponibil în țara ta.`;

		// Default english
		return `The uploader has not made this video available in your country.`;
	};

	// @Bugfix This safety is required to make sure the createPortal doesn't throw an error.
	if (!document.getElementById(destinationDomID)) return null;

	return ReactDOM.createPortal(
		<React.Fragment>
			<div
				id="global-component::ytb-video"
				className={`global-component-ytb-video ${instance.controls.loaded ? 'loaded' : 'not-loaded'}`}
			>
				<div onClick={onVideoIsClicked} className={`media`}>
					<VideoSource />
					{instance.controls.loaded && !instance.controls.error && (
						<React.Fragment>
							<Controls />
						</React.Fragment>
					)}
					{instance.controls.error && (
						<div className="--component-failed-loading">{getFailedToLoadMessage()}</div>
					)}
				</div>
				<ProgressBar />
			</div>
		</React.Fragment>,
		document.getElementById(destinationDomID)!
	);
};

export default Component;
