import React, { useEffect } from 'react';

// Components
import Entry from './entry/index';
import { VespifyMusicService } from '..';

// Context

const Component = () => {
	const { instances } = VespifyMusicService();

	return (
		<React.Fragment>
			{instances.map((instance: ExpectedAny, ix) => (
				<Entry data={instance} key={ix} />
			))}
		</React.Fragment>
	);
};

export default Component;
