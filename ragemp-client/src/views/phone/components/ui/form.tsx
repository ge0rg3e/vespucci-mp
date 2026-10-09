import React from 'react';

interface Props {
	children: ExpectedAny;
	theme?: 'light' | 'dark' | 'system';
}

const Component = (props: Props) => {
	const componentTheme =
		props.theme === 'system' || !props.theme ? window.phone.theme : props.theme;

	return (
		<React.Fragment>
			<div className={`app-component-form app-component-data-list ${componentTheme}`}>
				<div className="content">{props.children}</div>
			</div>
		</React.Fragment>
	);
};

export default Component;
