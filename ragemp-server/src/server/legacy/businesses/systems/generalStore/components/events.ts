import { getLanguagePack } from '@vmp/i18n';

mp.events.add('business:create', (business) => {
	if (business.type !== 4) return;

	// Create the npcs
	mp.events.call('business:actors.load', business);
});

mp.events.add('business:delete', (business) => {
	if (business.type !== 4) return;

	mp.events.call('business:actors.delete', business);
});

mp.events.add(`businesses:loadDependencies`, (player, business) => {
	if (business.type !== 4) return;

	// Load the blip
	mp.events.call('business:blip.load', player, business);

	// @Temporary: Create the buypoint
	mp.events.call('business:buyPoint.load', player, business);

	// Load the call to actions for places to buy clothes
	mp.events.call('business:callToActions.load', player, business);
});

mp.events.add(`businesses:removeDependencies`, (player, business) => {
	if (business.type !== 4) return;

	mp.events.call('business:blip.delete', player, business);
	mp.events.call('business:buyPoint.delete', player, business);
	mp.events.call('business:callToActions.remove', player, business);
});

mp.events.add('onPlayerEnterColshape', async function (player, colshape) {
	const identifier = colshape.identifier;
	const payload = colshape.payload;

	// Checks..
	if (!identifier.includes(`BusinessCallAction`) || !payload) return false;
	if (payload.businessType !== 4) return false;
	if (payload.actionId !== 'buy') return false; // Is not call to action id buy.

	// Variables
	const lang = getLanguagePack(`BusinessGeneralStore:MainDialog`, player.info.language);
	const buttons = [{ text: lang.get('Use'), key: 'F' }];
	const businessId = payload.businessId;
	const actionId = payload.actionId;

	// Show it to the player..
	player.showPlayerDialog({
		dialogId: `shopMainDialog`,
		icon: 'information',
		hideInSeconds: null,
		appearInSeconds: 1,
		type: 'message',
		buttons,
		title: lang.get('DialogTitle'),
		footer: player.getAdminLevel() !== 0 ? lang.get('DialogFooter', { id: businessId }) : undefined,
		content: lang.get('DialogContent'),
		payload: {
			businessId,
			actionId
		}
	});

	// Get clerk shop
	const actor = mp.actors.get(`business_${businessId}_seller`);
	if (!actor) return false;

	// Check the NPC speech..
	const isSpeaking = await actor.isAmbientSpeechPlaying();
	if (isSpeaking) return false;

	// Play the speech
	actor.playAmbientSpeechWithVoice('SHOP_GREET', 'MP_M_SHOPKEEP_01_PAKISTANI_MINI_01', 'SPEECH_PARAMS_FORCE_NORMAL_CLEAR');
	return;
});

mp.events.add('onPlayerExitColshape', function (player) {
	const dialogs = [`shopMainDialog`];
	if (player.vars && player.vars.dialogId && dialogs.find((x: string) => player.vars.dialogId?.includes(x))) {
		player!.hidePlayerDialog();
		return;
	}
	return;
});

mp.events.add('loadPlayerDefaults', (player) => {
	// Set this default to null..
	player.updateVars({
		shop: null
	});
});
