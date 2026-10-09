import React, { useState, createContext, useContext } from 'react';

// Types
import { SpeedometerData } from './components/types';
import { conditionalClassNames } from '@/utils/helpers';

// Components
import API from './components/api';

import SpeedGauge from './components/view/speedGauge';
import SpeedText from './components/view/speedText';
import Engine from './components/view/engine';
import Fuel from './components/view/fuel';
import Keys from './components/view/keys';
import { AppContext } from '@/utils/context';

// Context
const Context = createContext({});
export const SpeedometerContext: ExpectedAny = () => useContext(Context);

const Component = () => {
	const [data, setData] = useState<SpeedometerData>({
		// Booleans
		isPersonalVehicle: false,
		visible: false,
		locked: false,
		belt: false,
		// Numbers
		speed: 0,
		maxSpeed: 100,
		fuel: 0,
		maxFuel: 55,
		odometer: 0,
		engineHealth: 100
	});

	const { phoneVisible, walkieTalkieVisible } = AppContext();

	const shouldDisplaySpeedometer = () => {
		if (phoneVisible || walkieTalkieVisible) return false;
		return true;
	};

	// The classNames for the speedometer
	const classNames = conditionalClassNames(`speedometer`, [
		{
			if: data.visible && shouldDisplaySpeedometer(),
			class: `visible`
		}
	]);

	const PassedProps = {
		data,
		setData,
		isSpeeding: data.speed >= 100 ? true : false
	};

	return (
		<Context.Provider value={PassedProps}>
			<div className={classNames}>
				<SpeedGauge />
				<div className="content">
					<SpeedText />
					<Engine />
					<Fuel />
					<Keys />
				</div>
			</div>
			<API />
		</Context.Provider>
	);
};

export default Component;
