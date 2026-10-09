import React from 'react';

interface Props {
	header: string;
	footer?: string;
	action?: FixableAny;
	children?: ExpectedAny;
	theme?: 'light' | 'dark' | 'system';
}

const Component = (props: Props) => {
	const componentTheme =
		props.theme === 'system' || !props.theme ? window.phone.theme : props.theme;

	return (
		<React.Fragment>
			<div className={`app-component-section ${componentTheme}`}>
				<div className="header">{props.header}</div>
				<div className="component-content">{props.children}</div>
				{props.footer && <div className="footer">{props.footer}</div>}
			</div>
		</React.Fragment>
	);
};

export default Component;
