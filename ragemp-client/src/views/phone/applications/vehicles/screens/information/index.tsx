import React from 'react';

// Components
import List from '@phone/components/ui/list';
import ScrollableContainer from '@phone/components/ui/scrollableContainer';
import NavigationHeader from '@phone/components/ui/navigationHeader';

import { AppState } from '../..';
import moment from 'moment';
import { formatNumber } from '@/utils/helpers';

const Component = () => {
	const { vehicleSelected, data, setScreen, lang } = AppState();

	const items: FixableAny = [
		{
			label: lang.get('DatabaseId'),
			value: vehicleSelected.id
		},
		{
			label: lang.get('EntityId'),
			value: vehicleSelected.extra.entityId
		},
		/* eslint-disable */
		vehicleSelected.status === 2
			? {
					label: lang.get('GarageId'),
					value: vehicleSelected.extra.garageId
			  }
			: null,
		/* eslint-enable */
		{
			label: `Status`,
			value: lang.get('FormatStatusLong', { val: vehicleSelected.status })
		},
		{
			label: lang.get('ManufactureDate'),
			value: moment(vehicleSelected.createdAt).format('DD/MM/YYYY hh:mm')
		},
		/* eslint-disable */
		vehicleSelected.expiresAt !== null
			? {
					label: lang.get('ExpiresAt'),
					value: moment(vehicleSelected.expiresAt).format('DD/MM/YYYY hh:mm')
			  }
			: null,
		/* eslint-enable */
		{
			label: lang.get('Odometer'),
			value: vehicleSelected.extra.hasEngine
				? `${formatNumber(parseInt(vehicleSelected.odometer))} KM`
				: `-`
		},
		/* eslint-disable */
		vehicleSelected.extra.hasEngine
			? {
					label: lang.get('FuelCapacity'),
					value: vehicleSelected.extra.hasEngine
						? `${vehicleSelected.extra.carTank} ${lang.get('Litres')}`
						: `-`
			  }
			: null,
		/* eslint-enable */
		{
			label: lang.get('Plate'),
			value: vehicleSelected.modifications.plate
		},
		{
			label: lang.get('AutomaticVehicleSpawn'),
			value: vehicleSelected.autoSpawn ? lang.get('Yes') : lang.get('No')
		},
		/* eslint-disable */

		data.remoteExtras.useAdminTools === true && data.remoteExtras.isAdministrating
			? {
					label: lang.get('Owner'),
					value: `${vehicleSelected.ownerName} (${vehicleSelected.ownerId})`
			  }
			: null
		/* eslint-enable */
		// {
		// 	label: lang.get('Locked'),
		// 	value: vehicleSelected.locked ? lang.get('Yes') : lang.get('No')
		// }
	].filter((elm) => elm !== null);

	return (
		<React.Fragment>
			<div className="screen information">
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

				<ScrollableContainer>
					<List items={items} theme="dark" />
				</ScrollableContainer>
			</div>
		</React.Fragment>
	);
};

export default Component;
