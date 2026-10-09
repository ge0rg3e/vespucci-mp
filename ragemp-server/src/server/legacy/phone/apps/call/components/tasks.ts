import { phoneLines, updateParticipant } from './functions';

const checkCallCosts = () => {
	phoneLines.forEach((phoneLine) => {
		// Get the caller participant
		const caller = phoneLine.participants.find((c) => c.role === 'caller');
		if (!caller) return false;

		// Get the player..
		const player = mp.players.atPhoneNumber(caller?.phoneNumber);
		if (!player) return false;

		// Check his phone credits
		const phoneCredits = player.info.phoneCredits;

		// If phone credits ran out
		if (phoneCredits < 1) {
			const line = player.getPhoneLine();

			// This player doesn't have a phone line active.
			if (!line) return;

			// Update participant data to show on cellphone overlay that he left.
			updateParticipant(line.id, player.info.phoneNumber, { status: 'hangedUp' });

			// Load him the interface. (@Reminder: the interface will make him fetch the data from server)
			player.triggerBrowserEvent(`phoneCall:setOverlayState`, { active: false });

			// Mark it on amplitude for other players
			player.createAmplitudeEvent(`Ran out of Phone Credits`);

			// Inform the player
			player.showPhoneAlert(`Ran out of Credits`, `You don't have credits anymore to continue this call. Go to a general store and buy more phone credits.`);

			return false;
		}

		// Reduce his credits by minus 1.
		player.info.phoneCredits -= 1;

		return true;
	});
};

setInterval(checkCallCosts, 1 * 60 * 1000); // once ever min.
