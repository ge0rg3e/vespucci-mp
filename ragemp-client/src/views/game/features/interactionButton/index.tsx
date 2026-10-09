import React, { useEffect, useState } from 'react';
import { HudState } from '../../';

const Component = () => {
	const { isDarkEnvironment } = HudState();

	const [data, setData] = useState<ExpectedAny>(null);

	const showInteractionButton = (args: string) => {
		const { label, button } = JSON.parse(args);
		setData({ label, button });
	};

	const hideInteractionButton = () => setData(null);

	useEffect(() => {
		window.rpc.on(`showInteractionButton`, showInteractionButton);
		window.rpc.on(`hideInteractionButton`, hideInteractionButton);

		return () => {
			window.rpc.off(`showInteractionButton`, showInteractionButton);
			window.rpc.off(`hideInteractionButton`, hideInteractionButton);
		};
	}, []);

	if (data === null) return null;

	return (
		<React.Fragment>
			<div className={`hud-interaction-button ${!isDarkEnvironment && `day-mode`}`}>
				<div className="button-container">
					<div className="text">{data.button}</div>
				</div>
				<div className="label">{data.label}</div>
			</div>
		</React.Fragment>
	);
};

export default Component;
