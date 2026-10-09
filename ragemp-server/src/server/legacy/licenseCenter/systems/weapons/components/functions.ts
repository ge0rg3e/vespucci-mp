import { logError } from '@server/utils/helpers';
import { getLanguagePack } from '@vmp/i18n';

/**
 * This will show the main dialog that allows the user to press F to take the test.
 */

export const showMainDialog = async (player: PlayerMp, meta: { businessId: number; actionId: string }) => {
	try {
		// Get the language
		const lang = getLanguagePack('AmmuNation.LicenseCenter.MainDialog', player.lang);

		// The buttons that will be shown..
		let buttons = [{ text: lang.get('GetLicenseButton'), key: 'F' }];

		// Show it to the player..
		player.showPlayerDialog({
			dialogId: `ammuNation.licenseCenter.mainDialog`,
			icon: 'information',
			hideInSeconds: null,
			appearInSeconds: 1,
			type: 'message',
			buttons,
			title: lang.get('DialogTitle'),
			content: lang.get('DialogContent'),
			payload: {
				businessId: meta.businessId,
				actionId: meta.actionId
			}
		});
	} catch (err) {
		await logError(`business.ammuNation.licenseCenter.showMainDialog`, err);
	}
};

/**
 *
 * @param player
 * @param dialogStep The step in the training to show the dialog accordingly.
 */

export const showTrainingDialog = async (player: PlayerMp, dialogStep: number) => {
	try {
		// Get the language
		const lang = getLanguagePack('AmmuNation.LicenseCenter.TrainingDialog', player.lang);

		// The buttons to show.
		const buttons = [{ text: lang.get(dialogStep === 4 ? 'StartKey' : 'ContinueKey'), key: 'F' }];

		const appearInSeconds = dialogStep === 1 ? 1 : 0;

		// Show it to the player..
		player.showPlayerDialog({
			dialogId: `ammuNation.licenseCenter.trainingDialog`,
			icon: 'information',
			hideInSeconds: null,
			appearInSeconds,
			type: 'message',
			buttons,
			title: lang.get(`stepTitle:${dialogStep}`),
			content: lang.get(`stepContent:${dialogStep}`),
			payload: {
				// This will make sure they can't press Escape to Dismiss the Dialog.
				discapeEscapeDialog: true,
				// The current step. Is important.
				step: dialogStep
			}
		});
	} catch (err) {
		await logError(`business.ammuNation.licenseCenter.showTrainingDialog`, err);
	}
};
