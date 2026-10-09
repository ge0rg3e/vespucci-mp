import React from 'react';

// Sections
import Gameplay from './sections/gameplay';
import Audio from './sections/audio';
import Chats from './sections/chats';
import Hotkeys from './sections/hotkeys';

const Component = () => {
	return (
		<React.Fragment>
			<Gameplay />
			<Audio />
			<Chats />
			<Hotkeys />
		</React.Fragment>
	);
};

export default Component;
