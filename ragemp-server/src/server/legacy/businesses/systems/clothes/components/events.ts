import { showOptionsDialog } from './functions';

mp.events.add(`businesses:loadDependencies`, (player, business) => {
	if (business.type !== 1) return;

	// Load the blip
	mp.events.call('business:blip.load', player, business);

	// @Temporary: Create the buypoint
	mp.events.call('business:buyPoint.load', player, business);

	// Load the call to actions for places to buy clothes
	mp.events.call('business:callToActions.load', player, business);
});

mp.events.add(`businesses:removeDependencies`, (player, business) => {
	if (business.type !== 1) return;

	mp.events.call('business:blip.delete', player, business);
	mp.events.call('business:buyPoint.delete', player, business);
	mp.events.call('business:callToActions.remove', player, business);
});

mp.events.add('onPlayerEnterColshape', function (player, colshape) {
	const identifier = colshape.identifier;
	const payload = colshape.payload;

	if (!identifier.includes(`BusinessCallAction`) || !payload) return false;

	if (payload.businessType !== 1) return false;

	showOptionsDialog(player, payload.businessId, payload.actionId);
	return;
});

mp.events.add('onPlayerExitColshape', function (player) {
	const dialogs = [`clothesShopDialog`];
	if (player.vars && player.vars.dialogId && dialogs.find((x: string) => player.vars.dialogId?.includes(x))) {
		player!.hidePlayerDialog();
		return;
	}
	return;
});

mp.events.add('playerQuit', (player) => {
	if (player.vars && player.vars.loggedIn) {
		player.saveClothes(player.info.clothes); // saving clothes to db.
	}
});
