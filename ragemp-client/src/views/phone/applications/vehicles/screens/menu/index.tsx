import React from 'react';
import { AppState } from '../..';
import { formatNumber } from '@/utils/helpers';

// Components
import NavigationHeader from '@phone/components/ui/navigationHeader';
import { ButtonBase } from '@mui/material';
import QuickControls from './components/controls';

const Component = () => {
	const { vehicleSelected, setScreen, lang, sendEventServer } = AppState();

	const statusText: FixableAny = {
		0: lang.get('VehStatus:Despawned'),
		1: lang.get('VehStatus:Spawned'),
		2: lang.get('VehStatus:InGarage')
	};

	const ctaButtonText: FixableAny = {
		0: lang.get('CallAction:Spawn'),
		1: lang.get('CallAction:Despawn'),
		2: lang.get('CallAction:TakeOutGarage')
	};

	const changeSpawnState = async () => {
		sendEventServer('ChangeSpawnState');
	};

	return (
		<div className="screen menu">
			<NavigationHeader
				title={vehicleSelected.extra.modelName}
				right={
					<React.Fragment>
						<div className="icon" onClick={() => setScreen('list')}>
							<i className={`fa-solid fa-arrow-up-arrow-down`}></i>
						</div>
					</React.Fragment>
				}
			/>
			<div className={`image status-${vehicleSelected.status}`}>
				<img
					className={`thumbnail`}
					src={`${__ASSETS__}/vehicles/${vehicleSelected.model}.png`}
					onError={(ev: UndefinedAny) =>
						(ev.target.src = `${__ASSETS__}/vehicles/404.png`)
					}
					onLoad={(ev: UndefinedAny) => (ev.target.className += ` loaded`)}
				/>
				<div className="shadow"></div>
				<div className={`text status-${vehicleSelected.status}`}>
					{statusText[vehicleSelected.status]}
				</div>
			</div>
			<div className="padding-container">
				<div className="purchase-date">
					{lang.get('OwnedSince', { date: vehicleSelected.createdAt })}{' '}
				</div>
				<div className="divider"></div>
				<div className="odometer-info">
					<div className="left-side">
						<div className="icon">
							<i className="elm fa-solid fa-gauge-circle-plus"></i>
						</div>
						<div className="label">{lang.get('Odometer')}</div>
					</div>
					<div className="right-side">
						{formatNumber(parseInt(vehicleSelected.odometer))} KM
					</div>
				</div>
				<QuickControls />
				<ButtonBase className="cta-spawn" onClick={changeSpawnState}>
					{ctaButtonText[vehicleSelected.status]}
				</ButtonBase>
			</div>
		</div>
	);
};

export default Component;
