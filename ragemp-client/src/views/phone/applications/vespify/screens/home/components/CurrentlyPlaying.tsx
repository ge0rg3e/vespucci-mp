import React, { useEffect } from 'react';

// Context
import { VespifyService } from '@/services/vespify/videos';
import { truncateString } from '@/utils/helpers';
import { AppState } from '../../..';

const Component = () => {
	const { setScreen } = AppState();

	// when instance changes the video we must update this
	const { getInstance, deleteInstance } = VespifyService();

	// Get the instance playing
	const instance = getInstance('phone.vespify');

	// If nothing is playing.
	if (!instance) return null;

	const goToVideo = () => {
		setScreen({ id: 'video', payload: { id: instance.metadata.id } });
	};

	const closeVideo = () => {
		// Delete instance
		deleteInstance('phone.vespify');
	};

	// check if instance.stream is called when controls are updated
	return (
		<React.Fragment>
			<div className="component-banner-currently-playing">
				<div
					className="thumbnail"
					onClick={goToVideo}
					style={{
						backgroundImage: `url("${instance.metadata.thumbnail}")`
					}}
				></div>
				<div className="details" onClick={goToVideo}>
					<div className="title">{truncateString(instance.metadata.title, 45)}</div>
					<div className="author">{instance.metadata.author.name}</div>
				</div>
				<div className="actions">
					<div className="entry" onClick={goToVideo}>
						<i className=" icon fa-solid fa-play"></i>
					</div>
					<div className="entry" onClick={closeVideo}>
						<i className="icon fa-sharp fa-solid fa-xmark"></i>
					</div>
				</div>
			</div>
		</React.Fragment>
	);
};

export default Component;
