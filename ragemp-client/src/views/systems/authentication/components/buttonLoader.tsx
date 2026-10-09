import React from 'react';
import { LinearProgress } from '@mui/material';

interface ButtonLoaderProps {
	active: boolean;
}

const ButtonLoader = ({ active }: ButtonLoaderProps) => {
	if (!active) {
		return null;
	}

	return (
		<React.Fragment>
			<div className="layout-button-loader-component">
				<LinearProgress color="secondary" />
			</div>
		</React.Fragment>
	);
};

export default ButtonLoader;
