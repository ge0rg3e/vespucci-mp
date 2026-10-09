import { AudioService } from '@/services/audio';
import React, { useState } from 'react';
import { PhoneState } from '@phone/index';

const ExportingComponent = () => {
	const [sleepPressed, setSleepPressed] = useState(false);
	const [last_route, setLastRoute] = useState('home');
	const { route, setRoute, uiState } = PhoneState();
	const [canPress, setCanPress] = useState(true);
	const { playAudio } = AudioService();

	window.takeToLockScreen = () => {
		setRoute('lockscreen');
		setLastRoute(route);
	};

	const onClickSleep = () => {
		if (uiState.loading === true || uiState.closing || uiState.opening) return false;
		if (canPress === false) return false;
		setCanPress(false);
		setTimeout(() => {
			setCanPress(true);
		}, 1200);
		setSleepPressed(true);
		setTimeout(() => {
			setSleepPressed(false);
			if (route === 'lockscreen') {
				setRoute(last_route, {});
			} else {
				setLastRoute(route);
				setRoute('lockscreen', {});
			}
			playAudio(`${__ASSETS__}/audios/phone/unlock_phone.mp3`, {
				identifier: `phoneNotification`,
				volume: 0.2
			});
		}, 200);
	};

	return (
		<React.Fragment>
			<div className="device-btns"></div>
			<div className={`device-power ${sleepPressed ? `power-pressed` : ``}`} onClick={onClickSleep}>
				<div className="action-area" onClick={onClickSleep} />
			</div>
		</React.Fragment>
	);
};

export default ExportingComponent;
