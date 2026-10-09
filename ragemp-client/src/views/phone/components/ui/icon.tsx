import React from 'react';

interface Props {
	icon: string;
	size: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
	theme?: 'light' | 'dark' | 'system';
	color: string;
	containerStyle?: FixableAny;
	elementStyle?: FixableAny;
}

const Component = (props: Props) => {
	const componentTheme =
		props.theme === 'system' || !props.theme ? window.phone.theme : props.theme;

	return (
		<React.Fragment>
			<div
				style={{ ...(props.containerStyle || {}) }}
				className={`app-component-icon ${componentTheme} ${props.size}`}
			>
				<i
					style={{ ...(props.elementStyle || {}), color: props.color }}
					className={`elm ${props.icon}`}
				/>
			</div>
		</React.Fragment>
	);
};

export default Component;
