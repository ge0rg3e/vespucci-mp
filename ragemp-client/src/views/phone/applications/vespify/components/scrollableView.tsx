import React from 'react';

const Component = (props: ExpectedAny) => {
	return (
		<div className="component-scrollable-view">
			<div className="--component-container" id="screen-scroll-container">
				{props.children}
			</div>
		</div>
	);
};

export default Component;
