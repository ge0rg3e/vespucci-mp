import { hasElapsedTime } from '@server/utils/helpers';
import { getLanguagePack } from '@vmp/i18n';
import { calculateHealthReduced, calculateHungerReducedToReachFifty } from './functions';

mp.events.add('loadPlayerDefaults', (player: PlayerMp) => {
	player.updateVars({
		// Status
		hungerPoints: player.info.hungerPoints,
		thirstPoints: player.info.thirstPoints,

		// States
		isDrinking: false,
		isEating: false,
		isSmoking: false,
		lastThirstWarning: null,

		// Hold
		holdConsumable: { active: false, id: null, quantity: 0 }
	});

	// Put these in client-side
	player.addClientsideVariables(['holdConsumable', 'hungerPoints', 'thirstPoints']);
});

mp.events.add('everyMinuteForPlayerTimer', (player: PlayerMp) => {
	// Check if the player is logged in
	if (!player.vars.loggedIn) return false;

	// In how much time we will reach 50% ?
	const pointsToReduce = calculateHungerReducedToReachFifty(150);

	// We increase.
	player.giveHungerPoints(pointsToReduce);
	player.giveThirstPoints(pointsToReduce);

	// Decrease health bar when hunger or thirst is above 50%
	if (player.getHungerPoints() >= 50 || player.getThirstPoints() >= 50) {
		// Reduce..
		player.health -= calculateHealthReduced(player.getHungerPoints(), player.getThirstPoints());

		// We just killed him, we should give him time to eat something.
		if (player.health < 1) {
			player.setHungerPoints(30);
			player.setThirstPoints(30);
		}
	}

	return true;
});

mp.events.add('everyMinuteForPlayerTimer', (player: PlayerMp) => {
	// Checks..
	const isHunger = player.getHungerPoints() >= 50 ? true : false;
	const isThirst = player.getThirstPoints() >= 50 ? true : false;

	// Is hunger anymore?
	if (!isHunger && !isThirst) return false; // Nothing to say.

	// Get language
	const lang = getLanguagePack(`thirstHunger:Notifications`, player.lang);

	// Already had notification in last 5 minutes.
	if (player.vars.lastThirstWarning && !hasElapsedTime(player.vars.lastThirstWarning, 5, 'minutes')) return false;

	// Send message
	const msgHeading = lang.get(`Warning`);
	const msgContent = lang.get(isHunger && isThirst ? `isHungryAndThirsty` : isHunger ? `isHungry` : `isThirst`);

	// Warn..
	player.alert({
		type: 'warning',
		heading: msgHeading,
		message: msgContent,
		seconds: 30
	});

	// Keep track
	player.updateVars({
		lastThirstWarning: new Date()
	});

	return true;
});

mp.events.add('onPlayerSaveData', (player) => {
	// Save data after quit
	player.saveInfo({
		hungerPoints: parseFloat(player.vars.hungerPoints.toString()),
		thirstPoints: parseFloat(player.vars.thirstPoints.toString())
	});
});
