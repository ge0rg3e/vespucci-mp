import React, { useState } from 'react';
import { Button, TextField, Select, MenuItem } from '@mui/material';
import { ComponentState } from '../..';
import { types } from '../leftSide/categories';
// Language
import { createLanguagePack, getLanguagePack } from '@vmp/i18n';
import LanguagePack from './createClothing.lanuage';
const LanguageSystemId = 'clothesManagement:CreateClothing';
createLanguagePack(LanguageSystemId, LanguagePack);

const Component = () => {
	const { data, setSettings } = ComponentState();
	const [entries, setEntries] = useState<ExpectedAny>([]);
	const lang = getLanguagePack(LanguageSystemId, window.language);
	const [showLastIds, setShowLastIds] = useState(false);
	const [gender, setGender] = useState('male');

	const close = () => {
		setSettings('createClothing', false);
	};

	const addClothing = () => {
		const newEntries = [...entries];
		const lastEntry = newEntries[newEntries.length - 1];

		newEntries.push({
			textures: 26,
			drawableId: lastEntry ? lastEntry.drawableId + 1 : 1,
			type: lastEntry ? lastEntry.type : 'tops',
			gender: lastEntry ? lastEntry.gender : 'male',
			isAddon: lastEntry ? lastEntry.isAddon : true,
			dlcName: lastEntry ? lastEntry.dlcName : 'default'
		});

		setEntries(newEntries);
	};

	const updateEntryData = (index: number, key: string, value: ExpectedAny) => {
		setEntries((currentState: ExpectedAny) => {
			const newState: ExpectedAny = [...currentState];
			newState[index][key] = value;

			return newState;
		});
	};

	const deleteClothing = (index: number) => {
		setEntries((currentState: ExpectedAny) => {
			const newState: ExpectedAny = [...currentState];
			newState.splice(index, 1);
			return newState;
		});
	};

	const saveEntries = () => {
		window.rpc.triggerServer(
			'manageClothes:createClothing',
			JSON.stringify({
				clothesToCreate: entries
			})
		);
		setSettings('createClothing', false);
	};

	const getLastDrawableId = (category: string, isAddon: boolean) => {
		if (isAddon) {
			let src = data.clothes.filter(
				(c: ExpectedAny) => category === c.type && c.isAddon === true
			);

			if (!['masks', 'backpacks'].includes(category)) {
				src = src.filter((c: ExpectedAny) => c.gender === gender);
			}

			// Ordering by SORT
			src = src.sort(function (a: ExpectedAny, b: ExpectedAny) {
				return a.drawableId - b.drawableId;
			});

			return src.length > 0 ? src[src.length - 1].drawableId : 0;
		} else {
			const lastIds: ExpectedAny = data.lastDefaultGameClothingIds;
			const value: ExpectedAny = lastIds[gender][category];
			return value;
		}
	};

	return (
		<div className="create-clothing">
			<div className="modal-wrapper">
				<div className="modal-content wide">
					<div className="header">
						<div className="title">
							{lang.get(
								showLastIds ? 'ShowIdsClothesHeading' : 'AddNewClothesHeading'
							)}
						</div>
						<div className="side">
							<Button
								variant="text"
								onClick={() => {
									setShowLastIds(!showLastIds);
									setGender('male');
								}}
							>
								{lang.get('ShowLastIds', { toggle: showLastIds })}
							</Button>
						</div>
					</div>
					<div className="content">
						{showLastIds ? (
							<React.Fragment>
								<div className="last-ids">
									<div className="entry">
										<div className="label">Vanilla</div>
										<div className="values">
											{types.map((category) => (
												<div className="sub-entry" key={category}>
													<div className="cat-label">{category}:</div>
													<div className="cat-value">
														{getLastDrawableId(category, false)}
													</div>
												</div>
											))}
										</div>
									</div>
									<div className="entry">
										<div className="label">Addons</div>
										<div className="values">
											{types.map((category) => (
												<div
													className="sub-entry"
													key={`addon-${category}`}
												>
													<div className="cat-label">{category}:</div>
													<div className="cat-value">
														{getLastDrawableId(category, true)}
													</div>
												</div>
											))}
										</div>
									</div>
								</div>
								<div className="footer">
									<Button
										variant="contained"
										color="primary"
										onClick={() =>
											setGender(gender === 'male' ? 'female' : 'male')
										}
									>
										{lang.get('ChangeGender')}
									</Button>
									<div className="info">
										{lang.get('CurrentGender')}:{' '}
										{gender === 'male' ? 'Male' : 'Female'}
									</div>
								</div>
							</React.Fragment>
						) : (
							<React.Fragment>
								<div className="entries">
									<React.Fragment>
										<div className="entry entries-header">
											<div className="col type">{lang.get('Type')}</div>
											<div className="col gender">{lang.get('Gender')}</div>
											<div className="col drawableId">Drawable ID</div>
											<div className="col textures">Nr. Textures</div>
											<div className="col dlcName">{lang.get('DLCName')}</div>
											<div className="col isAddon">{lang.get('IsAddon')}</div>
											<div className="col remove">#</div>
										</div>
									</React.Fragment>

									<div className="scrollable">
										{entries.map((entry: ExpectedAny, ix: number) => (
											<div key={ix} className="entry">
												<div className="col type">
													<Select
														fullWidth={true}
														variant="standard"
														renderValue={(value) => (
															<div
																style={{
																	textTransform: 'capitalize'
																}}
															>
																{value}
															</div>
														)}
														value={entry.type}
														onChange={(ev) => {
															updateEntryData(
																ix,
																'type',
																ev.target.value
															);

															if (
																['masks', 'backpacks'].includes(
																	ev.target.value
																) &&
																entry.gender !== 'unisex'
															) {
																updateEntryData(
																	ix,
																	'gender',
																	'unisex'
																);
															}

															if (
																!['masks', 'backpacks'].includes(
																	ev.target.value
																) &&
																entry.gender === 'unisex'
															) {
																updateEntryData(
																	ix,
																	'gender',
																	'male'
																);
															}
														}}
													>
														{types.map((type) => (
															<MenuItem
																key={type}
																value={type}
																style={{
																	textTransform: 'capitalize'
																}}
															>
																{type}
															</MenuItem>
														))}
													</Select>
												</div>
												<div className="col gender">
													<Select
														fullWidth={true}
														variant="standard"
														value={entry.gender}
														renderValue={(value) => (
															<div
																style={{
																	textTransform: 'capitalize'
																}}
															>
																{value}
															</div>
														)}
														onChange={(ev) =>
															updateEntryData(
																ix,
																'gender',
																ev.target.value
															)
														}
													>
														{['male', 'female', 'unisex'].map(
															(type) => (
																<MenuItem
																	key={type}
																	value={type}
																	disabled={
																		(type === 'unisex' &&
																			![
																				'masks',
																				'backpacks'
																			].includes(
																				entry.type
																			)) ||
																		(type !== 'unisex' &&
																			[
																				'masks',
																				'backpacks'
																			].includes(entry.type))
																	}
																	style={{
																		textTransform: 'capitalize'
																	}}
																>
																	{type}
																</MenuItem>
															)
														)}
													</Select>
												</div>
												<div className="col drawableId">
													<TextField
														placeholder="Drawable Id"
														variant="standard"
														type="number"
														fullWidth={true}
														value={entry.drawableId}
														onChange={(ev) =>
															updateEntryData(
																ix,
																'drawableId',
																parseInt(ev.target.value)
															)
														}
													/>
												</div>
												<div className="col textures">
													<TextField
														placeholder="Textures"
														variant="standard"
														type="number"
														fullWidth={true}
														value={entry.textures}
														onChange={(ev) =>
															updateEntryData(
																ix,
																'textures',
																parseInt(ev.target.value)
															)
														}
													/>
												</div>
												<div className="col dlcName">
													<TextField
														placeholder={lang.get('DLCName')}
														variant="standard"
														value={entry.dlcName}
														fullWidth={true}
														onChange={(ev) =>
															updateEntryData(
																ix,
																'dlcName',
																ev.target.value
															)
														}
													/>
												</div>
												<div className="col isAddon">
													<Select
														variant="standard"
														fullWidth={true}
														value={entry.isAddon ? 'true' : 'false'}
														onChange={(ev) =>
															updateEntryData(
																ix,
																'isAddon',
																ev.target.value === 'true'
																	? true
																	: false
															)
														}
													>
														<MenuItem value="true">
															{lang.get('Yes')}
														</MenuItem>
														<MenuItem value="false">
															{lang.get('No')}
														</MenuItem>
													</Select>
												</div>
												<div className="col remove">
													<Button
														fullWidth={true}
														variant="outlined"
														onClick={() => deleteClothing(ix)}
													>
														{lang.get('Remove')}
													</Button>
												</div>
											</div>
										))}
									</div>
								</div>
								<div className="footer">
									<div className="left">
										<Button
											variant="contained"
											style={{ marginRight: 8 }}
											onClick={addClothing}
										>
											{lang.get('AddClothingButtonText')}
										</Button>
										<Button variant="contained" onClick={close}>
											{lang.get('ExitButtonText')}
										</Button>
									</div>
									<div className="right">
										<Button
											variant="contained"
											onClick={saveEntries}
											disabled={entries.length < 1}
										>
											{lang.get('Save')}
										</Button>
									</div>
								</div>
							</React.Fragment>
						)}
					</div>
				</div>
			</div>
		</div>
	);
};

export default Component;
