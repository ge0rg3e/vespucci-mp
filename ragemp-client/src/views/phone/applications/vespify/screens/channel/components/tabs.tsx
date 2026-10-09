import React from 'react';
import { ScreenState } from '..';

const Component = () => {
	const { lang } = ScreenState();
	return (
		<React.Fragment>
			<div className="component-tabs">
				<div className="text">{lang.get('videosHeading')}</div>
			</div>
		</React.Fragment>
	);
};

export default Component;
