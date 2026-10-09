import React, { useEffect } from 'react';

//  Dependencies
import { calculateStrokeOffset } from '@/views/game/features/speedometer/components/functions';

// Context
import { AppContext } from '@/utils/context';

const Component = (props: Props) => {
	const { isDarkEnvironment } = AppContext();

	const getIcon = () => {
		if (props.id === 'hunger') return `fa-burger`;
		if (props.id == 'thirst') return `fa-droplet`;
		if (props.id == 'alcohol') return `fa-beer-mug`;
		if (props.id == 'drugs') return `fa-cannabis`;
	};

	const setColor = () => {
		let elm: ExpectedAny = document.getElementById(`gauge-bar-hud-${props.id}`);
		if (!elm) return false;

		// Needs some padding, quick hotfix. The icons can be smaller than the border color.
		const padding = props.proccent < 15 ? 10 : 0;

		const numberUsed = 100 - (props.proccent + padding);

		let color = `#f195ac`;
		let colorBg = `#696868`;

		// This needs to be exactly like this.
		elm.style[
			'background'
		] = `linear-gradient(to bottom,${colorBg} 0%,${colorBg} ${numberUsed}%,${color} ${numberUsed}%,${color} 100%)`;

		// This for some freaking reason need to be reset right away everytime.
		elm.style['-webkit-background-clip'] = 'text';
		elm.style['-webkit-text-fill-color'] = 'transparent';
	};

	useEffect(() => {
		setColor();
	}, [props.proccent]);

	return (
		<React.Fragment>
			<div className={`entry ${props.id} ${isDarkEnvironment && 'dark-mode'}`}>
				<div className="icon">
					<i id={`gauge-bar-hud-${props.id}`} className={`elm fa-solid ${getIcon()}`}></i>
					<i className={`elm-shadow fa-solid ${getIcon()}`}></i>
				</div>
				<div className="progress">
					<svg
						width="100%"
						height="100%"
						viewBox="0 0 160 160"
						style={{
							transform: 'rotate(-90deg)'
						}}
					>
						<circle
							r="70"
							cx="80"
							cy="80"
							fill="transparent"
							strokeWidth="12px"
							className="backgroundBar"
						></circle>
						<circle
							className="valueBar"
							r="70"
							cx="80"
							cy="80"
							stroke={`#f195ac`}
							fill="transparent"
							strokeLinecap="round"
							strokeWidth="12px"
							strokeDasharray="439.6px"
							strokeDashoffset={calculateStrokeOffset(props.proccent, 100, 439.6)}
						></circle>
					</svg>
				</div>
				<div className="progress-border"></div>
			</div>
		</React.Fragment>
	);
};

type Props = {
	id: 'hunger' | 'thirst' | 'alcohol' | 'drugs';
	proccent: number;
};
export default Component;
