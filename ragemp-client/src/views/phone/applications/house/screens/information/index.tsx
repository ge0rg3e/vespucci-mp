import { formatNumber } from '@/utils/helpers';
import moment from 'moment';
import { AppState } from '../..';

// Components

import NavigationHeader from '@phone/components/ui/navigationHeader';
import List from '@/views/phone/components/ui/list';

const Component = () => {
	const { data, lang } = AppState();

	const dataListed = [
		{
			label: lang.get('Info:Level'),
			value: data.houseData.level
		},
		{
			label: lang.get('Info:Price'),
			value: formatNumber(data.houseData.price, true)
		},
		{
			label: lang.get('Info:SafeBalance'),
			value: formatNumber(data.houseData.balance, true)
		},
		{
			label: lang.get('Info:PurchasedAt'),
			value: moment(data.houseData.purchasedAt).format('DD.MM.YYYY, HH:mm')
		},
		{
			label: lang.get('Info:Garage'),
			/* eslint-disable */
			value: data.houseMeta.garage
				? lang.get('Info:GarageSlots', {
						slots: data.houseMeta.garageInterior.coords.parkings.length
				  })
				: lang.get('Info:NoGarageSlots')
			/* eslint-enable */
		},
		{
			label: lang.get('Info:HouseSize'),
			value: lang.get(`Info:HouseSizeValue`, { size: data.houseData.upgradeLevel })
		},
		{
			label: lang.get('Info:HouseInterior'),
			value: `${data.houseData.interiorId}`
		},
		{
			label: lang.get('Info:Door'),
			value: lang.get('Info:DoorLocked', { bool: data.houseData.locked })
		},
		{
			label: lang.get('Info:Id'),
			value: data.houseData.id
		}
	];

	return (
		<div className="screen information">
			<NavigationHeader theme="light" title={lang.get('Navigation:Information')} />
			<List theme="light" items={dataListed} />
		</div>
	);
};

export default Component;
