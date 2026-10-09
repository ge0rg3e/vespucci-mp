import React, { useState, useEffect } from 'react';

//  Context
import { AppContext } from '@/utils/context';

// Dependencies
import { logError } from '@/utils/helpers';

// Variables
let timerInterval: ExpectedAny = null;

const Component = () => {
	const { chatVisible, isDarkEnvironment } = AppContext();

	const [data, setData] = useState({
		zone: 'Vespucci beach',
		street: '5 Grove Street'
	});

	const getData = async () => {
		try {
			if (window.mp.fake) return false;

			// Get
			const { street, zone } = await window.rpc.callClient(`getPlayerStreetAndZoneName`);

			// Set
			setData({ street, zone });
		} catch (err) {
			await logError(`hud.location.getData`, err);
		}
	};

	useEffect(() => {
		timerInterval = setInterval(getData, 5000);

		// Call for first time..
		getData();

		return () => {
			if (timerInterval !== null) {
				// Clear timeout
				clearInterval(timerInterval);

				// Reset timer id
				timerInterval = null;
			}
		};
	}, []);

	return (
		<React.Fragment>
			<div
				className={`component-location ${isDarkEnvironment && 'dark-mode'} ${
					!chatVisible && 'visible'
				}`}
			>
				<div className="icon">
					<i className="elm fa-duotone fa-map-location-dot"></i>
				</div>

				<div className="content">
					<div className="zone">{data.zone}</div>
					<div className="street">{data.street}</div>
				</div>
			</div>
		</React.Fragment>
	);
};

export default Component;
