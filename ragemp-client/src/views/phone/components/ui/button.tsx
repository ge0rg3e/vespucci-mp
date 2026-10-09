import React from 'react';
import { conditionalClassNames } from '@/utils/helpers';
import { ButtonBase } from '@mui/material';

interface Props {
	children: UndefinedAny;
	disabled?: boolean;
	onClick: FixableAny;
	theme?: 'light' | 'dark' | 'system';
	color: 'blue' | 'red';
	variant: 'standard' | 'outlined';
}

const Component = (props: Props) => {
	const componentTheme =
		props.theme === 'system' || !props.theme ? window.phone.theme : props.theme;

	return (
		<React.Fragment>
			<ButtonBase
				disabled={props.disabled}
				onClick={props.onClick}
				className={conditionalClassNames(
					`app-component-button ${props.color} ${componentTheme}`,
					[
						{
							class: `disabled`,
							if: props.disabled === true
						},
						{
							class: `outlined`,
							if: props.variant === 'outlined'
						}
					]
				)}
			>
				{props.children}
			</ButtonBase>
		</React.Fragment>
	);
};

export default Component;
