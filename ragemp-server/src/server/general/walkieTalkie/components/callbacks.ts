import { logError } from '@server/utils/helpers';
import { getLanguagePack } from '@vmp/i18n';
import * as rpc from 'rage-rpc';

/**
 * This event is called when the player presses and holds down B and wants to speak.
 * It's the moment when we will connect him to all the player nearby him or from his channel.
 */

rpc.on('walkieTalkie:startSpeaking', async (_, { player }: rpc.ProcedureInfo) => {
	try {
		if (!player) return false; // Avoiding TS Error.

		// They don't own one.
		if (!player.vars.walkieTalkie.usable) return false;

		// They don't have it turned on.
		if (!player.vars.walkieTalkie.enabled) return false;

		// They don't have a valid frequency
		if (player.vars.walkieTalkie.frequency === null) return false;

		// Mark that the player is speaking right now.. (Required for Voice System to work)
		player.updateVoiceSettings({ active: true });

		// Mark them as active
		player.setWalkieActive(true);

		// Invoke this event which is informing  us that this player started speaking
		// So we can do code in different places which is about connecting the player to the correct targets.
		mp.events.call(`walkieTalkie:startedSpeaking`, player);

		return true;
	} catch (err) {
		await logError(`walkieTalkie:startSpeaking`, err);
		return false;
	}
});

/**
 * This event is called when the player stops holding B and wants to stop speaking.
 * It's the moment when we will disconnect him from the players that listened to him.
 */

rpc.on('walkieTalkie:stopSpeaking', async (_, { player }: rpc.ProcedureInfo) => {
	try {
		if (!player) return false; // Avoiding TS Error.

		// Is he speaking right now? if not..
		if (player.vars.walkieTalkie.active === false) return false;

		// Mark that the player is speaking right now.. (Required for Voice System to work)
		player.updateVoiceSettings({ active: false });

		// Mark that the player is not speaking anymore..
		player.setWalkieActive(false);

		// Invoke this event which is informing  us that this player stopped speaking
		mp.events.call(`walkieTalkie:stoppedSpeaking`, player);
		return true;
	} catch (err) {
		await logError(`walkieTalkie:stopSpeaking`, err);
		return false;
	}
});

/**
 * This event is called when the player shuts off the walkie talkie (or on) from CEF
 */

rpc.on('walkieTalkie:setEnabled', async (args, { player }: rpc.ProcedureInfo) => {
	try {
		if (!player) return false; // Avoiding TS Error.

		const { enabled } = JSON.parse(args);

		// Mark that the player is not speaking anymore..
		player.setWalkieEnabled(enabled);

		// If now is turned off..
		if (enabled === false && player.vars.walkieTalkie.frequency !== null) {
			// Invoke this event so we disconnect the ones that are currently speaking.
			mp.events.call(`walkieTalkie:disconnectFrequency`, player, player.vars.walkieTalkie.frequency);
		}

		return true;
	} catch (err) {
		await logError(`walkieTalkie:setEnabled`, err);
		return false;
	}
});

/**
 * The client-side will update this variable to make sure they are up-to-date.
 */

rpc.on('walkieTalkie:updateHoldingAnimationState', async (args, { player }: rpc.ProcedureInfo) => {
	try {
		if (!player) return false; // Avoiding TS Error.

		const { holding } = JSON.parse(args);

		// Update variable
		player.setWalkieHolding(holding);

		return true;
	} catch (err) {
		await logError(`walkieTalkie:updateAnimationState`, err);
		return false;
	}
});

// @Reminder: There is also a command /wt that must be maitnained.

rpc.register('walkieTalkie:setFrequency', async (args, { player }: rpc.ProcedureInfo) => {
	try {
		if (!player) return false; // Avoiding TS Error.

		// Get the language
		const lang = getLanguagePack('walkieTalkie:setFrequency', player.lang);

		// Get the frequency
		const { frequency } = JSON.parse(args);

		// Parse it for a test.
		let parsedNumber = parseInt(frequency);

		// Format the new frequency
		let newFrequency = frequency;

		// They want to reset it or set it to zero.
		if (isNaN(parsedNumber) || parsedNumber < 1 || parsedNumber === 0) {
			newFrequency = null;
		}

		// Update variable
		// @TBD: Oriunde e folosit setWalkieTalkieFrequency sa facem validare daca poate intra pe frecventa, de ex la relogare cand re-aplic frecventa.
		player.setWalkieFrequency(newFrequency ? `WT-${frequency}` : null);

		// Format the new message
		let message = newFrequency == null ? lang.get(`ResetMessage`) : lang.get(`ConfirmationMessage`, { frequency: `WT-${frequency}` });

		// Alert
		player.alert({ type: newFrequency == null ? 'info' : 'success', message });

		// Track
		player.createAmplitudeEvent(`Set Walkie Frequency`, { method: 'command', newFrequency: frequency === null ? 'Reset' : `WT-${frequency}` });

		return true;
	} catch (err) {
		await logError(`walkieTalkie:setFrequency`, err);
		return false;
	}
});
