import React from 'react';

const Component = (props: Props) => {
	if (props.level < 1) return null;

	const Star = (props: { filledIn: boolean }) => (
		<i className={`elm fa-solid fa-star ${props.filledIn && 'filledIn'}`}></i>
	);

	return (
		<React.Fragment>
			<div className="wantedLevel">
				<Star filledIn={props.level > 4} />
				<Star filledIn={props.level > 3} />
				<Star filledIn={props.level > 2} />
				<Star filledIn={props.level > 1} />
				<Star filledIn={props.level > 0} />
			</div>
		</React.Fragment>
	);
};

export default Component;

type Props = {
	level: number;
};
