import { formatNumber } from '@server/utils/helpers';
import { getLanguagePack } from '@vmp/i18n';
import { DRIVING_LICENSE_COST } from './definitions';
import { setDrivingTestCheckpoint, showBeforeTestStartDialog, startDrivingTest } from './functions';

// @Event: When the player responds to the main dialog.
mp.events.add('onDialogResponse', (player, response) => {
	// Check the player's dialogId
	if (response.dialogId !== 'LicenseCenter.driving.mainDialog') return;

	// Check the response
	if (response.responseKey !== 'F') return;

	// Get the language
	const lang = getLanguagePack('LicenseCenter.Driving.ConfirmMainDialog', player.lang);

	// Variables..
	let buttons = [{ key: 'F', text: lang.get('ConfirmButton') }];
	let content = lang.get('DialogContent', { cost: formatNumber(DRIVING_LICENSE_COST, true) });

	// If the user already has a license active.
	if (player.hasValidLicense('driving') && player.getLicense('driving')!.hours >= 10) {
		buttons = [];
		content = lang.get('DialogContentAlreadyHasLicense');
	}

	// Show it to the player..
	player.showPlayerDialog({
		dialogId: 'LicenseCenter.driving.confirmDialog',
		icon: 'information',
		title: lang.get('DialogTitle'),
		hideInSeconds: null,
		appearInSeconds: 0,
		type: 'message',
		buttons,
		content
	});
});

// @Event: When the player responds to the confirm dialog.
mp.events.add('onDialogResponse', (player, response) => {
	// Check the player's dialogId
	if (response.dialogId !== 'LicenseCenter.driving.confirmDialog') return;

	// Check the response
	if (response.responseKey !== 'F') return;

	// Hide the dialog
	player.hidePlayerDialog();

	const lang = getLanguagePack('LicenseCenter.Driving.ConfirmMainDialog.Responses', player.lang);

	// Does the player have enough money to pay for this license?
	if (!player.hasEnoughMoney(DRIVING_LICENSE_COST)) {
		player.alert({ type: 'error', message: lang.get(`NotEnoughMoney`, { money: DRIVING_LICENSE_COST }) });
		return;
	}

	// Take the money from the player
	player.takeMoney(DRIVING_LICENSE_COST);

	// Start the driving test
	startDrivingTest(player);
});

// @Event: When the player responds to the before start dialogs.
mp.events.add('onDialogResponse', (player, response) => {
	// Destructure the response
	const { dialogId, responseKey, payload } = response;

	// Check the player's dialogId
	if (dialogId !== 'LicenseCenter.Driving.BeforeStartDialog') return;

	// Check the response
	if (responseKey !== 'F') return;

	// Check if the content is the last content
	if (payload.isLastContent) {
		// Get the language
		const lang = getLanguagePack('LicenseCenter.Driving.BeforeStart');

		// Hide the dialog
		player.hidePlayerDialog();

		// Start the driving test
		setDrivingTestCheckpoint(player, 0);

		// Unfreeze the player
		player.freeze({ systemId: 'licenseCenter@driving', toggle: false });

		// Alert the player about 'how to start the engine'
		player.alert({ type: 'info', message: lang.get(`NotificationMessage`) });
	} else {
		// Show the next dialog
		showBeforeTestStartDialog(player, payload.contentIndex + 1);
	}
});
