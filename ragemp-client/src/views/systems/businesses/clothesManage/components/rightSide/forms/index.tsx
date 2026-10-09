import React, { useEffect, useState } from 'react';
import { ComponentState } from '../../../';

// Variables
let updateTimer: ExpectedAny = null;

// Language
import { createLanguagePack, getLanguagePack } from '@vmp/i18n';
import LanguagePack from './language';
const LanguageSystemId = 'clothesManagement:Forms';
createLanguagePack(LanguageSystemId, LanguagePack);

// Components
import Details from './components/details';
import Advanced from './components/advanced';

const Component = (props: ExpectedAny) => {
	const { groupedClothes, category, setTexturesFound, itemId, setData } = ComponentState();
	const { texturesFound, setSettings } = ComponentState();

	const lang = getLanguagePack(LanguageSystemId, window.language);

	const findingItemData =
		itemId && groupedClothes[category]
			? groupedClothes[category].find((item: Clothes) => item.id === itemId)
			: null;

	const [itemData, setItemData] = useState<ExpectedAny>(findingItemData ? findingItemData : null);

	useEffect(() => {
		setItemData(
			itemId ? groupedClothes[category].find((item: Clothes) => item.id === itemId) : null
		);
		setSettings('swappingTorsos', false);
	}, [itemId]);

	const onDataUpdated = () => {
		setData((currentState: ExpectedAny) => {
			const newState = { ...currentState };

			const index = newState.clothes.findIndex((i: Clothes) => i.id === itemId);
			if (index === -1) return newState;

			//Update textures data
			const findTextures = [...texturesFound];
			const ix = findTextures.findIndex((c) => c.id === itemId);

			if (ix !== -1) {
				findTextures[ix] = { ...itemData };
				if (JSON.stringify(findTextures) !== JSON.stringify(texturesFound)) {
					setTexturesFound(findTextures);
				}
			}

			newState.clothes[index] = {
				...itemData,
				// We don't save the numbers if they're not valid.
				price: itemData.price || 0,
				bcPrice: itemData.bcPrice || 0
			};

			return newState;
		});
	};

	useEffect(() => {
		if (itemData) {
			if (updateTimer !== null) {
				// Clear timeout
				clearTimeout(updateTimer);

				// Reset timer id
				updateTimer = null;
			}

			updateTimer = setTimeout(() => {
				// Callback function
				onDataUpdated();

				// Reset timer id
				updateTimer = null;
			}, 500);
		}

		return () => {
			if (updateTimer !== null) {
				// Clear timeout
				clearTimeout(updateTimer);

				// Reset timer id
				updateTimer = null;
			}
		};
		// eslint-disable-next-line
	}, [itemData]);

	const passedProps = {
		lang,
		itemData,
		setItemData
	};

	// Needs to check this to avoid render crashes.
	if (!itemData) return null;

	if (props.advanced) return <Advanced {...passedProps} />;
	return <Details {...passedProps} />;
};

export default Component;
