import React, { useState, useEffect } from 'react';
import { State } from '..';

// Dependencies
import Slider from 'rc-slider';
import { formatSecondsToTimeElapsed } from '@/utils/helpers';

// Context for Music
import { VespifyMusicControls } from '@/services/vespify/music/utils/controls';
import { VespifyMusicService } from '../../..';

// Context for Audio
import { AudioControls } from '@/services/audio/components/controls';

// Variables
let speakerTimerId: ExpectedAny = null;

const Component = () => {
	const { data, audio } = State();

	// We need this for the local state
	const [elapsed, setElapsed] = useState(0);
	const [draggingBar, setDragginBar] = useState(false);

	// Music Dependencies
	const { getCurrentSongFromQueue } = VespifyMusicControls();
	const { speakers } = VespifyMusicService();

	// Audio Dependencies
	const { setCurrentTime } = AudioControls();

	const getTotalDuration = () => {
		const song = getCurrentSongFromQueue(data.identifier);
		if (!song) return 0;
		return song.duration;
	};

	const onFinishedDragging = () => {
		setCurrentTime(audio.identifier, elapsed);
		setDragginBar(false);

		// If we are connected to speakers.
		if (speakers.length > 0) {
			// If the timer is already on its way we cancel it
			if (speakerTimerId !== null) {
				// Reset it
				speakerTimerId = null;

				// Clear it
				clearTimeout(speakerTimerId);
			}

			// Sync to the speakers too.\
			speakerTimerId = setTimeout(() => {
				window.rpc.triggerServer(`speakers@setCurrentTime`, JSON.stringify({ value: elapsed }));
			}, 1000);
		}
	};

	// @Event: This is needed to keep them in sync.
	useEffect(() => {
		if (draggingBar) return; // We don't want to bug out while dragging.
		setElapsed(audio.currentTime);
	}, [audio.currentTime]);

	return (
		<React.Fragment>
			<div className="component-progress-bar">
				<div className="slider">
					<Slider
						value={elapsed}
						disabled={data.loading}
						onBeforeChange={() => setDragginBar(true)}
						onAfterChange={onFinishedDragging}
						onChange={(value) => setElapsed(value)}
						max={getTotalDuration()}
						min={0}
					/>
				</div>
			</div>
		</React.Fragment>
	);
};

export default Component;
