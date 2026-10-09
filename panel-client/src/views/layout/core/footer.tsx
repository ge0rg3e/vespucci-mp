import React from 'react';

import Package from '../../../../package.json';

const Component = () => {
	// Year
	const nowYear = new Date().getFullYear();
	const startYear = 2022;
	const years = startYear === nowYear ? `${nowYear}` : `${startYear} - ${nowYear}`;

	return (
		<React.Fragment>
			<div className="layout-footer">
				<div className="contents">
					<div className="copyright">Copyright © {years}. Vespucci Developments. All rights reserved.</div>
					<div className="version">Version {Package.version}</div>
				</div>
			</div>
		</React.Fragment>
	);
};

export default Component;
