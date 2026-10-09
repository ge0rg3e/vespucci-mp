import React, { useState } from 'react';
import Slider from 'rc-slider';

const Component = (props: Props) => {
	const [value, setValue] = useState(props.currentValue);
	return (
		<React.Fragment>
			<div className={`component-slider`}>
				<Slider
					value={value}
					onAfterChange={() => props.onChange(value)}
					onChange={(val: ExpectedAny) => setValue(val)}
					max={props.maxNumber}
					min={props.minNumber}
				/>
			</div>
		</React.Fragment>
	);
};

type Props = {
	currentValue: number;
	minNumber: number;
	maxNumber: number;
	onChange: ExpectedAny;
};

export default Component;
