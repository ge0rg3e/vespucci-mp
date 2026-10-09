mp.events.add('voiceChat:startedSpeaking', (player) => {
	// He's not using voice channel for admins only.
	if (player.vars.voiceChat.channel !== 'admins') return false;

	// This player is not an admin therefore he cannot use this channel.
	if (player.getAdminLevel() === 0) return false;

	// Connect this player so all other admins can hear him.
	mp.players.forEachLoggedIn((target: PlayerMp) => {
		// This target is not an admin.
		if (target.getAdminLevel() === 0) return;

		// We don't want to hear ourselves.
		if (target == player) return false;

		// Not on admin channel.
		if (target.vars.voiceChat.channel !== 'admins') return false;

		// The target will now listen to this player.
		target.connectToSpeaker(`channel:admins`, player);

		return true;
	});
	return true;
});

mp.events.add(`voiceChat:changingChannels`, (player, oldChannel) => {
	// He wasn't using the channel for admins.
	if (oldChannel !== 'admins') return false;

	// We will now stop to listen to all players from admins channel that may be speaking.
	mp.players.forEachLoggedIn((target: PlayerMp) => {
		// Not on admin channel.
		if (target.vars.voiceChat.channel !== 'admins') return false;

		// Is he speaking right now?
		if (target.vars.voiceChat.active === false) return false; // He's not speaking.

		// We don't want to hear ourselves.
		if (target == player) return false;

		// The player will now stop listening to this target.
		player.disconnectFromSpeaker(`channel:admins`, target);

		return true;
	});

	return true;
});

mp.events.add('voiceChat:stoppedSpeaking', (player) => {
	// He's not using voice channel for admins only.
	if (player.vars.voiceChat.channel !== 'admins') return false;

	// Disconnect this player from all other admins that can hear him.
	mp.players.forEachLoggedIn((target: PlayerMp) => {
		// Not on admin channel.
		if (target.vars.voiceChat.channel !== 'admins') return false;

		// We don't want to hear ourselves.
		if (target == player) return false;

		// The target will now stop listening to this player.
		target.disconnectFromSpeaker(`channel:admins`, player);

		return true;
	});

	return true;
});
