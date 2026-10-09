import React from 'react';

// Components
import Video from './components/video';

// Context
import { VespifyService } from '../';
import { Instance } from '../types/context';

const Component = () => {
	const { instances } = VespifyService();

	return (
		<React.Fragment>
			<div id="services::vespify-videos" className="services-vespifyVideos">
				{instances.map((entry: Instance, index: number) => (
					<Video identifier={entry.identifier} key={index} />
				))}
			</div>
		</React.Fragment>
	);
};

export default Component;
