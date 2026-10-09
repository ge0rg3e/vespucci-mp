import React from 'react';
import { ComponentState } from '..';

const Component = (props: Props) => {
	const { loadedControlsImage, setLoadedControlsImage } = ComponentState();

	return (
		<React.Fragment>
			<div className={`layout-controls ${loadedControlsImage ? 'loaded' : ''}`}>
				<div className={`entries`}>
					{props.keys.map((control: ExpectedAny, ix: number) => (
						<div
							key={ix}
							className={`entry ${props.clickable && 'clickable'}`}
							onClick={props.clickable ? control.onClick : undefined}
						>
							<div className="key">{props.clickable ? 'Click' : control.key}</div>

							<div className="label">{control.label}</div>
						</div>
					))}
				</div>
				<img
					className="hidden-img-loader"
					style={{ display: 'none' }}
					src="/assets/images/systems/businesses/tunning/controlsShadow.png"
					alt=""
					onLoad={() => setLoadedControlsImage(true)}
				/>
			</div>
		</React.Fragment>
	);
};

type Props = {
	keys: Array<{ key?: ExpectedAny; label: string; onClick?: ExpectedAny }>;
	clickable?: boolean;
};

export default Component;
