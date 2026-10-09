import React from 'react';
import { ScreenState } from '../..';

// Components
import Description from './components/description';
import Comments from './components/comments';

const Component = () => {
	const { expandedModalId } = ScreenState();

	return (
		<React.Fragment>
			<div className={`section-modals ${expandedModalId && 'visible'}`}>
				<Description />
				<Comments />
			</div>
		</React.Fragment>
	);
};

export default Component;
