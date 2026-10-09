import React from 'react';

const Component = () => (
	<React.Fragment>
		<div className="preferences">
			<div className="entry">
				<div className="label">Ringtone</div>
				<div className="value">
					<div className="text">Default</div>
					<div className="icon">
						<i className="elm fa-solid fa-chevron-right"></i>
					</div>
				</div>
			</div>
			<div className="entry">
				<div className="label">Text Tone</div>
				<div className="value">
					<div className="text">Default</div>
					<div className="icon">
						<i className="elm fa-solid fa-chevron-right"></i>
					</div>
				</div>
			</div>
		</div>
	</React.Fragment>
);

export default Component;
