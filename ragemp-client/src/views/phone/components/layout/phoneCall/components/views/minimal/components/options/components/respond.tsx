import React from 'react';

import { ButtonBase } from '@mui/material';

// Context
import { ComponentState } from '../../../../../../';

const Component = () => {
	const { respondCall } = ComponentState();

	return (
		<React.Fragment>
			<div className="right-side">
				<ButtonBase
					className="circle-button red rejectCall"
					onClick={() => respondCall(false)}
				>
					<i className="icon fas fa-phone"></i>
				</ButtonBase>
				<ButtonBase
					className="circle-button green acceptCall"
					onClick={() => respondCall(true)}
				>
					<i className="icon fas fa-phone"></i>
				</ButtonBase>
			</div>
		</React.Fragment>
	);
};

export default Component;
