import React from 'react';

const Component = (props: Props) => {
	return (
		<React.Fragment>
			<div className={`component-boolean`}>
				{[true, false].map((c, index) => (
					<div
						key={index}
						className={`option ${props.currentState === c && 'selected'}`}
						onClick={() => props.onChange(c)}
					>
						{props.labels[c === true ? 'true' : 'false']}

						<div className="bar-selected"></div>
					</div>
				))}
			</div>
		</React.Fragment>
	);
};

type Props = {
	currentState: boolean;
	labels: {
		true: string;
		false: string;
	};
	onChange: ExpectedAny;
};

export default Component;
