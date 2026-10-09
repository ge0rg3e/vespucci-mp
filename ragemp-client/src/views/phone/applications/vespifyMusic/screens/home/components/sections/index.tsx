import React from 'react';

// Components
import Entry from './components/entry';
import { VespifyMusicService } from '@/services/vespify/music';

const Component = (props: ExpectedAny) => {
	const { getInstance } = VespifyMusicService();

	// Check if we have a current song.
	const currentInstance = getInstance('phone.vespifyMusic');

	return (
		<React.Fragment>
			<div className={`sections ${currentInstance && 'has-current-song'}`}>
				{props.data.map((section: ExpectedAny, ix: number) => (
					<Entry title={section.title} entries={section.entries} key={ix} />
				))}
			</div>
		</React.Fragment>
	);
};

export default Component;
