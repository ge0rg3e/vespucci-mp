import React, { useEffect, useState } from 'react';
import { ButtonBase } from '@mui/material';

// Context
import { AudioControls } from '@/services/audio/components/controls';

const Component = () => {
	const { setPaused } = AudioControls();

	const [enabled, setEnabled] = useState(false);

	const checkCurrentMusic = async () => {
		if (window.mp.fake) return false;
		const welcomeMusicMuted: ExpectedAny = await window.rpc.callClient(
			'getLocalStorage',
			JSON.stringify({ id: `welcomeMusicMuted` })
		);

		setEnabled(welcomeMusicMuted === true ? false : true);
	};

	useEffect(() => {
		checkCurrentMusic();
	}, []);

	const switchMusicMuted = async () => {
		const newState = !enabled;
		setEnabled(newState);

		// Update current paused state
		setPaused(`welcomeMusic`, !newState);

		// Update player meta..
		window.rpc.triggerClient(
			`updateLocalStorage`,
			JSON.stringify({
				key: `welcomeMusicMuted`,
				payload: newState ? false : true
			})
		);
	};

	return (
		<React.Fragment>
			<ButtonBase className="control-music" onClick={switchMusicMuted}>
				<i className={`icon fa-solid ${enabled ? 'fa-volume' : 'fa-volume-xmark'}`}></i>
			</ButtonBase>
		</React.Fragment>
	);
};

export default Component;
