import React from 'react';
import { ComponentContext } from '../../..';
import { VespifyService } from '@/services/vespify/videos';

const Component = () => {
	const { instance } = ComponentContext();
	const { updateControls, deleteInstance } = VespifyService();

	// This function checks WHEN the video player should show the X button.
	const showCloseButton = () => {
		// When is in miniplayer for vespify
		if (
			instance.elementIdDestination === `services::vespify-miniPlayer` &&
			instance.identifier === 'phone.vespify'
		)
			return true;

		return false;
	};

	const closeVideo = () => {
		// Dispatch an event so the video screen of vespify app (and others maybe) know to do certain actions when they kill the video
		document.dispatchEvent(
			new CustomEvent(`services.vespify@onVideoClosed`, {
				detail: {
					instance
				}
			})
		);

		// Kill the instance
		deleteInstance(instance.identifier);
	};

	return (
		<React.Fragment>
			<div className="buttons">
				<div
					className={`entry ${instance.controls.loop ? 'enabled' : 'disabled'}`}
					onClick={() =>
						updateControls(instance.identifier, {
							loop: !instance.controls.loop
						})
					}
				>
					<i className="icon fa-regular fa-repeat"></i>
				</div>
				<div
					className={`entry ${instance.controls.miniPlayer ? 'enabled' : 'disabled'}`}
					onClick={() =>
						updateControls(instance.identifier, {
							miniPlayer: !instance.controls.miniPlayer
						})
					}
				>
					<i className="icon fa-regular fa-browsers"></i>
				</div>

				{showCloseButton() && (
					<div className={`entry close-button`} onClick={closeVideo}>
						<i className="icon fa-regular fa-xmark"></i>
					</div>
				)}
			</div>
		</React.Fragment>
	);
};

export default Component;
