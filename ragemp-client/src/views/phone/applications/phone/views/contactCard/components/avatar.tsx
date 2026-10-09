import React from 'react';

type Props = {
	name: string;
};

const Component = (props: Props) => (
	<React.Fragment>
		<div className="component-contact-avatar">
			<div className="letter">{props.name[0].toString().toUpperCase()}</div>
		</div>
	</React.Fragment>
);

export default Component;
