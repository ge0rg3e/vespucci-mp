import React from 'react';

// Components
import { ButtonBase } from '@mui/material';

// Context
import { ViewState } from '..';

const Component = () => {
	const { onDelete, numberDialed, onCallNumber } = ViewState();

	return (
		<React.Fragment>
			<div className="footer">
				<ButtonBase className="button" onClick={onCallNumber}>
					<i className="icon fas fa-phone-alt"></i>
				</ButtonBase>
				{numberDialed.length > 0 && (
					<div className="clear-button" onClick={onDelete}>
						<i className="btn fa-duotone fa-delete-left"></i>
					</div>
				)}
			</div>
		</React.Fragment>
	);
};

export default Component;
