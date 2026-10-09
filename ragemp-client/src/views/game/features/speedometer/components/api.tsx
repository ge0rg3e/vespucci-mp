import React, { useEffect } from 'react';
import { SpeedometerContext } from '..';
import { logError } from '@/utils/helpers';
import { SpeedometerData } from './types';
import { AppContext } from '@/utils/context';

const Component = () => {
	const { data, setData } = SpeedometerContext();
	const { setSpeedometerVisible } = AppContext();

	const onUpdate = (args: string) => {
		try {
			const payload = JSON.parse(args);
			setData((currentState: SpeedometerData) => ({ ...currentState, ...payload }));
		} catch (err) {
			logError(`hud.speedometer.onUpdate`, err);
		}
	};

	const onSetVisible = (args: string) => {
		try {
			const { visible } = JSON.parse(args);
			setData((currentState: SpeedometerData) => ({ ...currentState, visible }));
		} catch (err) {
			logError(`hud.speedometer.onSetVisible`, err);
		}
	};
	const setupDemoData = () => {
		if (!window.mp.fake) return false;

		// To see a nice fade in.
		setTimeout(() => {
			setData({
				// Booleans
				isPersonalVehicle: false,
				visible: true,
				locked: false,
				belt: false,
				// Numbers
				speed: 60,
				maxSpeed: 180,
				fuel: 35,
				maxFuel: 55,
				engineHealth: 50,
				odometer: 3500
			});
		}, 500);
	};

	useEffect(() => {
		setSpeedometerVisible(data.visible);
	}, [data.visible]);

	useEffect(() => {
		// Fake testing data..
		setupDemoData();

		window.rpc.on(`hud.speedometer.updateData`, onUpdate);
		window.rpc.on(`hud.speedometer.setVisible`, onSetVisible);

		return () => {
			window.rpc.off(`hud.speedometer.updateData`, onUpdate);
			window.rpc.off(`hud.speedometer.setVisible`, onSetVisible);
		};
	}, []);

	return <React.Fragment></React.Fragment>;
};

export default Component;
