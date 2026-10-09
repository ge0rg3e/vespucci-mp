import React from 'react';

// Components
import Logo from './components/logo';
import Start from './components/start';
import Music from './components/music';
// Context
import { ComponentState } from '../..';

const Component = () => {
	const { isNight } = ComponentState();

	return (
		<React.Fragment>
			<div className={`layout-header-background ${isNight && 'night-mode'}`}></div>
			<div className="layout-header">
				<div className="layout-content">
					<Music />
					<Logo />
					<Start />
				</div>
			</div>
		</React.Fragment>
	);
};

export default Component;
