import { InventoryItem } from '@server/legacy/inventory/components/types';
import { getLanguagePack } from '@vmp/i18n';
import { Clothes } from './core';
import { equipClothing, getSlotsRequiredForClothing, mapClothesPluralToSingular, mapClothesSingularToPlural } from './functions';

// Creating the function callbacks..

export const onClothingItemUsed = async (player: PlayerMp, { data }: { data: InventoryItem }) => {
	// Get the language..
	const lang = getLanguagePack(`Clothes:EquipClothingCallback`, player.info.language);

	// Variables
	const top = player.getCurrentClothingComponentData('top');
	const clothingId = data.meta.clothingId;

	// Get clothing ..
	const clothing = Clothes.find((c: Clothes) => c.id === clothingId);
	if (!clothing) return false;

	// Check he has space in case of clothing swap...
	const slotsRequired = getSlotsRequiredForClothing(player, clothing);
	if (slotsRequired !== 0) return player.toast({ type: 'error', message: lang.get('NoSpaceToMoveCurrentClothes', { slotsNeeded: slotsRequired }) });

	// If his sex is not fit
	if (clothing.gender !== 'unisex' && clothing.gender !== player.info.clothes.gender) return player.toast({ type: 'error', message: lang.get('WrongGender', { gender: clothing.gender }) });

	// If he wants to equip undershirts but he has no top on..
	if (clothing.type === 'undershirts' && !top) {
		player.toast({ type: 'error', message: lang.get('CannotEquipUndershirtAlone') });
		return player.updateInventoryInterface();
	}

	// If he wants to equip undershirts but his top is not compatible.
	if (clothing.type === 'undershirts' && top?.meta.undershirtCompatible === false) return player.toast({ type: 'error', message: lang.get('UndershirtNotCompatible') });

	// Reduce item since he used it.
	player.reduceItem(data.id, 1);

	// Using the clothing
	await equipClothing(player, clothing, { page: data.pageId, slot: data.slotId });

	// Refreshing inventory
	player.updateInventoryInterface();

	return true;
};

// Creating the item required for clothes

mp.items.create({
	id: 3,
	// These will be replaced in inventory by Meta.
	name: { EN: ``, RO: `` },
	description: {
		EN: `Clothing that can be worn to change a character's appearance.`,
		RO: `Articol vestimentar ce poate fi purtat pentru a schimba aspectul unui character.`
	},
	// Actually required.
	droppable: true,
	tradable: true,
	stackable: false,
	dispensable: true,
	usable: true,
	callbacks: {
		use: onClothingItemUsed
	},
	getProperties({ meta }) {
		// Get the language
		const lang = getLanguagePack('Clothes:ItemTooltip');

		// Get the clothes data
		const clothesData = Clothes.find((c: Clothes) => c.id === meta.clothingId);
		if (!clothesData) return;

		// Map clothes key
		const clothingKey = mapClothesPluralToSingular(clothesData.type);

		// Format the properties..
		let properties = [
			{
				label: 'ID',
				value: meta.clothingId
			},
			{
				label: lang.get('Gender'),
				value: lang.get(`GenderValue`, { value: clothesData.gender })
			},
			{
				label: lang.get('Type'),
				value: lang.get(`Clothes:${clothingKey}`)
			}
		];

		// If is a top we need to inform if is compatible with undershirts.
		if (clothesData.type === 'tops') {
			properties.push({
				label: lang.get('UndershirtCompatible'),
				value: lang.get(clothesData.meta.undershirtCompatible ? `Yes` : `No`)
			});
		}

		return properties;
	}
});
