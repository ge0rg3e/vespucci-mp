import React from 'react';

// Context
import { ComponentState } from '../../../../';

// Dependencies
import { truncateString } from '@/utils/helpers';

const Component = () => {
	const { participantData, getCallStatusText } = ComponentState();

	return (
		<React.Fragment>
			<div className="information">
				<div className="name">{truncateString(participantData.displayName, 20)}</div>
				<div className="status">{getCallStatusText()}</div>
			</div>
		</React.Fragment>
	);
};

export default Component;
