import { isChannelResumable } from './functions';

mp.events.add('loadPlayerDefaults', (player: PlayerMp) => {
	// Get last voice settings preferences stored in cache.
	const lastVoiceSettings = player.meta.voiceChat || {};

	// Determinate the channel to resume
	let channel = null; // Local chat

	// We will check if they have a last channel and if yes, we need to know if they're joinable.
	if (lastVoiceSettings.channel && isChannelResumable(player, lastVoiceSettings.channel)) {
		channel = lastVoiceSettings.channel; // They still can join.
	}

	// Mark this variable to be available in client-side.
	player.addClientsideVariables('voiceChat');

	// Set the player defaults regarding his voice chat
	player.updateVoiceSettings({
		// The channel we're speaking on. Channels are global voice chats. Local chat is null.
		channel,

		// Means he's not speaking right now.
		active: false,

		// This is a sub-system we made to make sure that one voice system won't disconnect the players by mistake.
		lines: [],

		// World Chat Settings
		range: lastVoiceSettings.range || 'normal'
	});
});

mp.events.add('playerQuit', (player) => {
	if (!player.vars || !player.vars.loggedIn) return false;

	// Is this target having a line connected to us? If so we need to clear the player id from his array to clear in case another player connects on that player slot.
	mp.players.forEach((target: PlayerMp) => {
		// Do we have a connection line?
		const match = target.vars.voiceChat.lines?.find((c) => c.playerId === player.id);
		if (!match) return false; // no connection.

		// We remove any lines.
		target.updateVoiceSettings({ lines: target.vars.voiceChat.lines?.filter((c) => c.playerId !== player.id) });

		return true;
	});

	return true;
});
