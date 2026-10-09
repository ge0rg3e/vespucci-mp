import React from 'react';

// Components
import { Button } from '@mui/material';
import { ComponentState } from '../..';

// Language
import { createLanguagePack, getLanguagePack } from '@vmp/i18n';
import LanguagePack from './actions.language';
import { logError } from '@/utils/helpers';
const LanguageSystemId = 'clothesManagement:Actions';
createLanguagePack(LanguageSystemId, LanguagePack);

const Component = () => {
	const { data, itemId, setData, setTexturesFound } = ComponentState();
	const lang = getLanguagePack(LanguageSystemId, window.language);

	const syncData = async () => {
		try {
			const sourceData: Clothes = data.clothes.find((i: ExpectedAny) => i.id === itemId);
			if (!sourceData) return false;

			const existingData = data.clothes;

			existingData.forEach((c: Clothes, ix: number) => {
				if (
					c.drawableId === sourceData.drawableId &&
					c.type === sourceData.type &&
					c.isAddon === sourceData.isAddon &&
					c.gender === sourceData.gender
				) {
					existingData[ix] = {
						...existingData[ix],
						category: sourceData.category,
						price: sourceData.price,
						bcPrice: sourceData.bcPrice,
						minimumDonorTier: sourceData.minimumDonorTier,
						isAvailable: sourceData.isAvailable,
						isAddon: sourceData.isAddon,
						dlcName: sourceData.dlcName,
						meta: sourceData.meta
					};
				}
			});

			// Need to update the textures..
			refreshTextures(sourceData, existingData, setTexturesFound);

			setData({ ...data, clothes: existingData });
		} catch (err) {
			await logError(`SYNC_CLOTHES_DATA`, err);
		}
	};

	return (
		<React.Fragment>
			<div className="tools">
				<div className="form-group">
					<div className="input-label wd">{lang.get('SyncDataHeading')}</div>
					<div className="input-description">{lang.get('SyncDataDescription')}</div>
					<div className="input-container">
						<Button
							variant="contained"
							fullWidth={true}
							onClick={syncData}
							disabled={!data.permissions.update}
						>
							{lang.get('SyncDataButtonText')}
						</Button>
					</div>
				</div>
			</div>
		</React.Fragment>
	);
};

export const refreshTextures = (sourceData: ExpectedAny, dataUsed = null, setFunc: ExpectedAny) => {
	// Need to update the textures..
	const m = sourceData;
	const findTextures = (dataUsed || []).filter(
		(c: Clothes) =>
			c.type === m.type &&
			c.gender === m.gender &&
			c.drawableId === m.drawableId &&
			c.isAddon === m.isAddon
	);

	setFunc(findTextures);
};

export default Component;
