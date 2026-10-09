import { getVehicleNativeInfo } from '@server/natives/vehicles/components/core';
import { formatNumber } from '@server/utils/helpers';
import { getLanguagePack } from '@vmp/i18n';
import { rentingLocations } from './core';

mp.Player.prototype.showRentingMenuDialog = function (rentingId, noCooldown = false) {
	const location = rentingLocations.find((r) => r.id === rentingId);

	if (!location) return false; // Failed to find the renting menu.

	const lang = getLanguagePack(`RentingLocations:DialogMenu`, this.info.language);

	this.showPlayerDialog({
		dialogId: `rentingLocationsMenu`,
		icon: 'information',
		hideInSeconds: null,
		appearInSeconds: noCooldown ? null : 1,
		type: 'list',
		listProps: {
			columns: [lang.get('Model'), lang.get('CostPerMinute'), `Stock`],
			entries: location.vehicles.map((veh) => {
				const nativeInfo = getVehicleNativeInfo({ model: veh.model });
				if (!nativeInfo) return false;
				return [nativeInfo.displayName, formatNumber(veh.costPerMinute, true), veh.stock];
			})
		},
		buttons: [
			{
				text: lang.get('Select'),
				key: `ENTER`
			}
		],
		title: lang.get('DialogTitle'),
		content: lang.get('DialogContent'),
		payload: {
			rentingLocationId: rentingId
		}
	});

	return;
};

mp.Player.prototype.showRentinginstructionsDialog = function (costPerMinute) {
	const lang = getLanguagePack(`RentingLocations:InstructionsDialog`, this.info.language);

	this.showPlayerDialog({
		dialogId: `rentingInstructions`,
		icon: 'information',
		hideInSeconds: 5,
		appearInSeconds: 1,
		type: 'message',
		title: lang.get('DialogTitle'),
		content: lang.get('DialogContent', { costPerMinute })
	});

	return;
};

declare global {
	interface PlayerMp {
		showRentingMenuDialog(rentingId: number, noCooldown: boolean): void;
		showRentinginstructionsDialog(costPerMinute: number): void;
	}
}

export {};
