import { CharacterClothes } from '@modules/database/game/accounts/model/types';
import { defaultAppearances, defaultValues } from '@server/definitions/clothes/defaults';
import { logError } from '@server/utils/helpers';
import { Clothes } from './core';
import { getLastDrawableIdByGTA, mapClothesSingularToPlural } from './functions';

mp.Player.prototype.saveClothes = function saveClothes(fields) {
	this.info.clothes = { ...this.info.clothes, ...fields };
	this.saveInfo({ clothes: this.info.clothes });
};

mp.Player.prototype.isClothingComponentUsed = function isClothingComponentUsed(key) {
	// @ts-ignore-next-line - Stupid bug.
	const defaultUndershirtSlot = defaultValues[this.info.clothes.gender === 'male' ? 'male' : 'female'][key];
	const currentUndershirtSlot = this.info.clothes[key];
	const isOn = JSON.stringify(defaultUndershirtSlot) !== JSON.stringify(currentUndershirtSlot) ? true : false;
	return isOn;
};

mp.Player.prototype.getCurrentClothingComponentData = function (key) {
	if (!this.isClothingComponentUsed(key)) return null;

	const currentSlot: ExpectedAny = this.info.clothes[key];
	const isUnisex = ['mask', 'backpack'].includes(key) ? true : false;

	const type = mapClothesSingularToPlural(key);

	const c = Clothes.find(
		(c: Clothes) =>
			c.type === type &&
			c.gender === (isUnisex ? 'unisex' : this.info.clothes.gender) &&
			c.drawableId === currentSlot.drawableId &&
			c.textureId === currentSlot.textureId &&
			c.isAddon === currentSlot.isAddon
	);

	return c ? c : null;
};

mp.Player.prototype.resetClothingComponentData = function (key) {
	const gender = this.info.clothes.gender === 'male' ? 'male' : 'female';

	// @ts-ignore-next-line - Stupid.
	this.info.clothes[key] = defaultValues[gender][key];

	if (key === 'top') {
		this.info.clothes[`torso`] = defaultValues[gender][`torso`];
	}

	return true;
};

mp.Player.prototype.resetApperanceComponentData = function (key) {
	// @ts-ignore-next-line - Stupid.
	this.info.clothes[key] = defaultAppearances[this.info.clothes.gender][key];
	return true;
};

mp.Player.prototype.resetAllClothingComponents = function () {
	// Iterate each clothing component on the player and getthing the meta
	const clothings: ExpectedAny = defaultValues[this.info.clothes.gender === 'male' ? 'male' : 'female'];

	Object.keys(clothings).forEach((cloth: ExpectedAny) => {
		// Check if is used..
		const isUsed = this.isClothingComponentUsed(cloth);
		if (!isUsed) return;

		// Get current clothing
		this.resetClothingComponentData(cloth);
	});
};

mp.Player.prototype.resetAllAppearancesComponents = function () {
	this.info.clothes['gender'] = this.info.clothes['gender'] ? this.info.clothes['gender'] : 'male';
	this.info.clothes['model'] = this.info.clothes.gender === 'male' ? 'mp_m_freemode_01' : 'mp_f_freemode_01';

	const genderUsed = this.info.clothes.gender === 'male' ? 'male' : 'female';

	// Iterate each clothing component on the player and getthing the meta
	const entries: ExpectedAny = defaultAppearances[genderUsed];

	Object.keys(entries).forEach((key: ExpectedAny) => {
		// @ts-ignore-next-line - Stupid.
		this.info.clothes[key] = defaultAppearances[genderUsed][key];
	});
};

mp.Player.prototype.updateClothes = function updateClothes(clothes) {
	try {
		const c = clothes;

		// Skin resemblances
		this.setHeadBlend(c.motherShape, c.fatherShape, 0, c.motherShape, c.fatherShape, 0, c.shapeResemblance, c.skinResemblance, 0);

		// Hair
		this.setClothes(2, c.hairModel, 0, 0);
		this.setHairColor(c.hairColor1, c.hairColor2);

		// Eyebrows & Eyes
		this.setHeadOverlay(2, [c.eyebrows, 1, c.eyebrowsColor, c.eyebrowsColor]);
		this.eyeColor = c.eyeColor;
		this.setFaceFeature(11, c.eyeSize);
		this.setFaceFeature(6, c.browHeight);
		this.setFaceFeature(7, c.browWidth);

		// Beards
		this.setHeadOverlay(1, [c.beardModel, 1, c.beardColor, c.beardColor]); //Beard
		this.setFaceFeature(12, c.mouthSize);

		// Nose Features
		this.setFaceFeature(0, c.noseWidth);
		this.setFaceFeature(1, c.noseHeight);
		this.setFaceFeature(2, c.noseLength);
		this.setFaceFeature(3, c.noseBridge);
		this.setFaceFeature(4, c.noseTip);
		this.setFaceFeature(5, c.noseBridgeShift);

		// Cheekbones Features
		this.setFaceFeature(8, c.cheekboneHeight);
		this.setFaceFeature(9, c.cheekboneWidth);
		this.setFaceFeature(10, c.cheeksWidth);

		// Jaw features
		this.setFaceFeature(13, c.jawWidth);
		this.setFaceFeature(14, c.jawHeight);

		// Chin features
		this.setFaceFeature(15, c.chinLength);
		this.setFaceFeature(16, c.chinPosition);
		this.setFaceFeature(17, c.chinWidth);
		this.setFaceFeature(18, c.chinShape);

		// Neck features
		this.setFaceFeature(19, c.neckWidth);

		// Body features
		this.setHeadOverlay(0, [c.blemishes, 1, c.hairColor1, c.hairColor1]);
		this.setHeadOverlay(3, [c.ageing, 1, 0, 0]);
		this.setHeadOverlay(4, [c.makeup, 1, 0, 0]);
		this.setHeadOverlay(5, [c.blush, 1, c.blushColor, c.blushColor]);
		this.setHeadOverlay(8, [c.lipstick, 1, c.lipstickColor, c.lipstickColor]);
		this.setHeadOverlay(9, [c.moles, 1, 0, 0]);
		this.setHeadOverlay(10, [c.chestHair, 1, c.hairColor1, c.hairColor2]);
		this.setHeadOverlay(11, [c.bodyBlemishes, 1, 0, 0]);

		// Clothing

		const arrayClothing = [
			{
				key: 'torso',
				componentId: 3
			},
			{
				key: 'top',
				componentId: 11
			},
			{
				key: 'pants',
				componentId: 4
			},
			{
				key: 'shoes',
				componentId: 6
			},
			{
				key: 'mask',
				componentId: 1
			},
			{
				key: 'backpack',
				componentId: 5
			},
			{
				key: 'undershirt',
				componentId: 8
			},
			{
				key: 'accessory',
				componentId: 7
			},
			{
				key: 'hat',
				componentId: 0,
				isProp: true
			},
			{
				key: 'glasses',
				componentId: 1,
				isProp: true
			},
			{
				key: 'earings',
				componentId: 2,
				isProp: true
			},
			{
				key: 'watches',
				componentId: 6,
				isProp: true
			},
			{
				key: 'bracelets',
				componentId: 7,
				isProp: true
			}
		];

		arrayClothing.forEach((component: ExpectedAny) => {
			// @ts-ignore-next-line
			const entryClothing: ExpectedAny = c[component.key];
			const cat = mapClothesSingularToPlural(component.key);
			const drawableId = !entryClothing.isAddon ? entryClothing.drawableId : getLastDrawableIdByGTA(cat, c.gender) + entryClothing.drawableId;

			if (component.isProp) {
				this.setProp(component.componentId, drawableId, entryClothing.textureId);
			} else {
				this.setClothes(component.componentId, drawableId, entryClothing.textureId, 0);
			}
		});
	} catch (err) {
		logError(`UPDATE_CLOTHES`, err, { playerName: this.info.username });
	}
};

declare global {
	interface PlayerMp {
		saveClothes(fields?: Partial<CharacterClothes>): void;
		updateClothes(clothes: CharacterClothes): void;
		resetAllClothingComponents(): void;
		resetAllAppearancesComponents(): void;
		isClothingComponentUsed(key: keyof CharacterClothes): boolean;
		getCurrentClothingComponentData(key: keyof CharacterClothes): Clothes | null;
		resetClothingComponentData(key: keyof CharacterClothes): void;
		resetApperanceComponentData(key: keyof CharacterClothes): void;
	}
}
