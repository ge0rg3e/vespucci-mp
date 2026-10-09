import React, { useEffect, useState } from 'react';
import { ChromePicker } from 'react-color';

export const RGBPicker = (props: PropsRGBPicker) => {
	const [value, setValue] = useState<ExpectedAny>({
		r: props.value[0],
		g: props.value[1],
		b: props.value[2],
		a: props.value[3] || 1
	});

	const onChange = (value: ExpectedAny) => {
		const rgb = value.rgb;
		props.onChange([rgb.r, rgb.g, rgb.b]);
		setValue(value.rgb);
	};

	useEffect(() => {
		setValue({
			r: props.value[0],
			g: props.value[1],
			b: props.value[2],
			a: props.value[3] || 1
		});
	}, [props.value]);

	return (
		<React.Fragment>
			<ChromePicker
				disableAlpha={true}
				color={value}
				onChange={(color: ExpectedAny) => onChange(color)}
				styles={{
					default: {
						Alpha: {
							display: 'none'
						}
					}
				}}
			/>
		</React.Fragment>
	);
};

type PropsRGBPicker = {
	value: ExpectedAny;
	onChange: (newValue: Array<number>) => void;
};
