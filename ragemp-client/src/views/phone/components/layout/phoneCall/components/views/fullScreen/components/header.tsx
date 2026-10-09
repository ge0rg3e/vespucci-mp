import React from 'react';

// Context
import { ComponentState } from '../../../../';

const Component = () => {
	const { participantData, getCallStatusText } = ComponentState();

	return (
		<React.Fragment>
			<div className="component-header">
				<div className="name">{participantData.displayName}</div>
				<div className="information">{getCallStatusText()}</div>
			</div>
		</React.Fragment>
	);
};

export default Component;
