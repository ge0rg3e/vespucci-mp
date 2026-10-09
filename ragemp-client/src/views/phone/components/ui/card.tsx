import React from 'react';

type Props = {
	title: string;
	theme?: 'light' | 'dark' | 'system';
	content: string;
};

const Component = (props: Props) => {
	const componentTheme =
		props.theme === 'system' || !props.theme ? window.phone.theme : props.theme;

	return (
		<React.Fragment>
			<div className={`app-component-card ${componentTheme}`}>
				<div className="title">{props.title}</div>
				<div className="content">{props.content}</div>
			</div>
		</React.Fragment>
	);
};

export default Component;
