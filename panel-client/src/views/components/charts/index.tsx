import React, { useEffect, useState } from 'react';
import { Chart } from 'react-chartjs-2';

// Register the registrables and import types
import { Chart as ChartJS, registerables } from 'chart.js';
import { getChartOptions } from './utils';
import { ChartProps } from './types';

// Registering the chart.js
ChartJS.register(...registerables);

const Component = (props: ChartProps) => {
	const [responsiveKey, setResponsiveKey] = useState(Math.random());

	useEffect(() => {
		// @Bugfix: We need to re-render the chart when they change resolutions or chart.js will break.
		const handleResize = () => setResponsiveKey(Math.random());
		window.addEventListener('resize', handleResize);
		return () => window.removeEventListener('resize', handleResize);
	}, []);

	const options = getChartOptions(props.type, props.options);

	return (
		<React.Fragment>
			<Chart type={props.type} data={props.data} options={options} key={responsiveKey} />
		</React.Fragment>
	);
};

export default Component;
