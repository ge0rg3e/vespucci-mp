import { PersonalVehicles } from '@server/legacy/vehicles/components/core';
import { getLanguagePack } from '@vmp/i18n';
import { Dealerships, getDealershipInterfaceData } from './core';

mp.Player.prototype.showDealershipMenu = function (dealershipId, noCooldown = false) {
	const ds = Dealerships.find((d) => d.id === dealershipId);
	if (!ds) return false; // Failed to find the dealership.

	const lang = getLanguagePack(`Dealership:DialogMenu`, this.info.language);

	const buttons = [];

	if (!ds.isDisabled || this.checkPermission('feature.manageDealershipStock')) {
		buttons.push({
			text: lang.get('SeeVehicles'),
			key: `F`
		});
	}

	if (this.checkPermission('feature.manageDealershipStock')) {
		buttons.push({
			text: lang.get('ManageStock'),
			key: `G`
		});
	}

	this.showPlayerDialog({
		dialogId: `dealershipMenu`,
		icon: 'information',
		hideInSeconds: null,
		appearInSeconds: noCooldown ? null : 1,
		type: 'message',
		buttons,
		title: lang.get('DialogTitle'),
		footer: this.getAdminLevel() !== 0 ? lang.get('DialogFooter', { id: ds.id }) : undefined,
		content: lang.get('DialogContent', { disabled: ds.isDisabled }),
		payload: {
			dealershipId
		}
	});

	return;
};

mp.Player.prototype.refreshDealershipInterfaceData = async function () {
	if (this.vars.dealershipId === null) return false;

	const dealership = await getDealershipInterfaceData(this.vars.dealershipId);
	if (!dealership) return false;

	// Send the data to the interface
	this.triggerSocketEvent(`updateDealershipInterfaceData`, {
		dealership,
		localInfo: {
			admin: this.getAdminLevel(),
			balance: {
				cash: this.info.money,
				beachCoins: this.info.beachCoins
			},
			currentVehicles: PersonalVehicles.filter((v) => v.ownerId === this.info.id).map((v) => ({ id: v.id }))
		}
	});
	return true;
};

declare global {
	interface PlayerMp {
		showDealershipMenu(dealershipId: number, noCooldown: boolean): void;
		refreshDealershipInterfaceData(): void;
	}
}

export {};
