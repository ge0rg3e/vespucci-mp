import React from 'react';
import { Fab } from '@mui/material';

const Component = (props: ExpectedAny) => {
	const onLeftClick = () => {
		const newValue = props.value - 1;
		if (props.min !== undefined && props.max !== undefined && newValue < props.min) {
			props.onChange(props.max);
			return false;
		}

		props.onChange(newValue);
	};

	const onRightClick = () => {
		const newValue = props.value + 1;
		if (props.max !== undefined && props.min !== undefined && newValue > props.max) {
			props.onChange(props.min);
			return false;
		}

		props.onChange(newValue);
	};

	return (
		<React.Fragment>
			<div className="option arrows">
				<Fab size="small" color="secondary" className="left-arrow" onClick={onLeftClick}>
					<i className="icon fa-solid fa-angle-left"></i>
				</Fab>
				<div className="middle">
					<div className="label label-color">{props.label}</div>
					<div className="current-value">
						{props.formatValue ? props.formatValue(props.value) : props.value}
					</div>
				</div>
				<Fab size="small" color="secondary" className="right-arrow" onClick={onRightClick}>
					<i className="icon fa-solid fa-angle-right"></i>
				</Fab>
			</div>
		</React.Fragment>
	);
};

export default Component;
