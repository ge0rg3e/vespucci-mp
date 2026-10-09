import React, { useEffect, useState } from 'react';
import { ComponentState, mapClothesPlurals } from '../../..';

// Components
import Entry from './components/entry';

// Language
import { createLanguagePack, getLanguagePack } from '@vmp/i18n';
import LanguagePack from './index.language';
const LanguageSystemId = 'clothesManagement:List';
createLanguagePack(LanguageSystemId, LanguagePack);

const Component = () => {
	const { groupedClothes, searchValue, data, filters, gender } = ComponentState();
	const { category, setItemId, setTexturesFound } = ComponentState();
	const lang = getLanguagePack(LanguageSystemId, window.language);
	const [itemsListed, setItemsListed] = useState([]);

	const hasVipTextures = (textures: ExpectedAny) => {
		const src = textures.filter((item: Clothes) => item.minimumDonorTier > 0);
		return src.length > 0 ? true : false;
	};

	const getFilteredItems = () => {
		if (!groupedClothes[category]) return [];

		let src = groupedClothes[category].filter(
			(item: Clothes) =>
				item.gender === (['masks', 'backpacks'].includes(category) ? 'unisex' : gender) &&
				item.textureId === 0 &&
				item.type === category
		);

		if (searchValue && searchValue.length > 0) {
			src = src.filter(
				(item: Clothes) =>
					item.name
						.toString()
						.toLowerCase()
						.includes(searchValue.toString().toLowerCase()) ||
					item.drawableId === parseInt(searchValue) ||
					item.category
						.toString()
						.toLowerCase()
						.includes(searchValue.toString().toLowerCase())
			);
		}

		const anyFilters = Object.values(filters).filter((x) => x === true).length > 0;

		src = src.map((c: Clothes) => ({
			...c,
			_textures: [],
			_hasVipTexture: false
		}));

		src.forEach((i: Clothes, ix: number) => {
			groupedClothes[category].forEach((c: Clothes) => {
				if (
					c.type === i.type &&
					c.gender === i.gender &&
					c.drawableId === i.drawableId &&
					c.isAddon === i.isAddon
				) {
					src[ix]._textures.push(c);
				}
			});

			src[ix]._hasVipTexture = hasVipTextures(src[ix]._textures);
		});

		if (anyFilters) {
			if (filters.inStore) {
				src = src.filter((mainItem: ExpectedAny) => {
					const exists =
						mainItem.isAvailable ||
						mainItem._textures.find((c: Clothes) => c.isAvailable === true);

					if (exists) return true;
					return false;
				});
			}

			if (filters.vipOnly) {
				src = src.filter((mainItem: ExpectedAny) => {
					const exists =
						mainItem.minimumDonorTier > 0 ||
						mainItem._textures.find((c: Clothes) => c.minimumDonorTier > 0);

					if (exists) return true;
					return false;
				});
			}

			if (filters.addonsOnly) {
				src = src.filter((mainItem: ExpectedAny) => {
					const exists =
						mainItem.isAddon === true ||
						mainItem._textures.find((c: Clothes) => c.isAddon === true);

					if (exists) return true;
					return false;
				});
			}
		}

		return src;
	};

	const scrollEntryIntoView = () => {
		try {
			const type = mapClothesPlurals[category] ? mapClothesPlurals[category] : category;

			const currentClothes = data.clothing[type];
			if (!currentClothes) return false;

			// This is like that ([]) cause of backpacks.
			const currentEntry = (groupedClothes[category] || []).find(
				(c: Clothes) =>
					c.drawableId === currentClothes.drawableId &&
					c.textureId === 0 &&
					c.isAddon === currentClothes.isAddon
			);

			if (!currentEntry) return false;

			const mainId = currentEntry.id;
			let idSelected = currentEntry.id;

			if (currentClothes.textureId !== 0) {
				const textureEntry = (groupedClothes[category] || []).find(
					(c: Clothes) =>
						c.drawableId === currentClothes.drawableId &&
						c.textureId === currentClothes.textureId &&
						c.isAddon === currentClothes.isAddon
				);
				if (!textureEntry)
					throw new Error(
						`Failed to find texture id for ${currentClothes.drawableId} - ${currentClothes.textureId}`
					);

				idSelected = textureEntry.id;
			}

			setItemId(idSelected);

			const genderUsed = ['masks', 'backpacks'].includes(category) ? 'unisex' : gender;
			const textures = (groupedClothes[category] || []).filter(
				(c: Clothes) =>
					c.drawableId === currentClothes.drawableId &&
					c.gender === genderUsed &&
					c.isAddon === currentEntry.isAddon
			);

			setTexturesFound(textures);

			const elm = document.getElementById(`entry-${mainId}`);
			if (!elm) return false;

			const container = document.getElementById('items-entries');
			if (!container) return false;
			container.scrollTop = elm.offsetTop - 57; // 57 = the entry div height.
		} catch (err) {
			console.error(`Failed to scrollEntryIntoView`, err);
		}
	};

	useEffect(() => {
		const src = getFilteredItems();
		setItemsListed(src);
	}, [data, groupedClothes, gender, searchValue, category, filters]);

	useEffect(() => {
		setTimeout(() => scrollEntryIntoView(), 200);
	}, [category]);

	return (
		<React.Fragment>
			<div className="entries" id="items-entries">
				{itemsListed.map((item: Clothes, ix: number) => (
					<Entry data={item} key={ix} />
				))}
				{itemsListed.length < 1 && (
					<React.Fragment>
						<div className="entry" style={{ padding: '14px 16px' }}>
							<div className="details">
								<div className="name" style={{ marginBottom: 0 }}>
									{searchValue.length > 0
										? lang.get('Search:NoResults')
										: lang.get('Search:NoItems')}
								</div>
							</div>
						</div>
					</React.Fragment>
				)}
			</div>
		</React.Fragment>
	);
};

export default Component;
