import { getLanguagePack } from '@vmp/i18n';
import { LicenseCenterEnum } from './enums';
import { WEAPON_LICENSE_COST, WEAPON_LICENSE_MIN_LEVEL } from './events';
import { showTrainingDialog } from './functions';
import { formatNumber } from '@server/utils/helpers';

// @Event: When the player responds to the main dialog.
mp.events.add('onDialogResponse', async function (player, response) {
	if (response.dialogId !== 'ammuNation.licenseCenter.mainDialog') return false;

	if (response.responseKey === 'F') {
		// Get the language
		const lang = getLanguagePack('AmmuNation.LicenseCenter.ConfirmMainDialog', player.lang);

		// Variables..
		let buttons = [{ key: 'F', text: lang.get('ConfirmButton') }];
		let content = lang.get('DialogContent', { cost: formatNumber(WEAPON_LICENSE_COST, true), level: WEAPON_LICENSE_MIN_LEVEL });

		// If the user already has a license active.
		if (player.hasValidLicense('weapon') && player.getLicense('weapon')!.hours >= 10) {
			buttons = [];
			content = lang.get('DialogContentAlreadyHasLicense');
		}

		// Show it to the player..
		player.showPlayerDialog({
			dialogId: `ammuNation.licenseCenter.confirmDialog`,
			icon: 'information',
			hideInSeconds: null,
			appearInSeconds: 0,
			type: 'message',
			buttons,
			title: lang.get('DialogTitle'),
			content
		});
	}
	return false;
});

// @Event: When the player responds to the confirm dialog.
mp.events.add('onDialogResponse', async function (player, response) {
	if (response.dialogId !== 'ammuNation.licenseCenter.confirmDialog') return false;

	if (response.responseKey === 'F') {
		const lang = getLanguagePack('AmmuNation.LicenseCenter.ConfirmMainDialog.Responses', player.lang);

		// Does the player have enough money to pay for this license?
		if (!player.hasEnoughMoney(WEAPON_LICENSE_COST)) {
			player.alert({ type: 'error', message: lang.get(`NotEnoughMoney`, { money: WEAPON_LICENSE_COST }) });
			player.hidePlayerDialog();
			return true;
		}

		// If the player level is not high enough to get this license
		if (player.info.level < WEAPON_LICENSE_MIN_LEVEL) {
			player.alert({ type: 'error', message: lang.get(`LevelNotEnough`, { level: WEAPON_LICENSE_MIN_LEVEL }) });
			player.hidePlayerDialog();
			return true;
		}

		// We inform the server to start the license test.
		mp.events.call('testingCenter@weapon.start', player);
	}

	return false;
});

// @Event: When the player responds to the in-test dialog informations.
mp.events.add('onDialogResponse', async function (player, response) {
	// Is not the training dialog.
	if (response.dialogId !== 'ammuNation.licenseCenter.trainingDialog') return false;

	// If we're still through the first 3 steps..
	if (response.payload.step < 4) {
		// Show the training dialog now.
		showTrainingDialog(player, response.payload.step + 1);
	} else {
		// Hide the dialog
		await player.hidePlayerDialog();

		// Give player pistol weapon
		player.setWeapon(
			19,
			999,
			{
				ammo: 18
			},
			{ forceInHand: true }
		);

		// Start the test
		player.triggerClientEvent(`ammuNation.licenseCenter@startExam`);
	}

	return true;
});
