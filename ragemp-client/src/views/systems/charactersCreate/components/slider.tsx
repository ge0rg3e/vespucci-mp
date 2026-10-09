import React from 'react';
import Slider from 'rc-slider';

const Component = (props: ExpectedAny) => (
	<React.Fragment>
		<div className="option slider">
			<div className="label label-color">{props.label}</div>
			<div className="slider-container">
				<Slider
					value={props.value}
					onChange={props.onChange}
					min={props.min || 0}
					max={props.max || 100}
					{...(props.rootProps ? props.rootProps : {})}
				/>
			</div>
		</div>
	</React.Fragment>
);

export default Component;
