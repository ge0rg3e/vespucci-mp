import React from 'react';
import { ViewState } from '..';
import { formatPhoneNumber } from '@/utils/helpers';

const Component = () => {
	const { numberDialed } = ViewState();

	return (
		<React.Fragment>
			<div className="header">
				{numberDialed.length > 0 && (
					<div className="phone-number">
						{numberDialed.length > 3 ? formatPhoneNumber(numberDialed) : numberDialed}
					</div>
				)}

				{/* <div className="options">
					{numberDialed.length > 0 && <div className="entry">Add to Contacts</div>}
				</div> */}
			</div>
		</React.Fragment>
	);
};

export default Component;
