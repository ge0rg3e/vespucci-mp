import React from 'react';

const Component = (props: Props) => {
	return (
		<React.Fragment>
			<div className="component-option">
				<div className="--label">{props.label}</div>
				<div className="--component">{props.component}</div>
			</div>
		</React.Fragment>
	);
};

type Props = {
	label: string;
	component: ExpectedAny;
};

export default Component;
