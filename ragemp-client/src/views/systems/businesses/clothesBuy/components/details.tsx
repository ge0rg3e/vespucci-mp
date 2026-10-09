import React, { useEffect, useState } from 'react';
import { ComponentState } from '..';

// Dependencies
import { donationsTierList } from '@/utils/definitions/donations';
import { formatNumber, logError } from '@/utils/helpers';
import { mapClothesPlurals } from '../../clothesManage';

// Components
import { Button, ButtonGroup } from '@mui/material';

// Language
import { createLanguagePack, getLanguagePack } from '@vmp/i18n';
import LanguagePack from './details.language';
const LanguageSystemId = 'buyClothes:details';
createLanguagePack(LanguageSystemId, LanguagePack);

const Component = () => {
	const { data, itemId, setItemId, category } = ComponentState();
	const [itemData, setItemData] = useState<ExpectedAny>(null);
	const [textures, setTextures] = useState<ExpectedAny>(null);
	const lang = getLanguagePack(LanguageSystemId, window.language);

	// For the currency changer
	const twoCurrencies = itemData && itemData.price !== 0 && itemData.bcPrice !== 0;
	const [currencySelected, setCurrencySelected] = useState('cash');

	useEffect(() => {
		const itemData = data.clothes[category].find((i: Clothes) => i.id === itemId);
		const oldTextures = textures ? [...textures] : [];

		const newTextures = data.clothes[category].filter(
			(c: Clothes) =>
				c.drawableId === itemData.drawableId &&
				c.isAddon === itemData.isAddon &&
				c.gender ===
					(['masks', 'backpacks'].includes(itemData.type)
						? 'unisex'
						: data.clothing.gender)
		);

		setItemData({
			...itemData
		});

		setTextures(newTextures);
		setCurrencySelected('cash');

		// Change scroll when a new item is picked from left menu
		if (!oldTextures.find((i: Clothes) => i.id === itemId)) {
			const elm = document.getElementById('variants-scrollable-entries');
			elm?.scrollTo(0, 0);
		}
	}, [itemId]);

	const getDrawableId = () => {
		const isAddon = itemData.isAddon;
		const lastIds = data.lastDefaultGameClothingIds;
		const drawableId = isAddon
			? lastIds[data.clothing.gender][itemData.type] + itemData.drawableId
			: itemData.drawableId;

		return drawableId;
	};

	const updatePedClothing = async () => {
		try {
			// Getting current clothing
			const playerClothing = { ...data.clothing };

			// Current previewed clothing type
			const type = itemData.type;

			// Converting the categories "undershirts" => "undershirt"
			const key = mapClothesPlurals[type] ? mapClothesPlurals[type] : type;

			// Getting the clothing he's lookign at..
			const clothing = itemData;

			// Applying the change clothing
			playerClothing[key] = {
				drawableId: clothing.drawableId,
				textureId: clothing.textureId,
				isAddon: clothing.isAddon
			};

			// If top is changing we need to apply the right torso and remove undershirt if it's not compatible.
			if (key === 'top') {
				const topDetails: ExpectedAny = await window.rpc.callServer(
					'buyClothes:getClothingTopDetails',
					JSON.stringify({ id: itemData.id })
				);

				if (topDetails) {
					playerClothing['torso'] = {
						drawableId: topDetails.torsoRecommended.drawableId,
						textureId: topDetails.torsoRecommended.textureId,
						isAddon: topDetails.torsoRecommended.isAddon
					};

					if (topDetails.undershirtCompatible === false) {
						playerClothing['undershirt'] = {
							drawableId: playerClothing.gender === 'male' ? 15 : 3,
							textureId: 0,
							isAddon: false
						};
					}
				}
			}

			window.rpc.triggerServer(
				'clothing:applyPedClothing',
				JSON.stringify({
					clothes: {
						...playerClothing
					}
				})
			);
		} catch (err) {
			await logError('UPDATE_PED_CLOTHING', err, { buyClothing: true });
		}
	};

	useEffect(() => {
		if (itemData) {
			updatePedClothing();
		}
	}, [itemData]);

	const onPurchase = async () => {
		try {
			// Converting the categories "undershirts" => "undershirt"
			const type = itemData.type;
			const key = mapClothesPlurals[type] ? mapClothesPlurals[type] : type;

			// Send to server...
			await window.rpc.triggerServer(
				'buyClothes:buyItem',
				JSON.stringify({ id: itemData.id, currency: currencySelected, clothingType: key })
			);
		} catch (err) {
			await logError('PURCHASE_CLOTHING', err);
		}
	};

	if (itemData === null || textures === null) return null;

	return (
		<div className="comp-details">
			<div className="comp-content">
				<div className="info-icon">
					<i className="elm fa-solid fa-circle-info"></i>
				</div>
				<div className="main-content">
					<div className="heading">
						<div className="name">{itemData.name.toUpperCase() || 'Nameless'}</div>
						<div className="drawable">Drawable ID: {getDrawableId()}</div>
					</div>
					<div className="wrapper-details">
						<div className="details">
							{!itemData.price && !itemData.bcPrice ? (
								<div className="entry">
									<div className="label">{lang.get('CashPrice')}</div>
									<div className="value cash">{lang.get('FREE')}</div>
								</div>
							) : null}
							{itemData.price ? (
								<div className="entry">
									<div className="label">{lang.get('CashPrice')}</div>
									<div className="value cash">
										{formatNumber(itemData.price, true)}
									</div>
								</div>
							) : null}
							{itemData.bcPrice ? (
								<div className="entry">
									<div className="label">Beach Coins</div>
									<div className={`value bc`}>
										{formatNumber(itemData.bcPrice)} BC
									</div>
								</div>
							) : null}
							{itemData.minimumDonorTier ? (
								<div className="entry fw">
									<div className="label">{lang.get('minimumDonorTier')}</div>
									<div className="value tier">
										Tier {itemData.minimumDonorTier} -{' '}
										{
											donationsTierList.find(
												(i: ExpectedAny) =>
													i.value === itemData.minimumDonorTier
											)?.label
										}
									</div>
								</div>
							) : null}
						</div>
					</div>
					{textures.length > 1 && (
						<div className="variants">
							<div className="header">
								<div className="label">{lang.get('clothingVariants')}</div>
							</div>
							<div className="entries" id="variants-scrollable-entries">
								{textures.map((entry: Clothes, ix: number) => (
									<div
										className={`entry ${
											entry.id === itemId ? 'selected' : ''
										} ${entry.name.length < 1 && 'nameless'}`}
										key={ix}
										onClick={() => setItemId(entry.id)}
									>
										{ix + 1}. {entry.name || 'Nameless'}
									</div>
								))}
							</div>
						</div>
					)}
				</div>
				<div className="buttons">
					<ButtonGroup variant="outlined" color="primary">
						<Button variant="contained" color="primary" onClick={onPurchase}>
							{lang.get('PurchaseButtonText')}
						</Button>
						{twoCurrencies && (
							<Button
								className="currency"
								variant="contained"
								color="primary"
								onClick={() =>
									setCurrencySelected(currencySelected === 'cash' ? 'bc' : 'cash')
								}
							>
								{currencySelected === 'cash' ? 'Cash' : 'BC'}{' '}
								<i className="icon fa-solid fa-shuffle"></i>
							</Button>
						)}
					</ButtonGroup>
				</div>
			</div>
		</div>
	);
};

export default Component;
