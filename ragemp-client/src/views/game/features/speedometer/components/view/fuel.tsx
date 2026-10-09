import React from 'react';
import { SpeedometerContext } from '../..';
import { AppContext } from '@/utils/context';

const Component = () => {
	const { data } = SpeedometerContext();
	const { isDarkEnvironment } = AppContext();

	return (
		<React.Fragment>
			<div className="fuel-icon">
				<img
					onLoad={(ev: UndefinedAny) => (ev.target.className += ` loaded`)}
					src={`/assets/images/hud/speedometer/fuel.png`}
					onContextMenu={(e) => e.preventDefault()}
					onDragStart={(e) => e.preventDefault()}
					className={`image`}
				/>
			</div>
			<div className={`fuel-text ${isDarkEnvironment && 'dark-mode'}`}>
				{data.fuel.toFixed(0)} L
			</div>
		</React.Fragment>
	);
};

export default Component;
