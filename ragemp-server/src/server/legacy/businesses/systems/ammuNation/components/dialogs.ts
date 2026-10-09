import { getLanguagePack } from '@vmp/i18n';
import { showShopInterface } from './functions';

mp.events.add('onDialogResponse', async function (player, response) {
	if (response.dialogId !== 'ammuNation.sellerMenu') return false;

	const responseKey = response.responseKey;
	const lang = getLanguagePack('BusinessAmmuNation:MainDialog@Responses', player.lang);

	if (responseKey === 'F') {
		if (player.vehicle) return player.hidePlayerDialog();
		if (player.vars.dialogCooldown) return;

		// Show interface..
		return showShopInterface(player, response);
	}

	// If is the get license
	if (responseKey === 'G') {
		player.hidePlayerDialog();

		// Show task notification
		player.toast({ type: 'info', message: lang.get('TaskNotification') });

		// Task the player to go there
		player.call('actor:taskGoStraightToCoord', [
			player,
			{
				x: 8.39,
				y: -1100.988,
				z: 29.797
			},
			6,
			5000,
			59.347,
			0
		]);

		return true;
	}

	// Hide..
	if (response.responseKey === 'ESC') return player.hidePlayerDialog();

	return false;
});

// mp.events.add('onActorStreamIn', (player, actor, isController) => {
// 	if (actor.identifier !== 'business_35_trainer' || !isController) return false;

// 	const entry = mp.actors.get(actor.identifier);
// 	if (!entry) return false;

// 	console.log('Actor found');
//  });

//  Animatie cool pt business_35_trainer
// entry.taskPlayAnim('amb@code_human_police_investigate@idle_a', 'idle_b', 1, 0, 1, 0, 0, false, false, false);
