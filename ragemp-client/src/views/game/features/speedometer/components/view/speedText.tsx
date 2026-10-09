import React from 'react';
import { conditionalClassNames } from '@/utils/helpers';

// Context
import { SpeedometerContext } from '../..';
import { AppContext } from '@/utils/context';

const Component = () => {
	const { data, isSpeeding } = SpeedometerContext();
	const { isDarkEnvironment } = AppContext();

	return (
		<React.Fragment>
			<div
				className={conditionalClassNames(`speedText`, [
					{
						class: `speeding`,
						if: isSpeeding
					},
					{
						class: `dark-mode`,
						if: isDarkEnvironment
					}
				])}
			>
				<div className="--content">
					<div className="line1">{formatSpeedNumber(data.speed)}</div>
					<div className="line2">KM/H</div>
				</div>
			</div>
		</React.Fragment>
	);
};

/**
 *
 * @param number
 * @returns the react component that formats the number like the original hud concept.
 */

const formatSpeedNumber = (number: number) => {
	if (number === 0) {
		return (
			<React.Fragment>
				<span className="grey">0</span>
				<span className="grey">0</span>
				<span className="grey">0</span>
			</React.Fragment>
		);
	}

	const formattedNumber = number.toString().padStart(3, '0');

	return (
		<React.Fragment>
			<span className={number < 100 ? 'grey' : ''}>{formattedNumber[0]}</span>
			<span className={number < 10 ? 'grey' : ''}>{formattedNumber[1]}</span>
			<span>{formattedNumber[2]}</span>
		</React.Fragment>
	);
};

export default Component;
