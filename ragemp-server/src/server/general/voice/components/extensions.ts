/**
 * This function will connect the player to his target. Once that connection is done, the player will hear the target's microphone.
 */

mp.Player.prototype.connectToSpeaker = function (line, target) {
	// If they already have a line connected means they're already connected via this very lane. Bug?
	if (this.vars.voiceChat.lines?.find((c) => c.id === line && c.playerId === target.id)) return false;

	// We will record this new line of voice channeling.
	this.updateVoiceSettings({ lines: [...(this.vars.voiceChat.lines || []), { id: line, playerId: target.id }] });

	// We will now make this player listen to target's microphone
	target.enableVoiceTo(this);

	// console.log(`Connected voice channel - ${this.info.username} to speaker ${target.info.username}`);

	return true;
};

/**
 * This function will disconnect the player from that target. The player won't hear that target anymore.
 */

mp.Player.prototype.disconnectFromSpeaker = function (line, target) {
	// Get the index..
	const index = this.vars.voiceChat.lines!.findIndex((c) => c.id === line && c.playerId === target.id);

	// It means they've never been connected via this line.
	if (index === -1) return false;

	// We will record this new line of voice channeling.
	const currentLines = this.vars.voiceChat.lines || [];
	currentLines.splice(index, 1); // removing it.

	// Saving..
	this.updateVoiceSettings({ lines: currentLines });

	// Check now is there any other voice line in need of this voice connection? EX: if they use is for phone, we can't disconnect them.
	const neededLine = this.vars.voiceChat.lines?.findIndex((c) => c.playerId === target.id);

	// It means some other voice line is still needing this. Therefore we should not disconnect it yet.
	if (neededLine !== -1) return false;

	// We will now connect this player to his target
	target.disableVoiceTo(this);

	// console.log(`Disconnected voice channel - ${this.info.username} from speaker ${target.info.username}`);
	return true;
};

mp.Player.prototype.updateVoiceSettings = function (settings) {
	// Format new settings
	const newSettings = {
		...(this.vars.voiceChat || {}), // current changes
		...settings // new changes
	};

	// Update variable..
	this.updateVars({ voiceChat: newSettings });

	// Update this for client-side.
	this.setVariable(`@voiceSettings`, newSettings);

	// Update HUD too
	this.triggerBrowserEvent(`voice:hud.onUpdate`, {
		active: newSettings.active
	});
};

declare global {
	interface PlayerMp {
		connectToSpeaker(line: string, target: PlayerMp): void;
		disconnectFromSpeaker(line: string, target: PlayerMp): void;
		updateVoiceSettings(settings: Partial<VoiceChatSettings>): void;
	}
}

export {};
