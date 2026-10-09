import React from 'react';
import { SpeedometerContext } from '../..';
import { AppContext } from '@/utils/context';

const Component = () => {
	const { data } = SpeedometerContext();
	const { isDarkEnvironment } = AppContext();
	return (
		<React.Fragment>
			<div className="engine-icon">
				<img
					onLoad={(ev: UndefinedAny) => (ev.target.className += ` loaded`)}
					src={`/assets/images/hud/speedometer/engine.png`}
					onContextMenu={(e) => e.preventDefault()}
					onDragStart={(e) => e.preventDefault()}
					className={`image`}
				/>
			</div>
			<div className={`engine-text ${isDarkEnvironment && 'dark-mode'}`}>
				{data.engineHealth.toFixed(0)}%
			</div>
		</React.Fragment>
	);
};

export default Component;
