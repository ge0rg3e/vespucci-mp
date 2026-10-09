import { AudioService } from '@/services/audio';
import { useStateRef } from '@/utils/helpers';
import { useEffect, useState } from 'react';

let TimerID: ExpectedAny = null;
const WritingSpeed = 60;

export const useTypeWriter = ({ innerRef, text, soundEffect }: Props) => {
	const [displayText, setDisplayText] = useState('');
	const { stopAudio, playAudio } = AudioService();
	const [_, setIsWriting, isWritingRef] = useStateRef(true);
	const [__, setTextRendered, textRenderedRef] = useStateRef(text);

	// A simple function to clear timers.
	const clearTimer = () => {
		if (TimerID !== null) {
			clearInterval(TimerID);
			TimerID = null;
		}
	};

	useEffect(() => {
		setTextRendered(text);
	}, [text]);

	useEffect(() => {
		let i = 0;

		// Clear timeout first in case the text just changed.
		clearTimer();

		// Reset these when the text has changed.
		setDisplayText('');
		stopAudio('typeWriter');

		// Star the timer that writes it..
		TimerID = setInterval(() => {
			setIsWriting(true);

			// If we haven't finished yet to write down all the text..
			if (i < text.length) {
				// Update text..
				setDisplayText((prevText) => prevText + text.charAt(i));

				// Play audio..
				playAudio(soundEffect, { volume: 0.2, identifier: 'typeWriter' });

				// Woompa.
				i++;
			} else {
				// It's all finished let's clear the timer.
				clearTimer();

				// And we mark as writing false.
				setIsWriting(false);
			}
		}, WritingSpeed);

		return () => {
			clearTimer();
		};
	}, [text]);

	useEffect(() => {
		innerRef.current = {
			isWritingRef: isWritingRef,
			finishWriting: () => {
				// Stop Audio
				stopAudio('typeWriter');

				// Set the text
				setDisplayText(textRenderedRef.current);
				console.log('Text here', {
					text,
					textRendered: textRenderedRef.current
				});
				// Mark the dependencies..
				setIsWriting(false);
				clearTimer();

				console.log('is writing now false');
			}
		};
	}, []);

	return displayText;
};

type Props = {
	innerRef: ExpectedAny;
	text: string;
	soundEffect: string;
};
