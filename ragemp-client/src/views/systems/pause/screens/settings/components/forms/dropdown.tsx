import React from 'react';

const Component = (props: Props) => {
	const currentSelected = props.options.find((c) => c.value === props.currentValue) || props.options[0];

	const changeValue = (dir: 'forward' | 'back') => {
		const currentIndex = props.options.findIndex((c) => c.value === props.currentValue);

		const interestIndex = dir === 'forward' ? currentIndex + 1 : currentIndex - 1;

		const nextIndex = props.options[interestIndex]
			? interestIndex
			: dir === 'forward'
			? 0
			: props.options.length - 1;

		props.onChange(props.options[nextIndex].value);
	};

	return (
		<React.Fragment>
			<div className="component-dropdown">
				<div className="arrow left" onClick={() => changeValue('back')}>
					<i className="icon fa-solid fa-chevron-left"></i>
				</div>

				<div className="current-value-container">
					<div className="value">{currentSelected!.label}</div>
					<div className="options-bars">
						{props.options.map((opt, ix) => (
							<div className={`bar ${opt.value === props.currentValue && 'selected'}`} key={ix}></div>
						))}
					</div>
				</div>
				<div className="arrow right" onClick={() => changeValue('forward')}>
					<i className="icon fa-solid fa-chevron-right"></i>
				</div>
			</div>
		</React.Fragment>
	);
};

type Props = {
	currentValue: ExpectedAny;
	options: Array<{ label: string; value: ExpectedAny }>;
	onChange: ExpectedAny;
};

export default Component;
