import React from 'react';

// Components
import Chart from './components/chart';
import HeaderStats from './components/headerStats';

const Component = () => (
	<React.Fragment>
		<div className="activity">
			<HeaderStats />
			<Chart />
		</div>
	</React.Fragment>
);

export default Component;
