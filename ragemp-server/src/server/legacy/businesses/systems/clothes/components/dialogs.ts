import dimensions from '@server/definitions/dimensions';
import { Businesses } from '@server/legacy/businesses/components/core';
import { getLanguagePack } from '@vmp/i18n';

mp.events.add('onDialogResponse', async function (player: PlayerMp, response: DialogResponse) {
	const lang = getLanguagePack(`BusinessClothes:OptionsDialog`, player.info.language);

	if (response.dialogId !== 'clothesShopDialog') return false;

	if (player.model !== (player.info.clothes.gender === 'male' ? mp.joaat('mp_m_freemode_01') : mp.joaat('mp_f_freemode_01'))) {
		return player.alert({ type: 'error', message: lang.get('invalidPlayerModel') });
	}

	const responseKey = response.responseKey;

	if (responseKey === 'F' || (responseKey === 'G' && player.checkPermission('feature.useClothesManagement'))) {
		if (player.vehicle) return player.hidePlayerDialog();
		if (player.vars.dialogCooldown) return; // let the fuckers wait a bit so the last camera action can finish

		// Preparing the player..
		player.stopAnimation(); // bugfix: If vehicle is nearby sometimes the player will start the action of entering a vehicle.
		player.hidePlayerDialog();

		// Get buypoint coords for the camera
		const business = Businesses.find((b) => b.id === response.payload.businessId);
		if (!business) return false;

		// Get the action..
		const action = business.locations.callToActions.find((a) => a.id === response.payload.actionId);
		if (!action) return false;

		// Updating business id
		player.updateVars({
			businessUsed: {
				id: response.payload.businessId
			}
		});

		// Setting the vw...
		player.dimension = player.id + dimensions.businesses;

		// Set the scene..
		player.triggerClientEvent('clothesBusines:SetScene', { position: action.payload.cameraPosition, heading: action.payload.cameraHeading });

		// Updating this client-side..
		player.triggerClientEvent('clothesBusiness:SetDefaultRotation', { value: action.payload.cameraHeading });

		// Start the page..
		player.triggerClientEvent('setBrowserPage', { page: `/businesses/${responseKey === 'F' ? 'clothes/buy' : `clothes/manage`}` });

		if (responseKey === 'G') {
			// Create an amplitude..
			player.createAmplitudeEvent('Using clothes management', {
				permissions: {
					use: player.checkPermission('feature.useClothesManagement'),
					update: player.checkPermission('feature.updateClothes'),
					delete: player.checkPermission('feature.deleteClothes'),
					create: player.checkPermission('feature.createClothes')
				}
			});
		} else {
			// Create an amplitude..
			player.createAmplitudeEvent('Buying clothes', {
				balance: player.info.money,
				bcBalance: player.info.beachCoins
			});
		}

		return true;
	}

	if (response.responseKey === 'ESC') {
		player.hidePlayerDialog();
		return true;
	}

	return false;
});
