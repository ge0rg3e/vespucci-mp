mp.events.add('gamemodeStarted', () => {
	mp.playerAttachments.register('walkieTalkie', 'prop_cs_hand_radio', 28422, new mp.Vector3(0, 0, 0), new mp.Vector3(0, 0, 0));

	mp.chat.addMessageType({
		id: `walkieTalkie`,
		icon: `fa-solid fa-walkie-talkie`,
		color: `#f59518`,
		translations: {
			EN: () => `Walkie Talkie`,
			RO: () => `Walkie Talkie`
		}
	});
});

mp.events.add('loadPlayerDefaults', (player) => {
	// Make sure is available in client-side for detection of CTRL +X , X etc.
	player.addClientsideVariables('walkieTalkie');

	// Check if they own a walkie
	const hasItem = player.getInventoryItemMatch({ itemId: 10 });

	// Setting default values..
	player.updateVars({
		walkieTalkie: {
			usable: false, // If they can raise & use the walkie at all
			active: false, // If they are speaking right now (of course not)
			holding: false, // If they have the walkie talkie in their hand
			enabled: true, // Default true so i's not affecting new players.
			frequency: null // The default frequency
		}
	});

	// @Reminder: This is called like this so we can update his interface state.
	if (hasItem) {
		player.setWalkieUsable(true);
	}

	// @Reminder: Same thing. So the interface is kept in sync.
	const isEnabled = player.meta.walkieTalkieEnabled !== undefined ? player.meta.walkieTalkieEnabled : true; // Default on to now have issues with new beginners.)

	// If they had it off before..
	if (player.vars.walkieTalkie.enabled !== isEnabled) {
		player.setWalkieEnabled(isEnabled);
	}

	// If they had a frequency saved in their meta
	if (player.meta.walkieTalkieFrequency) {
		player.setWalkieFrequency(player.meta.walkieTalkieFrequency);
	}
});

mp.events.add(`onInventoryUpdate`, (player: PlayerMp) => {
	// Check if they own a walkie still. (They may dropped, destroyed or traded their walkie)
	const hasItem = player.getInventoryItemMatch({ itemId: 10 });

	// They used to own a walkie but no longer. We must stop them from being able to use it.
	if (player.vars.walkieTalkie.usable === true && !hasItem) {
		player.setWalkieUsable(false);
	}

	// They own a walkie now so let's mark it so.
	if (!player.vars.walkieTalkie.usable && hasItem) {
		player.setWalkieUsable(true);
	}

	return true;
});

mp.events.add(`walkieTalkie:startedSpeaking`, (player: PlayerMp) => {
	// Play the sound effect for when he speaks.
	player.playSoundEffect(`${`__ASSETS__`}/audios/items/walkieTalkie/on.ogg`, { volume: 0.3 });

	// Connect this player so all other people can hear him.
	mp.players.forEachLoggedIn((target: PlayerMp) => {
		// // We don't want to hear ourselves.
		if (target == player) return false;

		// Not on the same frequency
		if (target.vars.walkieTalkie.frequency !== player.vars.walkieTalkie.frequency) return false;

		// They have it turned off.
		if (target.vars.walkieTalkie.enabled === false) return false;

		// They have it disabled voice settings
		if (target.vars.settings.walkieTalkie.enabled === false) return false;

		// The target will now listen to this player.
		target.connectToSpeaker(`walkieTalkie:${player.vars.walkieTalkie.frequency}`, player);

		return true;
	});
	// reminder sa te auda doar aia care si ei au enabled on si aceasi frecevnta
});

mp.events.add(`walkieTalkie:disconnectFrequency`, (player, frequency) => {
	// We will now stop to listen to all players from that walkie frequency that may be speaking.
	mp.players.forEachLoggedIn((target: PlayerMp) => {
		// Not on the same frequency
		if (target.vars.walkieTalkie.frequency !== player.vars.walkieTalkie.frequency) return false;

		// We don't want to deafen ourselves.
		if (target == player) return false;

		// The player will now s	top listening to this target.
		player.disconnectFromSpeaker(`walkieTalkie:${frequency}`, target);
		target.disconnectFromSpeaker(`walkieTalkie:${frequency}`, player);

		return true;
	});
});

mp.events.add(`walkieTalkie:stoppedSpeaking`, (player: PlayerMp) => {
	// Play the sound effect for when he speaks.
	player.playSoundEffect(`${`__ASSETS__`}/audios/items/walkieTalkie/off.ogg`, { volume: 0.15 });

	// We will now stop to listen to all players from admins channel that may be speaking.
	mp.players.forEachLoggedIn((target: PlayerMp) => {
		// // We don't want to deafen ourselves.
		if (target == player) return false;

		// Safety checks
		if (target.vars.walkieTalkie.usable === false) return false; // Does not own walkie talkie
		if (target.vars.walkieTalkie.enabled === false) return false; // They have it turned off

		// Not on the same frequency
		if (target.vars.walkieTalkie.frequency !== player.vars.walkieTalkie.frequency) return false;

		// Is he speaking right now?
		if (target.vars.walkieTalkie.active === false) return false; // He's not speaking.

		// The player will now stop listening to this target.
		player.disconnectFromSpeaker(`walkieTalkie:${player.vars.walkieTalkie.frequency}`, target);

		return true;
	});
});
