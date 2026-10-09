import React, { useState } from 'react';

// Components
import { Button } from '@mui/material';

// Dependencies
import { ComponentState } from '../../../../../../';

const Component = (props: ExpectedAny) => {
	const { groupedClothes, changePedClothing, setData, settings, setSettings } = ComponentState();
	const { itemData, lang, setItemData, changeDataAcrossTextures } = props;
	const [currentTorsoIndex, setCurrentTorsoIndex] = useState(0);

	const getListedTorso = () =>
		groupedClothes['torsos'].filter((c: Clothes) => c.gender === itemData.gender);

	const previewTorso = (torso: Clothes, save = false) => {
		// console.log('preview torso', torso);

		changePedClothing(
			'torsos',
			{
				drawableId: torso.drawableId,
				textureId: torso.textureId,
				isAddon: torso.isAddon
			},
			{},
			false
		);

		if (save === true) {
			setData((currentState: ExpectedAny) => ({
				...currentState,
				clothing: {
					...currentState.clothing,
					torso: {
						drawableId: torso.drawableId,
						textureId: torso.textureId,
						isAddon: torso.isAddon
					}
				}
			}));
		}
	};

	const saveTorsoChange = () => {
		setSettings('swappingTorsos', false);

		setItemData({
			...itemData,
			meta: {
				...itemData.meta,
				torsoRecommended: getListedTorso()[currentTorsoIndex].id
			}
		});

		previewTorso(getListedTorso()[currentTorsoIndex], true);

		changeDataAcrossTextures((item: Clothes) => ({
			...item,
			meta: {
				...item.meta,
				torsoRecommended: getListedTorso()[currentTorsoIndex].id
			}
		}));
	};

	return (
		<React.Fragment>
			<div className="form-group">
				<div className="input-label">{lang.get('TorsoMatch')}</div>
				<div className="input-container torso-selector">
					<div className="current-value">
						{lang.get('CurrentID')}: {itemData.meta.torsoRecommended || 'Undefined'}
					</div>
					<Button
						size="small"
						variant="contained"
						color="primary"
						onClick={() => {
							setSettings('swappingTorsos', !settings.swappingTorsos);

							const currentTorsoIndex = getListedTorso().findIndex(
								(c: Clothes) => c.id === itemData.meta.torsoRecommended
							);
							setCurrentTorsoIndex(currentTorsoIndex !== -1 ? currentTorsoIndex : 0);

							if (!settings.swappingTorsos === false) {
								const match = getListedTorso().find(
									(c: Clothes) => c.id === itemData.meta.torsoRecommended
								);
								previewTorso(match);
							}
						}}
					>
						{lang.get('UpdateTorso', { toggle: settings.swappingTorsos })}
					</Button>
				</div>
				{settings.swappingTorsos && (
					<div className="torsos-listing">
						<div
							className="info"
							style={{
								fontSize: 14,
								fontWeight: 500,
								marginBottom: 8
							}}
						>
							Torso ID: {getListedTorso()[currentTorsoIndex || 0].id}
						</div>
						<div
							style={{
								display: 'flex',
								alignItems: 'center',
								flexDirection: 'row',
								justifyContent: 'space-between'
							}}
						>
							<div
								style={{
									display: 'flex',
									alignItems: 'center',
									flexDirection: 'row'
								}}
							>
								<Button
									variant="contained"
									color="primary"
									size="small"
									disabled={getListedTorso()[currentTorsoIndex - 1] === undefined}
									onClick={() => {
										setCurrentTorsoIndex(currentTorsoIndex - 1);
										previewTorso(getListedTorso()[currentTorsoIndex - 1]);
									}}
									style={{ marginRight: 6 }}
								>
									{lang.get('Previous')}
								</Button>
								<Button
									variant="contained"
									color="primary"
									size="small"
									disabled={getListedTorso()[currentTorsoIndex + 1] === undefined}
									onClick={() => {
										setCurrentTorsoIndex(currentTorsoIndex + 1);
										previewTorso(getListedTorso()[currentTorsoIndex + 1]);
									}}
								>
									{lang.get('Next')}
								</Button>
							</div>
							<Button
								variant="contained"
								color="primary"
								size="small"
								disabled={
									getListedTorso()[currentTorsoIndex] &&
									getListedTorso()[currentTorsoIndex].id ===
										itemData.meta.torsoRecommended
								}
								onClick={saveTorsoChange}
							>
								Save
							</Button>
						</div>
					</div>
				)}
			</div>
		</React.Fragment>
	);
};

export default Component;
