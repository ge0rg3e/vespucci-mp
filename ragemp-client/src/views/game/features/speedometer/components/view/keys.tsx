import React from 'react';
import { SpeedometerContext } from '../..';
import { HudState } from '@/views/game';

const Component = () => {
	const { data } = SpeedometerContext();
	const { isDarkEnvironment } = HudState();

	return (
		<div className={`keys ${isDarkEnvironment && 'dark-mode'}`}>
			<div className="entry">
				<div className="icon">
					<img
						onLoad={(ev: UndefinedAny) => (ev.target.className += ` loaded`)}
						src={`/assets/images/hud/speedometer/belt_${data.belt ? 'on' : 'off'}.png`}
						onContextMenu={(e) => e.preventDefault()}
						onDragStart={(e) => e.preventDefault()}
						className={`image`}
					/>
				</div>
				<div className="button">M</div>
			</div>
			<div className="entry">
				<div className="icon">
					<img
						onLoad={(ev: UndefinedAny) => (ev.target.className += ` loaded`)}
						src={`/assets/images/hud/speedometer/lock_${data.locked ? 'on' : 'off'}.png`}
						onContextMenu={(e) => e.preventDefault()}
						onDragStart={(e) => e.preventDefault()}
						className={`image`}
					/>
				</div>
				<div className="button">L</div>
			</div>

			<div className="entry">
				<div className="icon">
					<img
						onLoad={(ev: UndefinedAny) => (ev.target.className += ` loaded`)}
						src={`/assets/images/hud/speedometer/radio.png`}
						onContextMenu={(e) => e.preventDefault()}
						onDragStart={(e) => e.preventDefault()}
						className={`image`}
					/>
				</div>
				<div className="button">Q</div>
			</div>
		</div>
	);
};

export default Component;
