import { logClientsideError } from '@client/general/errors';
import { getLanguage } from '@client/natives/browser';
import { interfacesOpened } from '@client/natives/interfaces';
import { getLanguagePack } from '@vmp/i18n';
import * as rpc from 'rage-rpc';

rpc.on('onDialogInputValueChanged@petrolCan:fill', async (args) => {
	try {
		// If the dialog is no longer opened we don't need this.
		if (!interfacesOpened.includes('dialog')) return false;

		// Extract input value from CEF..
		const { inputValue, payload } = JSON.parse(args);

		// Convert string to INT.
		const value = parseInt(inputValue);

		// Is unable to parse or if value is negative or zero.
		if (isNaN(value) || !value) return false;

		// Get their language
		const language = getLanguage();

		// Get language
		const lang = getLanguagePack(`petrolCan:fillDialog`, language);

		// Format message
		const footer = lang.get(`dialogFooter`, { litres: value, totalCost: parseInt(payload.costPerLitre) * value });

		// Update dialog..
		rpc.triggerBrowsers(`dialog:updateData`, JSON.stringify({ footer }));

		return true;
	} catch (err) {
		await logClientsideError(`petrolCan.dialog@onInputValueChanged`, err);
		return false;
	}
});

rpc.register(`getDialogFooterText@petrolCan:fill`, async (args) => {
	try {
		const { litres, costPerLitre } = JSON.parse(args);

		// Get their language
		const language = getLanguage();

		// Get language
		const lang = getLanguagePack(`petrolCan:fillDialog`, language);

		// Format message
		const footer = lang.get(`dialogFooter`, { litres, totalCost: parseInt(costPerLitre) * litres });

		return footer;
	} catch (err) {
		await logClientsideError(`getDialogFooterText@petrolCan:fill`, err);
		return false;
	}
});
