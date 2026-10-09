import React, { useEffect, useState } from 'react';

// Dependencies
import moment from 'moment';
import momentTimezone from 'moment-timezone';

const Component = (props: Props) => {
	const [timezoneDecided, setTimezoneDecided] = useState(false);

	const getFormat = () => {
		let str: ExpectedAny = '';

		if (props.format === 'fullDate') {
			str = `DD MMMM YYYY, HH:mm`;
		}

		return str;
	};

	const formatDate = () => {
		const formatting = getFormat();

		// @Bugfix to Moment.js formatting the dates to the local date.
		if (timezoneDecided !== true) {
			return momentTimezone.tz('Europe/Bucharest').format(formatting);
		}

		return moment(props.data).format(formatting);
	};

	useEffect(() => setTimezoneDecided(true), []);

	return <React.Fragment>{formatDate()}</React.Fragment>;
};

export default Component;

type Props = {
	data: Date;
	format: 'fullDate';
};
