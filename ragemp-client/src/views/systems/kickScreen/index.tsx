import { useState, useEffect } from 'react';

// Types
interface Data {
	heading: string;
	message: string;
}

// Demo data
import SimulatedResponse from './response';

// Dependencies
let timerInterval: NodeJS.Timeout | null = null;

const Component = () => {
	const [secondsLeft, setSecondsLeft] = useState<number>(0);
	const [data, setData] = useState<Data | null>(null);

	const onEventReceiveData = (data: string) => {
		const { heading, message, seconds } = JSON.parse(data);
		setData({ heading, message });
		setSecondsLeft(seconds);
	};

	const countdownFunc = () => {
		setSecondsLeft((sec) => {
			if (sec > 0) {
				return sec - 1;
			} else {
				window.rpc.triggerServer(`getKickDelayed`);

				return 0;
			}
		});
	};

	useEffect(() => {
		window.rpc.on('updateKickInformation', onEventReceiveData);

		if (window.mp.fake) {
			window.callBrowserEvent(`updateKickInformation`, SimulatedResponse, true);
		}

		if (timerInterval !== null) {
			// Clear interval
			clearInterval(timerInterval);

			// Reset timer id
			timerInterval = null;
		}

		timerInterval = setInterval(countdownFunc, 1000);

		return () => {
			window.rpc.off('updateKickInformation', onEventReceiveData);
			if (timerInterval !== null) {
				// Clear interval
				clearInterval(timerInterval);

				// Reset timer id
				timerInterval = null;
			}
		};
	}, []);

	const parseMessage = (msg: string) => {
		let message = msg;
		message = message.replaceAll('{BR}', '<br />');
		message = message.replaceAll('{BRD}', '<div class="spacer"></div>');
		message = message.replaceAll('{DIVIDER}', '<div class="divider"></div>');
		return message;
	};

	if (data === null) return null;

	return (
		<div className="system-kick-screen">
			<img
				src={`/assets/images/systems/authentication/background.png`}
				onLoad={(ev: UndefinedAny) => (ev.target.className += ` loaded`)}
				onContextMenu={(e) => e.preventDefault()}
				onDragStart={(e) => e.preventDefault()}
				className={`background`}
			/>

			<div className="content">
				<div className="heading">{data.heading}</div>
				<div
					className="message"
					dangerouslySetInnerHTML={{ __html: parseMessage(data.message) }}
				/>
				<div className="kick-countdown">
					You will be kicked from the game in {secondsLeft} seconds
				</div>
			</div>
		</div>
	);
};

export default Component;
