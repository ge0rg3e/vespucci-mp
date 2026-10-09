import moment from 'moment';
import React from 'react';

const ExportingComponent = () => (
	<React.Fragment>
		<div className="time-and-date">
			<div className="time">{moment(new Date()).format('HH:mm')}</div>
			<div className="date">{moment(new Date()).format('DD MMMM YYYY')}</div>
		</div>
	</React.Fragment>
);

export default ExportingComponent;
