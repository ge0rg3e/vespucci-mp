import React, { useEffect } from 'react';
import { HudState } from '../..';
import { removeDiacritics, useStateRef } from '@/utils/helpers';

let countdownTimer: ExpectedAny = null;
let hideTimer: ExpectedAny = null;

const Component = () => {
	const { isDarkEnvironment } = HudState();

	const [data, setData, dataRef] = useStateRef(null);

	const executeCountdown = () => {
		if (dataRef.current === null) return false;

		// Calculate..
		let newSeconds = parseFloat((dataRef.current.secondsLeft - 0.1).toFixed(2));

		// Update data
		setData({ ...dataRef.current, secondsLeft: newSeconds });

		// If is less than 1
		if (newSeconds === 0) {
			hideProgressBar();
		}
	};

	const showProgressBar = (args: string) => {
		const { label, seconds } = JSON.parse(args);

		setData({
			// Text text
			label,
			// How many seconds are left
			secondsLeft: seconds,
			// How many seconds were there
			secondsExpected: seconds
		});

		countdownTimer = setInterval(executeCountdown, 100);
	};

	const hideProgressBar = () => {
		// Hide after we see full 100%
		hideTimer = setTimeout(() => setData(null), 1000);

		if (countdownTimer !== null) {
			// Clear interval
			clearInterval(countdownTimer);

			// Reset timer id
			countdownTimer = null;
		}
	};

	useEffect(() => {
		window.rpc.on(`progressBar:show`, showProgressBar);
		window.rpc.on(`progressBar:hide`, hideProgressBar);

		return () => {
			window.rpc.off(`progressBar:show`, showProgressBar);
			window.rpc.off(`progressBar:hide`, hideProgressBar);

			if (countdownTimer !== null) {
				// Clear interval
				clearInterval(countdownTimer);

				// Clear timer id
				countdownTimer = null;
			}
		};
	}, []);

	function getPercentage(secondsLeft: number, originalSeconds: number) {
		// Calculate the percentage of time that has passed
		const percentage = ((originalSeconds - secondsLeft) / originalSeconds) * 100;

		// Ensure the percentage is within the 0-100 range
		return Math.min(100, Math.max(0, percentage));
	}

	if (data === null) return null;

	const percent = getPercentage(data.secondsLeft, data.secondsExpected);

	return (
		<React.Fragment>
			<div className={`hud-progressBar ${isDarkEnvironment && `dark-mode`}`}>
				<div className="container">
					<div className="label">{removeDiacritics(data.label)}</div>
					<div className="bar">
						<div
							className="value"
							style={{
								width: `${percent}%`
							}}
						>
							<div className="percent">{Math.round(percent).toFixed(0)}%</div>
						</div>
					</div>
				</div>
			</div>
		</React.Fragment>
	);
};

export default Component;
