import React from 'react';

// Components
import { ButtonBase } from '@mui/material';
import { dialKeys } from '../utils';

// Context
import { ViewState } from '..';

const Component = () => {
	const { onKeyPressed, numberDialed } = ViewState();

	return (
		<React.Fragment>
			<div className="keys">
				{dialKeys.map((c, ix) => (
					<div className={`entry`} key={ix}>
						<ButtonBase
							className="content"
							onClick={() => onKeyPressed(c.value)}
							disableRipple={numberDialed.length === 6 || c.type === 'icon'}
						>
							{c.type === 'normal' ? (
								<React.Fragment>
									<div className="value">{c.value}</div>
									{c.description && (
										<div className="description">{c.description}</div>
									)}
								</React.Fragment>
							) : (
								<React.Fragment>
									<div className="icon">
										<i className={`elm ${c.icon}`}></i>
									</div>
								</React.Fragment>
							)}
						</ButtonBase>
					</div>
				))}
			</div>
		</React.Fragment>
	);
};

export default Component;
