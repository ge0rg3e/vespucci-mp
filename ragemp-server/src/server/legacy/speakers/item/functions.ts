import { itemCallbackMeta } from '@server/natives/items/components/types';
import { logError } from '@server/utils/helpers';
import { createSpeaker, deleteSpeaker, getSpeakersWithinRange, speakers } from '../components/functions';
import { getLanguagePack } from '@vmp/i18n';

// This defines how far the speakers will work.
export const MAX_ITEM_SPEAKER_RANGE = 10; // this should be according to spaker
export const RANGE_CLOSEST_SPEAKER_ITEM = 13; // must be a bit bigger.

export const onItemUse = async (player: PlayerMp, inventoryItem: itemCallbackMeta) => {
	try {
		const lang = getLanguagePack('Speakers:Item');

		// Item is already in use
		if (isItemSpeakerUsed(player, inventoryItem.data.id)) return player.toast({ type: 'error', message: lang.get(`ItemAlreadyUsed`) });

		// Close inventory
		player.closeInventory();

		// Check if any speaker nearby
		if (getSpeakersWithinRange(player.position, RANGE_CLOSEST_SPEAKER_ITEM).length > 0) {
			return player.toast({
				type: 'error',
				message: lang.get('AnotherSpeakerTooClose')
			});
		}

		// Get Z position
		const groundPosition: number = await player.invokeClientEvent(`getGroundZPosition`, { position: player.position })!;
		const offsetPos: ExpectedAny = await player.invokeClientEvent(`getOffsetFromInWorldCoords`, {
			x: 0,
			y: 0.75, // make it 0.75 more forward
			z: 0
		});

		// Create speaker
		await createSpeaker({
			position: new mp.Vector3(offsetPos.x, offsetPos.y, groundPosition + 0.2),
			dimension: player.dimension,
			rotation: new mp.Vector3(0, 0, player.heading),
			range: MAX_ITEM_SPEAKER_RANGE,
			objectType: 1,
			// Is important to know that this speaker if owned by a player and what item
			owner: {
				type: 'player',
				id: player.id,
				payload: {
					inventoryItemId: inventoryItem.data.id
				}
			}
		});

		// Play animation of putting something down.
		player.applyAnimation({
			dict: `random@domestic`,
			name: `pickup_low`,
			speed: 1,
			flags: 51,
			duration: 800
		});

		// Log it..
		player.createAmplitudeEvent(`Placed Bluetooth Speaker down`);

		// Play audio
		player.playSoundEffect(`${`__ASSETS__`}/audios/items/speaker/ready.mp3`, { volume: 0.6 });
	} catch (err) {
		await logError(`speakers.item.onItemUse`, err);
		return false;
	}
};

export const onItemDrop = async (player: PlayerMp, inventoryItem: itemCallbackMeta) => {
	try {
		// If item is currently used (boombox placed down)
		if (isItemSpeakerUsed(player, inventoryItem.data.id)) {
			// Get speaker
			const speaker = getSpeakerCreatedByItem(player, inventoryItem.data.id);
			if (!speaker) throw new Error(`Failed to find speaker that was supposed to exist.`);

			// Destroy speaker.
			deleteSpeaker(speaker.id);
		}

		// Drop it now
		player.dropItem(inventoryItem.data.id);

		return true;
	} catch (err) {
		await logError(`speakers.item.onItemDrop`, err);
		return false;
	}
};

export const onItemDestroy = async (player: PlayerMp, inventoryItem: itemCallbackMeta) => {
	try {
		// If item is currently used (boombox placed down)
		if (isItemSpeakerUsed(player, inventoryItem.data.id)) {
			// Get speaker
			const speaker = getSpeakerCreatedByItem(player, inventoryItem.data.id);
			if (!speaker) throw new Error(`Failed to find speaker that was supposed to exist.`);

			// Destroy speaker.
			deleteSpeaker(speaker.id);
		}

		// Drop it now
		player.deleteItem(inventoryItem.data.id);

		return true;
	} catch (err) {
		await logError(`speakers.item.onItemDestroy`, err);
		return false;
	}
};

/**
 * This function will tell you if this item (speaker, item id 14) is in use.
 * @param player
 * @param inventoryItemId
 */

export const isItemSpeakerUsed = (player: PlayerMp, inventoryItemId: string) => {
	const match = speakers.find((c) => c.owner.type === 'player' && c.owner.id === player.id && c.owner.payload.inventoryItemId === inventoryItemId);
	return match ? true : false;
};

/**
 * This function will get you the speaker matching the account id and inventory item id.
 * @param accountId
 * @param inventoryItemId
 */

export const getSpeakerCreatedByItem = (player: PlayerMp, inventoryItemId: string) => {
	const match = speakers.find((c) => c.owner.type === 'player' && c.owner.id === player.id && c.owner.payload.inventoryItemId === inventoryItemId);

	return match || null;
};

/**
 * This function informs us if this speaker is an item owned by this player.
 * @param player
 * @param speakerId
 * @returns
 */

export const isSpeakerItemOwnedByPlayer = (player: PlayerMp, speakerId: number) => {
	const match = speakers.find((c) => c.id === speakerId && c.owner.type === 'player' && c.owner.id === player.id);
	return match ? true : false;
};

/**
 * This function gets us all the speakers placed down by the player as item.
 * @param player
 */

export const getSpeakersPlacedByPlayer = (player: PlayerMp) => {
	// Get all speakers created by this player
	const createdSpeakers = speakers.filter((c) => c.owner.type === 'player' && c.owner.id === player.id);

	// Get the speakers now
	return createdSpeakers;
};

// Animation de ridicat pickup si tinut in 2 maini:
// player.applyAnimation({
// 	dict: `impexp_int-0`,
// 	name: `mp_m_waremech_01_dual-0`,
// 	speed: 1,
// 	flags: 51,
// 	duration: 800
// });
