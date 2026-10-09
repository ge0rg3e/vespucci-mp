import React from 'react';

const Component = (props: Props) => {
	function renderMoney(amount: number) {
		// Convert the number to a string
		const numStr = amount.toString();

		// Determine the number of leading zeros required
		const leadingZeros = Math.max(0, 8 - numStr.length);

		// Create a string with the leading zeros
		const formattedNumber = '0'.repeat(leadingZeros) + numStr;

		return formattedNumber;
	}

	function renderClockTime(hour: number, minutes: number) {
		const formattedHour = hour < 10 ? `0${hour}` : `${hour}`;
		const formattedMinutes = minutes < 10 ? `0${minutes}` : `${minutes}`;

		return (
			<div className="clock">
				<span className="digit">{formattedHour[0]}</span>
				<span className="digit">{formattedHour[1]}</span>
				<span className="separator">:</span>
				<span className="digit">{formattedMinutes[0]}</span>
				<span className="digit">{formattedMinutes[1]}</span>
			</div>
		);
	}

	return (
		<React.Fragment>
			<div className="details">
				<div className="time">{renderClockTime(props.time.hour, props.time.minutes)}</div>
				<div className="cash">${renderMoney(props.money)}</div>
			</div>
		</React.Fragment>
	);
};

type Props = {
	time: { hour: number; minutes: number };
	money: number;
};
export default Component;
