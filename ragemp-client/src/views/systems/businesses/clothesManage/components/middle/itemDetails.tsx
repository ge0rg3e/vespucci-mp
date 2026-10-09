import React from 'react';
import { ComponentState, mapClothesPlurals } from '../..';

// Language
import { createLanguagePack, getLanguagePack } from '@vmp/i18n';
import LanguagePack from './itemDetails.language';
const LanguageSystemId = 'clothesManagement:ItemDetails';
createLanguagePack(LanguageSystemId, LanguagePack);

const Component = () => {
	const { itemId, data, category, setItemId, changePedClothing } = ComponentState();
	const lang = getLanguagePack(LanguageSystemId, window.language);
	const itemData = data.clothes.find((c: ExpectedAny) => c.id === itemId);

	const removeClothing = () => {
		if (category === 'undershirts') {
			changePedClothing(
				'undershirts',
				{
					drawableId: 15,
					textureId: 0,
					isAddon: false
				},
				{}
			);
		} else {
			changePedClothing(
				category,
				{
					drawableId: clothesThatAreNotPropsButAreClearable.includes(category) ? 0 : -1,
					textureId: 0,
					isAddon: false
				},
				{}
			);
		}
		setItemId(null);
	};

	const getPlayerCategory = mapClothesPlurals[category] ? mapClothesPlurals[category] : category;

	const isWearingClothing = () => {
		if (category === 'undershirts' && data.clothing.undershirt.drawableId === 15) return false;

		if (
			data.clothing[getPlayerCategory]?.drawableId ===
			(clothesThatAreNotPropsButAreClearable.includes(category) ? 0 : -1)
		)
			return false;

		return true;
	};

	return (
		<React.Fragment>
			<div className="item-details">
				{((category && !isCategoryNotClearable.includes(category)) ||
					category === 'undershirts') &&
					isWearingClothing() && (
						<div
							className={`remove-clothing ${itemId && 'mb'}`}
							onClick={() => removeClothing()}
						>
							<i className="icon fa-solid fa-xmark"></i>
						</div>
					)}
				{itemId && (
					<React.Fragment>
						<div className="text-entry">
							{lang.get('DatabaseId')}: {itemId}
						</div>
						<div className="text-entry">
							{itemData.isAddon && 'Addon'} {lang.get('DrawableID')}:{' '}
							{itemData.drawableId}{' '}
						</div>
					</React.Fragment>
				)}
			</div>
		</React.Fragment>
	);
};

export const clothesThatAreNotPropsButAreClearable = ['backpacks', 'masks', 'accessories'];
export const isCategoryNotClearable = [`tops`, `torsos`, `pants`, `undershirts`];

export default Component;
