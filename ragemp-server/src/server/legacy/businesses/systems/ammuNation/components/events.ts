import { showBuyDialog } from './functions';

mp.events.add('business:create', (business: Business) => {
	if (business.type !== 6) return;

	// Create the npcs
	mp.events.call('business:actors.load', business);
});

mp.events.add('business:delete', (business: Business) => {
	if (business.type !== 6) return;

	mp.events.call('business:actors.delete', business);
});

mp.events.add(`businesses:loadDependencies`, (player: PlayerMp, business: Business) => {
	if (business.type !== 6) return;

	// Load the blip
	mp.events.call('business:blip.load', player, business);

	// @Temporary: Create the buypoint
	mp.events.call('business:buyPoint.load', player, business);

	// Load the call to actions for places to buy clothes
	mp.events.call('business:callToActions.load', player, business);
});

mp.events.add(`businesses:removeDependencies`, (player: PlayerMp, business: Business) => {
	if (business.type !== 6) return;

	mp.events.call('business:blip.delete', player, business);
	mp.events.call('business:buyPoint.delete', player, business);
	mp.events.call('business:callToActions.remove', player, business);
});

mp.events.add('onPlayerEnterColshape', async function (player: PlayerMp, colshape: Colshape) {
	const identifier = colshape.identifier;
	const payload = colshape.payload;

	// Checks..
	if (!identifier.includes(`BusinessCallAction`) || !payload) return false;
	if (payload.businessType !== 6) return false;
	if (payload.actionId !== 'buy') return false; // Is not call to action id buy.

	// Variables
	const businessId = payload.businessId;
	const actionId = payload.actionId;

	// Show the dialog
	showBuyDialog(player, { businessId, actionId });

	// Get clerk shop
	const actor = mp.actors.get(`business_${businessId}_seller`);
	if (!actor) return false;

	// Check the NPC speech..
	const isSpeaking = await actor.isAmbientSpeechPlaying();
	if (isSpeaking) return false;

	// Play the speech
	actor.playAmbientSpeechWithVoice('SHOP_GREET', 'S_M_M_AMMUCOUNTRY_WHITE_MINI_01', 'SPEECH_PARAMS_FORCE');
	return;
});

mp.events.add('onPlayerExitColshape', function (player) {
	const dialogs = [`ammuNation.sellerMenu`];
	if (player.vars && player.vars.dialogId && dialogs.find((x: string) => player.vars.dialogId?.includes(x))) {
		player!.hidePlayerDialog();
		return;
	}
	return;
});
