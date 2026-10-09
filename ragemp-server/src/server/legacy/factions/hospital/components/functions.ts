import { itemCallbackMeta } from '@server/natives/items/components/types';
import { logError } from '@server/utils/helpers';
import { getLanguagePack } from '@vmp/i18n';

export const onBandageItemUsed = async (player: PlayerMp, meta: itemCallbackMeta) => {
	try {
		// Get the language
		const lang = getLanguagePack(`onUseItem:bandage`, player.lang);

		// Hide inventory
		player.closeInventory();

		// If already have the item
		if (player.hasAttachment('bandage')) return false; // Too soon.

		// They cannot use bandages if hp is more than 50.
		if (player.health >= 60) {
			player.alert({
				type: 'warning',
				message: lang.get(`tooMuchHealth`)
			});
			return false;
		}

		// Track
		player.createAmplitudeEvent(`Used Bandage Item`, {
			currentHealth: player.health
		});

		// Sound..
		player.playSoundEffect(`${`__ASSETS__`}/audios/items/bandage/apply.mp3`, { volume: 0.2 });

		// Apply bandage.
		player.giveAttachment('bandage');

		// Play animation...
		player.applyAnimation({
			dict: `missmic4`,
			name: 'michael_tux_fidget',
			speed: 1,
			flags: 49,
			duration: 4000,
			onCallback: (player, stopAnim) => {
				// Stop current anim
				stopAnim();

				// Take away the attachment
				player.removeAttachment('bandage');

				// Calculate health..
				let newHealth = player.health + 5;

				// We limit..
				if (newHealth >= 60) {
					newHealth = 60;
				}
				// Apply health
				player.health = newHealth;

				// Reduce item
				player.reduceItem(meta.data.id, 1);
			}
		});

		return true;
	} catch (err) {
		await logError(`onBandageItemUsed`, err);
		return false;
	}
};
