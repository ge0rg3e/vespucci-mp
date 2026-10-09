import React from 'react';

const Component = (props: ExpectedAny) => (
	<React.Fragment>
		<div className="entry">
			<img
				onLoad={(ev: UndefinedAny) => (ev.target.className += ` loaded`)}
				src={`/assets/images/phone/icons/${props.data.icon}`}
				onContextMenu={(e) => e.preventDefault()}
				onDragStart={(e) => e.preventDefault()}
				onClick={props.onClick}
				className={`app`}
			/>
		</div>
	</React.Fragment>
);

export default Component;
