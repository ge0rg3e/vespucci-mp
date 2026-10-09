import React, { useState, useEffect } from 'react';
import moment from 'moment';

// Variables
let timerInterval: ExpectedAny = null;

// Context
import { AppContext } from '@/utils/context';

const Component = () => {
	const { speedometerVisible, walkieTalkieVisible, isDarkEnvironment, phoneVisible } =
		AppContext();
	const [data, setData] = useState(new Date());

	const getData = () => setData(new Date());

	useEffect(() => {
		timerInterval = setInterval(getData, 60000);

		// Call for first time..
		getData();

		return () => {
			if (timerInterval !== null) {
				// Clear interval id
				clearInterval(timerInterval);

				// Reset timer id
				timerInterval = null;
			}
		};
	}, []);

	const shouldHideDate = () => {
		if (walkieTalkieVisible) return true;
		return false;
	};

	return (
		<React.Fragment>
			<div
				className={`component-calendar ${speedometerVisible && 'speedometerVisible'} ${
					shouldHideDate() && 'hideCalendar'
				} ${isDarkEnvironment && 'dark-mode'}`}
				style={{
					opacity: phoneVisible ? 0 : 1
				}}
			>
				<div className="icon">
					<i className="elm fa-regular fa-clock"></i>
				</div>
				<div className="text">
					{moment(data).format('HH:mm')}{' '}
					<span className="grey">{moment(data).format('DD.MM.YYYY')}</span>
				</div>
			</div>
		</React.Fragment>
	);
};

export default Component;
