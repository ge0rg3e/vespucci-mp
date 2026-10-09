import React from 'react';

const Component = (props: ExpectedAny) => {
	const onClick = () => {
		setTimeout(() => {
			props.onClick();
		}, 300);
	};

	return (
		<React.Fragment>
			<div className="app-container">
				<div className="app-wrapper" onClick={onClick}>
					<div
						className={`app-icon`}
						style={{
							backgroundImage: `url('/assets/images/phone/icons/${props.data.icon}')`
						}}
					/>
					<div className="app-label">{props.data.label[window.language]}</div>
				</div>
			</div>
		</React.Fragment>
	);
};

export default Component;
