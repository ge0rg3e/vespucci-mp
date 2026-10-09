import React from 'react';

export interface ListIconData {
	class?: string;
	elm: string;
	type: 'fa' | 'image';
}
interface ListIconProps {
	data: ListIconData;
	componentTheme: 'light' | 'dark' | 'system';
}

const Component = (props: ListIconProps) => (
	<React.Fragment>
		<div className={`icon ${props.data.class} ${props.componentTheme}`}>
			{props.data.type === 'fa' && <i className={`elm-fa ${props.data.elm}`}></i>}
		</div>
	</React.Fragment>
);

export default Component;
