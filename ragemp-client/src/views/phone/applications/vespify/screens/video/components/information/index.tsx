import React from 'react';

// Components
import Details from './components/details';
import Buttons from './components/buttons';
import HighlightedComment from './components/commentHighlight';
import NextVideos from './components/nextVideos';

// Context
import { ScreenState } from '../..';

const Component = () => {
	const { expandedModalId } = ScreenState();
	return (
		<React.Fragment>
			<div
				className={`section-information ${expandedModalId && 'modalVisible'}`}
				id="vespify.section-information"
			>
				<Details />
				<Buttons />
				<HighlightedComment />
				<NextVideos />
			</div>
		</React.Fragment>
	);
};

export default Component;
