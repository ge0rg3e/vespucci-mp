import React from 'react';

interface Props {
	children: ExpectedAny;
	theme?: 'light' | 'dark' | 'system';
	className?: string;
}

// Context
import { PhoneState } from '@phone/index';

const Component = (props: Props) => {
	const { keyboard } = PhoneState();

	const componentTheme =
		props.theme === 'system' || !props.theme ? window.phone.theme : props.theme;

	return (
		<React.Fragment>
			<div
				className={`${
					props.className || ''
				} ${componentTheme} component-scrollable-container ${
					keyboard ? `keyboardActive` : ``
				}`}
			>
				{props.children}
			</div>
		</React.Fragment>
	);
};

export default Component;
