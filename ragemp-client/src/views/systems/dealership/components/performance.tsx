import React, { useEffect, useState } from 'react';
import { DealershipState } from '..';

// Language
import * as i18n from '@vmp/i18n';
import Language from './performance.lang';
const languagePackId = `SYSTEM_DEALERSHIP_PERFORMANCE`;
i18n.createLanguagePack(languagePackId, Language);

const Component = () => {
	const lang = i18n.getLanguagePack(languagePackId, window.language);
	// const lang = i18n.getLanguagePack(languagePackId, 'RO');

	const { getVehicleSelected } = DealershipState();
	const [performances, setPerformances] = useState({
		acceleration: 0.5,
		braking: 0.5,
		maxSpeed: 80
	});

	const vehicle = getVehicleSelected();

	function percentage(partialValue: number, totalValue: number) {
		if (partialValue > totalValue) return 100;

		return (100 * partialValue) / totalValue;
	}

	const getPerformances = async () => {
		const res = await window.rpc.callClient('getVehicleDealershipPerformances');
		if (window.mp.fake) return false;
		setPerformances(res);
	};

	useEffect(() => {
		getPerformances();
	}, [vehicle]);

	return (
		<React.Fragment>
			<div className="performance">
				<div className="title">{lang.get('Specifications')}</div>
				<div className="entry">
					<div className="top">
						<div className="label">{lang.get('MaxSpeed')}</div>
						<div className="value">{performances.maxSpeed} KM/H</div>
					</div>
					<div className="bar">
						<div className="value" style={{ width: '78%' }}></div>
					</div>
				</div>
				<div className="entry">
					<div className="top">
						<div className="label">{lang.get('GasTank')}</div>
						<div className="value">
							{vehicle.nativeInfo.carTank} {lang.get('Litres')}
						</div>
					</div>
					<div className="bar">
						<div
							className="value"
							style={{ width: `${percentage(vehicle.nativeInfo.carTank, 100)}%` }}
						></div>
					</div>
				</div>
				<div className="entry">
					<div className="top">
						<div className="label">{lang.get('Acceleration')}</div>
						<div className="value">{performances.acceleration}</div>
					</div>
					<div className="bar">
						<div
							className="value"
							style={{ width: `${percentage(performances.acceleration, 1)}%` }}
						></div>
					</div>
				</div>
				<div className="entry">
					<div className="top">
						<div className="label">{lang.get('Brakes')}</div>
						<div className="value">{performances.braking}</div>
					</div>
					<div className="bar">
						<div
							className="value"
							style={{ width: `${percentage(performances.braking, 1.5)}%` }}
						></div>
					</div>
				</div>
				<div className="entry">
					<div className="top">
						<div className="label">{lang.get('Seats')}</div>
						<div className="value">{vehicle.nativeInfo.seats}</div>
					</div>
					<div className="bar">
						<div
							className="value"
							style={{ width: `${percentage(vehicle.nativeInfo.seats, 8)}%` }}
						></div>
					</div>
				</div>
			</div>
		</React.Fragment>
	);
};

export default Component;
