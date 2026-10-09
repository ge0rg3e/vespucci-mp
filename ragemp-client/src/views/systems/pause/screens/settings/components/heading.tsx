import React from 'react';

const Component = (props: Props) => {
	return (
		<React.Fragment>
			<div className="component-heading">
				<div className="icon">
					<i className={`elm ${props.icon}`}></i>
				</div>
				<div className="details">
					<div className="title">{props.title}</div>
					<div className="description">{props.description}</div>
				</div>
			</div>
		</React.Fragment>
	);
};

type Props = {
	title: string;
	description: string;
	icon: string;
};

export default Component;
