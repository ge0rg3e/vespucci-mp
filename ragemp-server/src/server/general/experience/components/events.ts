import gameplayMechanicExperience from './definitions';

mp.events.add(`everyMinuteForPlayerTimer`, (player) => {
	if (player.vars.awayFromKeyboard.enabled) {
		player.giveExperience(gameplayMechanicExperience.EXP_RECEIVED_PER_MINUTE);
	}
});
