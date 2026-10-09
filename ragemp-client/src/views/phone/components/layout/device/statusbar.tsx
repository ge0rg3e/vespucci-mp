import React, { useEffect, useState } from 'react';

let intervalTimer: UndefinedAny = null;

const ExportingComponent = () => {
	const [gameTime, setGameTime] = useState({ hour: 12, minutes: 0 });

	useEffect(() => {
		intervalTimer = setInterval(async () => {
			const res = !window.mp.fake
				? await window.rpc.callClient(`getGameClientTime`)
				: { hour: 12, minutes: 0 };
			setGameTime(res);
		}, 2000);

		return () => {
			if (intervalTimer !== null) {
				// Clear interval id
				clearInterval(intervalTimer);

				// Reset id
				intervalTimer = null;
			}
		};
	}, []);

	const formatDigitClock = (nr: number) => (nr < 10 ? `0${nr}` : nr);

	return (
		<React.Fragment>
			<div className="status-bar">
				<div className="component-left">
					{formatDigitClock(gameTime.hour)}:{formatDigitClock(gameTime.minutes)}
				</div>
				<div className="component-right">
					<div className="signal">
						<i className="icon fa-solid fa-signal-strong"></i>
					</div>
					<div className="wifi">
						<i className="icon fa-solid fa-wifi"></i>
					</div>
					<div className="battery">
						<div className="shape"></div>
						<div className="dot"></div>
						<div className="text">100</div>
					</div>
				</div>
			</div>
		</React.Fragment>
	);
};

export default ExportingComponent;
