import React, { createContext, useContext, useState } from 'react';

// Components
import LockScreenHeader from './components/lockscreeen-header';
import Reapeat from './components/buttons/reapeat';
import Playback from './components/buttons/playback';
import Backward from './components/buttons/backward';
import Forward from './components/buttons/forward';
import Shuffle from './components/buttons/shuffle';
import ProgressBar from './components/progressBar';
import Volume from './components/volume';
import Times from './components/times';

// Music Context
import { Instance } from '@/services/vespify/music/types/context';

// Audio Context
import { Instance as AudioInstance } from '@/services/audio/utils/types';

// Context
const Context = createContext({});
export const State: ExpectedAny = () => useContext(Context);

const Component = (props: Props) => {
	// Anti navigation spam
	const [antiNavigationSpam, setAntiNavigationSpam] = useState(false);

	return (
		<Context.Provider value={{ ...props, antiNavigationSpam, setAntiNavigationSpam }}>
			<div className={`component-vespify-music ${props.target}-controls`}>
				<div className="container">
					{props.target === 'lockscreen' && <LockScreenHeader />}
					<ProgressBar />
					<Times />
					<div className="buttons">
						{props.showShuffle && <Shuffle />}
						<Backward />
						<Playback />
						<Forward />
						{props.showReapeat && <Reapeat />}
					</div>
					<Volume />
				</div>
			</div>
		</Context.Provider>
	);
};

type Props = {
	target: 'lockscreen' | 'player';
	data: Instance;
	audio: AudioInstance;
	showReapeat?: boolean;
	showShuffle?: boolean;
};
export default Component;
