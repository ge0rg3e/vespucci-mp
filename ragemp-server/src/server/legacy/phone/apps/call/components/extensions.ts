// get call line

import { phoneLines } from './functions';

mp.Player.prototype.getPhoneLine = function () {
	// Find a line that has this player as a participant with active status or pending.
	const line = phoneLines.find((l) => l.participants.find((p) => p.phoneNumber === this.info.phoneNumber && ['active', 'pending'].includes(p.status)));

	// If we found the line
	if (line) {
		const participant = line.participants.find((p) => p.phoneNumber === this.info.phoneNumber)!;

		// Return the desired result
		return {
			id: line.id,
			role: participant.role,
			phoneNumber: participant.phoneNumber,
			joinedAt: participant.joinedAt,
			status: participant.status
		};
	}

	return null; // Return null if no participant or line found
};

mp.Player.prototype.hangUpCall = function (type) {
	// Get the player phone line
	const playerLine = this.getPhoneLine();

	// If current player is not part of any phone line.
	if (playerLine === null) return null;

	// Make the player hang up via this event so we can re-use this event in-game later.
	mp.events.call(`phone:hangUp`, this, type);

	return false;
};

declare global {
	interface PlayerMp {
		getPhoneLine(): { id: string; role: phoneLineRoles; phoneNumber: string; joinedAt: Date | null; status: phoneLineStatus } | null;
		hangUpCall(type: 'automatic' | 'manual'): void;
	}
}

export {};
