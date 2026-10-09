import React from 'react';

// Context
import { PhoneState } from '@phone/index';

interface Props {
	// Needed by the list entry
	theme?: 'light' | 'dark' | 'system';
	label: string;

	value: string | 'number';
	formatValue?: (val: ExpectedAny) => string;
	noValueText?: string;

	// Needed by the keyboard
	onChange: FixableAny;

	// To pass to keyboard
	type: 'number' | 'text';
	placeholder?: string;
	instructions?: string;
	validationFunc?: (val: ExpectedAny) => string | boolean;
}

const Component = (props: Props) => {
	const componentTheme =
		props.theme === 'system' || !props.theme ? window.phone.theme : props.theme;

	const openKeyboard = () => {
		window.phone.showKeyboard({
			inputData: {
				defaultValue: props.value,
				type: props.type,
				instructions: props.instructions,
				placeholder: props.placeholder
			},
			onSubmit: (value, { dismiss }) => {
				props.onChange(value);
				dismiss();
			},
			validationFunc: props.validationFunc
		});
	};

	return (
		<React.Fragment>
			<div className={`entry app-component-input-field ${componentTheme}`}>
				<div className="label">{props.label}</div>
				<div className="value" onClick={openKeyboard}>
					<div className={`form-element`}>
						{props.value !== undefined
							? props.formatValue
								? props.formatValue(props.value)
								: props.value
							: props.noValueText || '-'}
					</div>
					<div className="arrow-right form-arrow">
						<i className="elm fa-solid fa-chevron-right"></i>
					</div>
				</div>
			</div>
		</React.Fragment>
	);
};

export default Component;
