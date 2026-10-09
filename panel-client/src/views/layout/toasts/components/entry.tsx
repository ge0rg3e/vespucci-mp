import React from 'react';

const Component = (props: ComponentProps) => {
	function percentage(partialValue: number, totalValue: number) {
		return (100 * partialValue) / totalValue;
	}

	return (
		<React.Fragment>
			<div
				id={`toast-${props.index}`}
				onClick={props.onClick}
				className={`entry ${props.data.type}`}
				style={{
					display: props.data.secondsLeft < 0.01 ? 'none' : 'flex'
				}}
			>
				{props.icon}
				<div className="message">{props.data.message}</div>
				<div className="progress-bar">
					<div
						className="value"
						style={{
							width: `${percentage(props.data.secondsLeft, props.data.secondsTimer)}%`
						}}
					/>
				</div>
			</div>
		</React.Fragment>
	);
};

type ComponentProps = {
	data: ExpectedAny;
	onClick: UndefinedAny;
	icon: string;
	index: number;
};

export default Component;
