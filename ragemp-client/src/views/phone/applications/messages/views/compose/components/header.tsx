import React from 'react';

// Context
import { AppState } from '../../..';
import { ViewState } from '..';

const Component = () => {
	const { setSubRoute } = AppState();
	const { lang } = ViewState();

	const goBack = () => {
		setSubRoute('list');
	};

	return (
		<React.Fragment>
			<div className="component-app-header">
				<div className="left-side">
					<div className="entry" onClick={goBack}>
						<div className="label">{lang.get('header:goBack')}</div>
					</div>
				</div>
				<div className="middle-side">
					<div className="heading">{lang.get('header:title')}</div>
				</div>
			</div>
		</React.Fragment>
	);
};

export default Component;
