import { logError } from '@server/utils/helpers';

mp.Player.prototype.giveAttachment = function (identifier) {
	// Get current array
	const currentArr = this.vars.attachments;

	// Avoid having duplicates.
	if (currentArr.includes(identifier)) return;

	// Is this attachemnt registered on the server -- If not let's log it as a soft error.
	if (!mp.playerAttachments.getById(identifier)) {
		logError(`player.giveAttachment`, `Attachment not registered: ${identifier}`);
		return false;
	}

	// Push the hash..
	currentArr.push(identifier);

	// Save
	this.updateVars({ attachments: currentArr });

	return true;
};

mp.Player.prototype.removeAttachment = function (identifier) {
	// Get current array
	const currentArr = this.vars.attachments;

	// Get index quick
	const index = currentArr.indexOf(identifier);

	// Not existing.
	if (index === -1) return;

	// Push the hash..
	currentArr.splice(index, 1);

	// Save
	this.updateVars({ attachments: currentArr });

	return true;
};

mp.Player.prototype.hasAttachment = function (identifier) {
	// Get current array
	const currentArr = this.vars.attachments;

	// Get index quick
	const index = currentArr.indexOf(identifier);

	return index == -1 ? false : true;
};

declare global {
	interface PlayerMp {
		giveAttachment(identifier: RegisteredPlayerAttachmentIds): void;
		removeAttachment(identifier: RegisteredPlayerAttachmentIds): void;
		hasAttachment(identifier: RegisteredPlayerAttachmentIds): boolean;
	}
}

export {};
