import React from 'react';

const Component = (props: ComponentProps) => {
	const icons = {
		warning: 'far fa-exclamation-triangle',
		error: 'far fa-exclamation-circle',
		success: 'fas fa-check'
	};

	return (
		<div className={`component-alert ${props.type}`}>
			{!props.removeIcon && <i className={`icon ${icons[props.type]}`}></i>} <p className="message">{props.message}</p>
		</div>
	);
};

type ComponentProps = {
	type: 'error' | 'warning' | 'success';
	message: string;
	removeIcon?: true;
};

export default Component;
