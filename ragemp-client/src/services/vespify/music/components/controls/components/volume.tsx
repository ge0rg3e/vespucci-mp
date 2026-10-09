import React, { useState, useEffect } from 'react';
import { State } from '..';

// Dependencies
import Slider from 'rc-slider';
import { VespifyMusicService } from '@/services/vespify/music';

// Context for Audio
import { AudioControls } from '@/services/audio/components/controls';

// Variables
let speakerTimerId: ExpectedAny = null;

const Component = () => {
	const { data, audio, target } = State();
	const { speakers } = VespifyMusicService();

	// We need this for the local state
	const [draggingBar, setDragginBar] = useState(false);
	const [currentValue, setCurrentValue] = useState(audio.preferences.volume * 100);

	// Audio Dependencies
	const { setVolume } = AudioControls();

	const onFinishedDragging = () => {
		setDragginBar(false);
		setVolume(audio.identifier, currentValue / 100);

		// If we are connected to speakers.
		if (target === 'player' && speakers.length > 0) {
			// If the timer is already on its way we cancel it
			if (speakerTimerId !== null) {
				// Reset it
				speakerTimerId = null;

				// Clear it
				clearTimeout(speakerTimerId);
			}

			// If we are connected to speakers let's inform our speakers that we changed the volume.
			speakerTimerId = setTimeout(() => {
				window.rpc.triggerServer(`speakers@setVolume`, JSON.stringify({ volume: currentValue / 100 }));
			}, 1000);
		}
	};

	// @Event: This is needed to keep them in sync.
	useEffect(() => {
		if (draggingBar) return; // We don't want to bug out while dragging.
		setCurrentValue(audio.preferences.volume * 100);
	}, [audio.preferences.volume]);

	return (
		<React.Fragment>
			<div className="component-volume-bar">
				<div className="icon left">
					<i className="elm fa-solid fa-volume-off"></i>
				</div>
				<div className="slider">
					<Slider
						value={currentValue}
						disabled={data.loading || audio.loaded === false}
						onBeforeChange={() => setDragginBar(true)}
						onAfterChange={onFinishedDragging}
						onChange={(value) => setCurrentValue(value)}
						max={100}
						min={0}
					/>
				</div>
				<div className="icon right">
					<i className="elm fa-solid fa-volume"></i>
				</div>
			</div>
		</React.Fragment>
	);
};

export default Component;
