import React from 'react';

interface Props {
	flexDirection?: 'row' | 'column';
	alignItems?: 'center' | 'flex-start' | 'flex-end' | 'space-between';
	justifyContent?: 'center' | 'flex-start' | 'flex-end' | 'space-between';
	flex?: 0 | 1;
	children?: UndefinedAny;
	style?: FixableAny;
}

const Component = (props: Props) => (
	<React.Fragment>
		<div
			style={{
				display: 'flex',
				flexDirection: props.flexDirection,
				alignItems: props.alignItems,
				justifyContent: props.justifyContent,
				flex: props.flex,
				...(props.style || {})
			}}
			className={`app-component-flex`}
		>
			{props.children}
		</div>
	</React.Fragment>
);

export default Component;
