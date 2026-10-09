import React, { useState, useEffect } from 'react';
import { ComponentState } from '../..';

// Components
import Entry from './components/entry';

// Getting language pack
import Language from './language';

const Component = () => {
	const { data, category, itemId, setItemId, search } = ComponentState();

	const [categories, setCategories] = useState(
		groupCategories(data.clothing.gender, data.clothes[category])
	);

	const filterCategories = () => {
		let arr = groupCategories(data.clothing.gender, data.clothes[category]);

		if (search.text.length > 0) {
			arr.forEach((_: ExpectedAny, ix: number) => {
				arr[ix].entries = arr[ix].entries.filter((c: ExpectedAny) => {
					const isAddon = c.isAddon;
					const lastIds = data.lastDefaultGameClothingIds;
					const drawableId = isAddon
						? lastIds[data.clothing.gender][c.type] + c.drawableId
						: c.drawableId;

					if (`${drawableId}` === search.text) return true;

					const toLow = (str: string) => str.toString().toLowerCase();

					if (toLow(c.name).includes(toLow(search.text))) return true;

					let anyMatch: ExpectedAny = false;
					// eslint-disable-next-line

					c._textures.forEach((cc: ExpectedAny) => {
						if (toLow(cc.name).includes(toLow(search.text))) {
							anyMatch = true;
						}
					});

					if (anyMatch === true) return true;

					return false;
				});
			});
		}

		if (Object.values(search.filters).filter((f) => f).length > 0) {
			arr.forEach((_: ExpectedAny, ix: number) => {
				// Filter VIP Only
				if (search.filters.vipOnly) {
					arr[ix].entries = arr[ix].entries.filter((c: Clothes) => {
						if (c.minimumDonorTier > 0) return true;
						return false;
					});
				}

				// Filter Addon Only
				if (search.filters.addonOnly) {
					arr[ix].entries = arr[ix].entries.filter((c: Clothes) => {
						if (c.isAddon) return true;
						return false;
					});
				}

				// Filter Within Budget Only
				if (search.filters.withinBudget) {
					arr[ix].entries = arr[ix].entries.filter((c: Clothes) => {
						if (!c.price && !c.bcPrice) return true; // is free
						if (
							(c.price && c.price < data.balance.cash) ||
							(c.bcPrice && c.bcPrice < data.balance.beachCoins)
						)
							return true;
						return false;
					});
				}
			});
		}

		// Filtering out any empty categories post filtering.

		arr = arr.filter((cat: ExpectedAny) => cat.entries.length > 0);

		return arr;
	};

	useEffect(() => {
		setCategories(filterCategories());
	}, [category, data.clothes, search]);

	useEffect(() => {
		setItemId(null);
	}, [category]);

	const onEntrySelected = (entry: Clothes) => {
		setItemId(entry.id);
	};

	const isSelected = (entry: ExpectedAny) => {
		const ids = [entry.id, ...entry._textures.map((i: Clothes) => i.id)];
		return ids.includes(itemId) ? true : false;
	};

	return (
		<React.Fragment>
			<div className="comp-items">
				<div className="entries">
					{categories.map((category: ExpectedAny, ix: number) => (
						<React.Fragment key={ix}>
							<div className="category-wrapper">
								<div className="category-label">{category.name}</div>
								<div className="category-entries">
									{category.entries.map((entry: Clothes, ixx: number) => (
										<Entry
											key={ixx}
											onlyChild={category.entries.length === 1 ? true : false}
											isSelected={isSelected(entry)}
											data={entry}
											onClick={() => onEntrySelected(entry)}
										/>
									))}
								</div>
							</div>
						</React.Fragment>
					))}
					{categories.length < 1 && (
						<div className="empty-category">
							{Language.categoryEmpty[window.language === 'EN' ? 'EN' : 'RO']}
						</div>
					)}
				</div>
			</div>
		</React.Fragment>
	);
};

export const groupCategories = (myGender: 'male' | 'female', sourceData: ExpectedAny) => {
	let arr: ExpectedAny = [];

	// Applying gender ...
	sourceData = sourceData.filter((c: Clothes) => {
		if (['masks', 'backpacks'].includes(c.type)) return true;
		// unisex.
		else if (c.gender == myGender) return true;
		return false;
	});

	sourceData.forEach((c: Clothes) => {
		const cat = c.category && c.category.length > 0 ? c.category : 'General';

		const allVariants = sourceData
			.filter((cc: Clothes) => cc.isAddon == c.isAddon && cc.drawableId === c.drawableId)
			.sort((a: Clothes, b: Clothes) => a.textureId - b.textureId);

		const mainTextureId = allVariants[0].textureId;

		if (c.textureId !== mainTextureId) return; // Only main clothes textures show up in the main list.

		const catIndex = arr.findIndex((i: ExpectedAny) => i.name === cat);

		const _textures = [...allVariants];

		// Delete main one
		_textures.splice(0, 1);

		const cObject: ExpectedAny = { ...c, _textures };

		if (catIndex === -1) {
			arr.push({
				name: cat,
				entries: [cObject]
			});
		} else {
			arr[catIndex].entries.push(cObject);
		}
	});

	// Sorty by alphabetical
	arr = arr.sort((a: ExpectedAny, b: ExpectedAny) => a.name.localeCompare(b.name));

	return arr;
};

export default Component;
