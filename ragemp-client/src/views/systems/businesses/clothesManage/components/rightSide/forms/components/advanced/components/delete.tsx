import React, { useState } from 'react';

// Components
import { Button, Checkbox } from '@mui/material';

// Dependencies
import { ComponentState } from '../../../../../../';
import { logError } from '@/utils/helpers';
import { refreshTextures } from '../../../../actions';

const Component = (props: ExpectedAny) => {
	const { itemId, setData, setItemId } = ComponentState();
	const { data, texturesFound, setTexturesFound } = ComponentState();
	const { lang } = props;

	const [confirmDelete, setConfirmDelete] = useState(false);
	const [deleteIds, setDeleteIds] = useState<ExpectedAny>([]);

	const deleteData = async () => {
		try {
			const removedIds = deleteIds;

			const newClothes = data.clothes.filter((c: Clothes) => !removedIds.includes(c.id));
			const newOriginalClothes = data.originalClothes.filter(
				(c: Clothes) => !removedIds.includes(c.id)
			);

			window.rpc.triggerServer(
				'manageClothes:deleteClothing',
				JSON.stringify({
					clothesToDelete: texturesFound.filter((f: ExpectedAny) =>
						removedIds.includes(f.id)
					)
				})
			);

			if (removedIds.includes(itemId)) {
				setItemId(null);
			} else {
				refreshTextures(
					data.clothes.find((c: ExpectedAny) => c.id === itemId),
					newClothes,
					setTexturesFound
				);
			}

			setData({
				...data,
				clothes: newClothes,
				originalClothes: newOriginalClothes
			});
			setConfirmDelete(false);
			setDeleteIds([]);
		} catch (err) {
			await logError(`DELETE_CLOTHES_DATA`, err);
		}
	};
	
	return (
		<React.Fragment>
			<div className="form-group">
				<div className="input-label wd">{lang.get('DeleteDataHeading')}</div>
				<div className="input-description">
					{confirmDelete
						? lang.get('AreYouSureYouWannaDelete')
						: lang.get('DeleteDataDescription')}
				</div>
				<div className="input-container">
					{confirmDelete && (
						<React.Fragment>
							<div
								className="checkboxes"
								style={{
									display: 'flex',
									flexDirection: 'row',
									flexWrap: 'wrap',
									flex: 1,
									marginBottom: 16
								}}
							>
								{texturesFound.map((entry: ExpectedAny, ix: number) => (
									<div
										key={ix}
										style={{
											display: 'flex',
											flexDirection: 'row',
											alignItems: 'center',
											marginBottom: 8,
											flexBasis: '50%'
										}}
										onClick={() => {
											const index = deleteIds.findIndex(
												(c: ExpectedAny) => c === entry.id
											);
											const ids = [...deleteIds];

											if (index !== -1) {
												ids.splice(index, 1);
											} else {
												ids.push(entry.id);
											}
											setDeleteIds(ids);
										}}
									>
										<Checkbox
											checked={deleteIds.includes(entry.id)}
											style={{ padding: 0 }}
										/>
										<div
											className="text"
											style={{
												fontSize: 15,
												lineHeight: '15px',
												marginLeft: 4
											}}
										>
											{' '}
											Texture {entry.textureId}
										</div>
									</div>
								))}

								<div
									style={{
										display: 'flex',
										flexDirection: 'row',
										alignItems: 'center',
										marginBottom: 8,
										flexBasis: '50%'
									}}
									onClick={() => {
										/* eslint-disable */
										const ids =
											deleteIds.length === texturesFound.length
												? []
												: [...texturesFound.map((i: ExpectedAny) => i.id)];
										/* eslint-enable */
										setDeleteIds(ids);
									}}
								>
									<Checkbox style={{ padding: 0 }} checked={false} />
									<div
										className="text"
										style={{
											fontSize: 15,
											lineHeight: '15px',
											marginLeft: 4
										}}
									>
										All textures
									</div>
								</div>
							</div>
						</React.Fragment>
					)}
					<div style={{ display: 'flex', flexDirection: 'row' }}>
						{confirmDelete ? (
							<React.Fragment>
								<Button
									variant="contained"
									fullWidth={true}
									onClick={deleteData}
									disabled={!data.permissions.update || deleteIds.length < 1}
									style={{ marginRight: 8 }}
								>
									{lang.get('Yes')}
								</Button>
								<Button
									variant="contained"
									fullWidth={true}
									onClick={() => {
										setConfirmDelete(false);
									}}
									disabled={!data.permissions.update}
								>
									{lang.get('No')}
								</Button>
							</React.Fragment>
						) : (
							<React.Fragment>
								<Button
									variant="outlined"
									fullWidth={true}
									onClick={() => {
										setConfirmDelete(true);
										setDeleteIds([]);
									}}
									disabled={!data.permissions.update}
								>
									{lang.get('DeleteDataButtonText')}
								</Button>
							</React.Fragment>
						)}
					</div>
				</div>
			</div>
		</React.Fragment>
	);
};

export default Component;
