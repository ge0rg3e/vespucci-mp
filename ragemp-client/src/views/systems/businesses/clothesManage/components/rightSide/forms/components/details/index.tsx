import React, { useState, useEffect } from 'react';
import { validateAgainstSchema } from '@/utils/helpers';
import * as yup from 'yup';

// Components
import { TextField, Autocomplete, Select, MenuItem } from '@mui/material';

// Dependencies
import { ComponentState } from '../../../../..';
import { donationsTierList } from '@/utils/definitions/donations';
import { mappedCategories } from './utils/categories.map';

const Component = (props: ExpectedAny) => {
	const { data } = ComponentState();
	const { lang, itemData, setItemData } = props;

	const itemIsBuyable = () => (itemData.type !== 'torsos' ? true : false);

	const [categories, setCategories] = useState([]);

	useEffect(() => {
		setCategories(mappedCategories[itemData.type] ? mappedCategories[itemData.type] : []);
	}, [itemData]);

	return (
		<React.Fragment>
			<div className="form-group">
				<div className="input-label">{lang.get('Name')}</div>
				<div className="input-container">
					<TextField
						variant="outlined"
						fullWidth={true}
						placeholder={lang.get('Name')}
						disabled={!data.permissions.update}
						value={itemData.name}
						onChange={(ev) => setItemData({ ...itemData, name: ev.target.value })}
						{...validateInput(itemData.name, yup.string().required().trim())}
					/>
				</div>
			</div>
			{itemIsBuyable() && (
				<React.Fragment>
					<div className="form-group">
						<div className="input-label">{lang.get('Category')}</div>
						<div className="input-container">
							<Autocomplete
								value={itemData.category}
								onChange={(_, value) =>
									setItemData({ ...itemData, category: value ? value : '' })
								}
								disabled={!data.permissions.update}
								options={categories}
								freeSolo={true}
								fullWidth={true}
								renderInput={(params) => (
									<TextField
										placeholder={lang.get('NoCategorySelected')}
										variant="outlined"
										{...params}
										fullWidth={true}
										{...validateInput(
											itemData.category,
											yup.string().required()
										)}
									/>
								)}
							/>
						</div>
					</div>

					<div className="form-group">
						<div className="input-label">{lang.get('Price')}</div>
						<div className="input-container">
							<TextField
								disabled={!data.permissions.update}
								variant="outlined"
								fullWidth={true}
								type="number"
								placeholder={lang.get('Price')}
								value={itemData.price}
								onChange={(ev) => {
									const value = parseInt(ev.target.value);

									setItemData({ ...itemData, price: value });
								}}
								{...validateInput(itemData.price, yup.number().required())}
							/>
						</div>
					</div>
					<div className="form-group">
						<div className="input-label">{lang.get('BeachCoins')}</div>
						<div className="input-container">
							<TextField
								disabled={!data.permissions.update}
								variant="outlined"
								fullWidth={true}
								type="number"
								placeholder={lang.get('BeachCoins')}
								value={itemData.bcPrice}
								onChange={(ev) => {
									const value = parseInt(ev.target.value);

									setItemData({ ...itemData, bcPrice: value });
								}}
								{...validateInput(itemData.bcPrice, yup.number().required())}
							/>
						</div>
					</div>
					<div className="form-group">
						<div className="input-label">{lang.get('MinimumDonorTier')}</div>
						<div className="input-container">
							<Select
								disabled={!data.permissions.update}
								fullWidth={true}
								value={itemData.minimumDonorTier}
								onChange={(ev) => {
									const value = parseInt(ev.target.value);
									if (isNaN(value) || value < 0) return false;

									setItemData({
										...itemData,
										minimumDonorTier: value
									});
								}}
							>
								<MenuItem value={0}>{lang.get('None')}</MenuItem>
								{donationsTierList.map((entry, ix) => (
									<MenuItem key={ix} value={entry.value}>
										Tier {entry.value} - {entry.label}
									</MenuItem>
								))}
							</Select>
						</div>
					</div>
				</React.Fragment>
			)}

			<div className="form-group">
				<div className="input-label">{lang.get('AvailableInStore')}</div>
				<div className="input-container">
					<Select
						disabled={!data.permissions.update}
						value={itemData.isAvailable === true ? 'true' : 'false'}
						fullWidth={true}
						onChange={(ev: ExpectedAny) =>
							setItemData({
								...itemData,
								isAvailable: ev.target.value === 'true' ? true : false
							})
						}
					>
						<MenuItem value="true">{lang.get('Yes')}</MenuItem>
						<MenuItem value="false">{lang.get('No')}</MenuItem>
					</Select>
				</div>
			</div>
		</React.Fragment>
	);
};

const validateInput = (value: ExpectedAny, schema: ExpectedAny) => {
	const [state, setState] = useState<ExpectedAny>(null);

	const validate = async () => {
		try {
			await validateAgainstSchema(yup.object().shape({ currentValue: schema }), {
				currentValue: value
			});

			setState(null);
		} catch (err: ExpectedAny) {
			setState(err);
		}
	};

	useEffect(() => {
		validate();
	}, [value]);

	if (state && state.includes('cast from the value `NaN`')) return {};

	return {
		helperText: state !== null ? state.replace('currentValue', 'This') : undefined,
		error: state !== null ? true : undefined
	};
};

export default Component;
