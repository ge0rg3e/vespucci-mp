mp.events.add('playerLoggedInDeath', (player) => {
	// Stop conversation on death
	player.hideConversation();
});
