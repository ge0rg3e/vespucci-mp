import React, { useState } from 'react';

// Context
import { WalkieContext } from '..';

const Component = () => {
	const { setScreen, changeEnabled, enabled } = WalkieContext();

	const goHome = () => {
		setScreen('home');
	};

	const goMenu = () => {
		setScreen('menu');
	};

	return (
		<React.Fragment>
			<div className="component-buttons">
				<div className="entry" onClick={goHome}>
					<div className="icon house">
						<i className="elm fa-solid fa-house"></i>
					</div>
				</div>
				<div className="entry middle" onClick={changeEnabled}>
					<div className="icon">
						<i className="elm fa-solid fa-power-off"></i>
					</div>
				</div>
				<div className="entry" onClick={goMenu}>
					<div className="icon">
						<i className="elm fa-solid fa-bars"></i>
					</div>
				</div>
			</div>
		</React.Fragment>
	);
};

export default Component;
