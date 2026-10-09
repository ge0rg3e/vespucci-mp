import React from 'react';
import { ListIconData } from './icon';

interface Props {
	label: string;
	checked: boolean;
	onChange: FixableAny;
	icon?: ListIconData;
	theme?: 'light' | 'dark' | 'system';
}

const Component = (props: Props) => {
	const checkedClass = props.checked ? `checked` : `not-checked`;

	const componentTheme =
		props.theme === 'system' || !props.theme ? window.phone.theme : props.theme;

	return (
		<React.Fragment>
			<div className={`entry app-component-switch ${componentTheme}`}>
				<div className="label">{props.label}</div>
				<div className="value">
					<div className={`switch-elm ${checkedClass}`} onClick={props.onChange}>
						<div className={`value ${checkedClass}`}></div>
					</div>
				</div>
			</div>
		</React.Fragment>
	);
};

export default Component;
