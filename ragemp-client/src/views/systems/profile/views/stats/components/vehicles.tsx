import { ProfileState } from '../../../index';
import React from 'react';

// Language
import * as i18n from '@vmp/i18n';
import Language from './vehicles.language';
import { formatNumber } from '@/utils/helpers';

const languagePackId = `SYSTEM_PROFILE_VEHICLES`;
i18n.createLanguagePack(languagePackId, Language);

const ExportingComponent = () => {
	const { data } = ProfileState();
	const lang = i18n.getLanguagePack(languagePackId, window.language);

	const status: ExpectedAny = {
		0: () => lang.get('NotSpawned'),
		1: ({ entityId }: { entityId: number }) => lang.get('Spawned', { id: entityId }),
		2: ({ garageId }: { garageId: number }) => lang.get('InGarage', { id: garageId })
	};

	const statusOrder = [1, 2, 0];

	const vehicles = data.remoteExtras.vehicles.sort(
		(a: PersonalVehicle, b: PersonalVehicle) => statusOrder.indexOf(a.status) - statusOrder.indexOf(b.status)
	);

	return (
		<React.Fragment>
			<div className="table-profile-wrapper">
				<div className="table-body">
					<div className="table-header table-row">
						<div className="table-cell make">Model</div>
						<div className="table-cell distance">{lang.get('Odometer')}</div>
						<div className="table-cell status">Status</div>
					</div>
					<div className="table-content">
						{vehicles.map((vehicle: PersonalVehicle, i: number) => (
							<div key={i} className="table-row">
								<div className="table-cell make">{vehicle.extra.modelName}</div>
								<div className="table-cell distance">
									{formatNumber(parseInt(vehicle.odometer.toString()))} KM
								</div>
								<div className="table-cell status">
									{status[vehicle.status]({
										entityId: vehicle.extra.entityId,
										garageId: vehicle.garageId
									})}
								</div>
							</div>
						))}
						{data.remoteExtras.vehicles.length === 0 && (
							<div className="table-row empty">
								<div className="table-cell empty">{lang.get('NoVehicles')}</div>
							</div>
						)}
					</div>
				</div>
			</div>
		</React.Fragment>
	);
};

export default ExportingComponent;
