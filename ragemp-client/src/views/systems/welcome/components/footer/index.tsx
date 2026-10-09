import React from 'react';

// Components
import Discord from './components/discord';
import ServerStats from './components/serverStats';

// Context
import { ComponentState } from '../..';

const Component = () => {
	const { isNight } = ComponentState();

	return (
		<React.Fragment>
			<div className="layout-footer">
				<div className="layout-content">
					<Discord />
					<ServerStats />
				</div>
			</div>
			<div className={`layout-footer-background ${isNight && 'night-mode'}`}></div>
		</React.Fragment>
	);
};

export default Component;
