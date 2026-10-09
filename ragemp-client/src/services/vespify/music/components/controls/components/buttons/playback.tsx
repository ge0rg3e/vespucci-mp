import { State } from '../..';
import { conditionalClassNames } from '@/utils/helpers';

// Context
import { VespifyMusicService } from '../../../..';
import { AudioControls } from '@/services/audio/components/controls';

// Variables
let speakerTimerId: ExpectedAny = null;

const Component = () => {
	const { setPaused } = AudioControls();
	const { data, audio } = State();
	const { speakers } = VespifyMusicService();

	const onClick = () => {
		// Get the new state
		const paused = !audio.preferences.paused;

		// Set the paused state
		setPaused(`vespify.music@${data.identifier}`, paused);

		// If we are connected to speakers
		if (speakers.length > 0) {
			// If the timer is already on its way we cancel it
			if (speakerTimerId !== null) {
				// Reset it
				speakerTimerId = null;

				// Clear it
				clearTimeout(speakerTimerId);
			}

			// Inform the speakers that is now paused.
			speakerTimerId = setTimeout(() => {
				window.rpc.triggerServer(`speakers@setPaused`, JSON.stringify({ paused }));
			}, 1000);
		}
	};

	return (
		<div
			className={conditionalClassNames('entry playback', [
				{ if: data.loading || !audio.loaded, class: 'disabled inactive' }
			])}
			onClick={onClick}
		>
			<i className={`icon fa-solid ${audio.preferences.paused ? 'fa-play' : 'fa-pause'}`}></i>
		</div>
	);
};

export default Component;
