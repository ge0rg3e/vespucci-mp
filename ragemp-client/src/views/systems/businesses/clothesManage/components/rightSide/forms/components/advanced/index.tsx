import React, { useEffect } from 'react';

// Components
import { Select, MenuItem, TextField } from '@mui/material';
import TorsoSwitcher from './components/torso';
import DeleteButton from './components/delete';

// Dependencies
import { ComponentState } from '../../../../..';
import { logError } from '@/utils/helpers';
let dlcChangeTimer: ExpectedAny = null;

const Component = (props: ExpectedAny) => {
	const { data, changePedClothing, setData } = ComponentState();
	const { itemData, setItemData, lang } = props;

	const changeDataAcrossTextures = async (changeData: ExpectedAny) => {
		try {
			setData((currentData: ExpectedAny) => {
				// Update data across all textures
				const sourceData = itemData;
				const existingData = currentData.clothes;
				existingData.forEach((c: Clothes, ix: number) => {
					if (
						c.drawableId === sourceData.drawableId &&
						c.type === sourceData.type &&
						c.isAddon === sourceData.isAddon &&
						c.gender === sourceData.gender
					) {
						const newData = changeData(existingData[ix]);

						existingData[ix] = {
							...existingData[ix],
							...newData
						};
					}
				});

				return { ...currentData, clothes: existingData };
			});
		} catch (err) {
			await logError('CHANGE_DATA_ACROSS_TEXTURES', err);
		}
	};

	useEffect(
		() => () => {
			if (dlcChangeTimer !== null) {
				// Clear timeout
				clearTimeout(dlcChangeTimer);

				// Reset timer id
				dlcChangeTimer = null;
			}
		},
		[]
	);

	const passingProps = {
		changeDataAcrossTextures
	};

	return (
		<React.Fragment>
			{data.permissions.create && (
				<div className="form-group">
					<div className="input-label">{lang.get('IsAddon')}</div>
					<div className="input-container">
						<Select
							disabled={!data.permissions.update}
							value={itemData.isAddon === true ? 'true' : 'false'}
							fullWidth={true}
							onChange={(ev: ExpectedAny) =>
								setItemData({
									...itemData,
									isAddon: ev.target.value === 'true' ? true : false
								})
							}
						>
							<MenuItem value="true">{lang.get('Yes')}</MenuItem>
							<MenuItem value="false">{lang.get('No')}</MenuItem>
						</Select>
					</div>
				</div>
			)}
			{itemData.isAddon && data.permissions.create && (
				<div className="form-group">
					<div className="input-label">{lang.get('DlcName')}</div>
					<div className="input-container">
						<TextField
							disabled={!data.permissions.update}
							variant="outlined"
							fullWidth={true}
							type="text"
							placeholder={lang.get('DlcName')}
							value={itemData.dlcName}
							onChange={(ev) => {
								setItemData({ ...itemData, dlcName: ev.target.value });

								if (dlcChangeTimer !== null) {
									// Clear timeout
									clearTimeout(dlcChangeTimer);

									// Reset timer id
									dlcChangeTimer = null;
								}

								dlcChangeTimer = setTimeout(() => {
									// Callback function
									changeDataAcrossTextures((item: Clothes) => ({
										...item,
										dlcName: ev.target.value
									}));

									// Reset timer id
									dlcChangeTimer = null;
								}, 400);
							}}
						/>
					</div>
				</div>
			)}
			{itemData.type === 'tops' && (
				<React.Fragment>
					<div className="form-group">
						<div className="input-label">{lang.get('UndershirtCompatible')}</div>
						<div className="input-container">
							<Select
								disabled={!data.permissions.update}
								value={
									itemData.meta.undershirtCompatible === true ? 'true' : 'false'
								}
								fullWidth={true}
								onChange={(ev: ExpectedAny) => {
									setItemData({
										...itemData,
										meta: {
											...itemData.meta,
											undershirtCompatible:
												ev.target.value === 'true' ? true : false
										}
									});

									// Sync across textures
									changeDataAcrossTextures((item: Clothes) => ({
										...item,
										meta: {
											...item.meta,
											undershirtCompatible:
												ev.target.value === 'true' ? true : false
										}
									}));

									// Doing this to trigger the undershirt to appear / dissapear on this option.
									changePedClothing('top', data.clothing.top, {
										...data.clothing.top.meta,
										undershirtCompatible:
											ev.target.value === 'true' ? true : false
									});
								}}
							>
								<MenuItem value="true">{lang.get('Yes')}</MenuItem>
								<MenuItem value="false">{lang.get('No')}</MenuItem>
							</Select>
						</div>
					</div>
					<TorsoSwitcher {...props} {...passingProps} />
				</React.Fragment>
			)}
			{data.permissions.delete && <DeleteButton {...props} {...passingProps} />}
		</React.Fragment>
	);
};

export default Component;
