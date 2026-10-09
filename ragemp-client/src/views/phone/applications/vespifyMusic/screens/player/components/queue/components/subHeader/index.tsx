import React from 'react';

// Components
import { Switch } from '@mui/material';

// Dependencies
import { truncateString } from '@/utils/helpers';
import { setGameLocalStorage } from '@/views/phone/utils/helpers';

// Language
import * as i18n from '@vmp/i18n';
const languagePackId = `phone.vespifyMusic.player.queue`;

// Context
import { VespifyMusicService } from '@/services/vespify/music';
import { AudioService } from '@/services/audio';

const Component = (props: ExpectedAny) => {
	// Get instance
	const { getInstance, updateControls } = VespifyMusicService();
	const { getInstance: getAudioInstance } = AudioService();

	// Get the instance data..
	const data = getInstance('phone.vespifyMusic');
	if (!data) return null; // Instance is not there yet.

	// Language pack
	const lang = i18n.getLanguagePack(languagePackId, window.language);

	// Get the audio
	const audio = getAudioInstance(`vespify.music@${data.identifier}`);
	if (!audio) return null;

	const getPlayingFrom = () => {
		if (data.metadata.type === 'song') return truncateString(data.metadata.title, 40, true);

		const type = data.metadata.type === 'album' ? 'Album' : 'Playlist';

		return `${data.metadata.title} (${type})`;
	};

	const updateAutoplay = () => {
		const newState = !data.controls.autoplay;

		// Update controls
		updateControls(data.identifier, { autoplay: newState });

		//  Update ragemp - @Reminder this is in two places.
		setGameLocalStorage(`phone.vespifyMusic`, {
			volume: audio.preferences.volume,
			autoplay: newState
		});
	};
	if (props.type === 'recommendations') {
		return (
			<React.Fragment>
				<div className="sub-component-sub-header">
					<div className="left-side">
						<div className="label">{lang.get('AutoPlay:Heading')}</div>
						<div className="value">{lang.get('AutoPlay:Description')}</div>
					</div>
					<div className="right-side">
						<Switch
							className={`autoplay-switch ${data.controls.autoplay && 'enabled'}`}
							checked={data.controls.autoplay}
							size="small"
							onClick={updateAutoplay}
						/>
					</div>
				</div>
			</React.Fragment>
		);
	}

	return (
		<React.Fragment>
			<div className="sub-component-sub-header">
				<div className="left-side">
					<div className="label">{lang.get('PlayingFrom')}</div>
					<div className="value">{getPlayingFrom()}</div>
				</div>
			</div>
		</React.Fragment>
	);
};

export default Component;
