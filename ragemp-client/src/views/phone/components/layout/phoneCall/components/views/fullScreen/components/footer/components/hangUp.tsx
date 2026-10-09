import React from 'react';
import { ButtonBase } from '@mui/material';
import { ComponentState } from '../../../../../../';

const Component = () => {
	const { hangUp } = ComponentState();

	return (
		<React.Fragment>
			<div className="component-footer">
				<ButtonBase className={`hangup`} onClick={hangUp}>
					<i className="icon fas fa-phone"></i>
				</ButtonBase>
			</div>
		</React.Fragment>
	);
};

export default Component;
