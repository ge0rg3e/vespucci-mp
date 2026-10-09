import { formatNumber } from '@/utils/helpers';
import { ButtonBase } from '@mui/material';
import React from 'react';
import { AppState } from '../../..';

const Component = (props: ExpectedAny) => {
	const { lang } = AppState();

	const statusText: FixableAny = {
		0: lang.get('VehStatus:Despawned'),
		1: lang.get('VehStatus:Spawned'),
		2: lang.get('VehStatus:InGarage')
	};

	return (
		<React.Fragment>
			<ButtonBase
				className={`entry status-${props.data.status}`}
				onClick={() => props.selectVehicle(props.data)}
			>
				<div className="model-name">{props.data.extra.modelName}</div>
				<div className={`status status-${props.data.status}`}>
					{statusText[props.data.status]}
				</div>
				<div className="odometer">
					{lang.get('FormatOdometer', {
						val: formatNumber(parseInt(props.data.odometer))
					})}
				</div>
				<div className="image">
					<img
						className={`thumbnail`}
						src={`${__ASSETS__}/vehicles/${props.data.model}.png`}
						onError={(ev: UndefinedAny) =>
							(ev.target.src = `${__ASSETS__}/vehicles/404.png`)
						}
						onLoad={(ev: UndefinedAny) => (ev.target.className += ` loaded`)}
					/>
					<div className="thumbnail-shadow"></div>
				</div>
			</ButtonBase>
		</React.Fragment>
	);
};

export default Component;
