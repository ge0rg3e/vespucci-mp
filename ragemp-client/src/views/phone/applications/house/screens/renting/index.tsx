import React from 'react';

// Components
import NavigationHeader from '@phone/components/ui/navigationHeader';
import Section from '@phone/components/ui/section';
import ScrollableContainer from '@phone/components/ui/scrollableContainer';
import Form from '@phone/components/ui/form';
import Switch from '@/views/phone/components/ui/list/components/switch';
import InputField from '@phone/components/ui/inputField';
import List from '@phone/components/ui/list';

// Dependencies
import { formatNumber } from '@/utils/helpers';

// Context
import { AppState } from '../..';

// VARIABLES
const MAX_RENT = 30;
const MIN_RENT = 1;

const Component = () => {
	const { data, lang, setScreen, updateData } = AppState();

	const onRentPriceChanges = (value: number) => {
		const newValue = value;
		updateData(`rentPrice`, newValue);
	};

	const kickTenant = async (username: string) => {
		// Evicting the player
		window.rpc.triggerServer(
			`onTenantKicked`,
			JSON.stringify({
				username
			})
		);
		// Updating the interface accordingly
		const newTenants = data.houseData.tenants.filter((u: string) => u !== username);
		updateData(`tenants`, newTenants);
	};

	const changeGarageAccess = async (username: string, newBool: boolean) => {
		// Evicting the player
		window.rpc.triggerServer(
			`onTenantChangeGarageAccess`,
			JSON.stringify({
				username
			})
		);

		// Updating the interface accordingly
		const newTenants = [...data.houseData.tenants];

		const tenantIndex = newTenants.findIndex((t) => t.name === username);
		if (tenantIndex === -1) return false;
		newTenants[tenantIndex].meta.canUseGarage = newBool;
		updateData(`tenants`, newTenants);
	};

	const onTenantSelected = (entry: FixableAny) => {
		const tenantOptions = [
			{
				text: lang.get('Rent:ActionSheetEvict'),
				onSelection: ({ dismiss }: ExpectedAny) => {
					kickTenant(entry.payload.username);
					dismiss();
				}
			}
		];

		if (data.houseMeta.garage) {
			tenantOptions.push({
				text: lang.get(`Rent:ActionSheetGiveParking`, {
					cb: entry.payload.meta.canUseGarage ? true : false
				}),
				onSelection: ({ dismiss }: ExpectedAny) => {
					changeGarageAccess(
						entry.payload.username,
						entry.payload.meta.canUseGarage ? false : true
					);
					dismiss();
				}
			});
		}

		window.phone.showActionSheet({
			title: lang.get('Rent:ActionSheetTitle'),
			description: lang.get('Rent:ActionSheetDescription'),
			options: tenantOptions,
			cancel: {
				text: lang.get('ActionSheet:Cancel'),
				onCancel: ({ dismiss }) => dismiss()
			}
		});
	};

	const validateRentPrice = (value: number) => {
		if (value < MIN_RENT || value > MAX_RENT)
			// If the number entered is less than the allowed amount or more than
			return lang.get(`Rent:PriceError`, {
				min: MIN_RENT,
				max: MAX_RENT,
				type: value < MIN_RENT ? `less` : `moreThan`
			});

		return true;
	};

	const updateIsRenting = () => {
		const newValue = !data.houseData.isRenting;

		if (data.houseData.upgradeLevel < 2 && newValue === true) {
			window.phone.showAlert({
				title: lang.get('Rent:Alert-1-Title'),
				description: lang.get('Rent:Alert-1-Description'),
				buttons: [
					{
						text: `OK`,
						onSelection: ({ dismiss }) => dismiss()
					}
				]
			});
			return false;
		}
		updateData(`isRenting`, newValue);
	};
	return (
		<div className="screen renting">
			<NavigationHeader
				theme="light"
				title={lang.get('Rent:Title')}
				goBack={() => setScreen('menu')}
			/>
			<ScrollableContainer>
				<Section header="Settings">
					<Form theme="light">
						<Switch
							label={lang.get('Rent:AllowRenting')}
							checked={data.houseData.isRenting}
							onChange={() => updateIsRenting()}
						/>
						{data.houseData.isRenting === true && (
							<React.Fragment>
								<InputField
									theme="light"
									label={lang.get('Rent:PriceLabel')}
									type="number"
									value={data.houseData.rentPrice}
									formatValue={(val) => formatNumber(val, true)}
									onChange={onRentPriceChanges}
									instructions={lang.get('Rent:RentPriceInstructions', {
										max: MAX_RENT,
										min: MIN_RENT
									})}
									validationFunc={validateRentPrice}
								/>
							</React.Fragment>
						)}
					</Form>
				</Section>
				<Section
					header={lang.get('Rent:Tenants')}
					footer={data.houseData.tenants.length < 1 ? lang.get('Rent:NoOne') : ''}
				>
					{data.houseData.tenants.length > 0 && (
						<React.Fragment>
							<List
								theme="light"
								onSelection={(entry) => onTenantSelected(entry)}
								items={data.houseData.tenants.map((u: FixableAny) => ({
									label: u.name,
									payload: { username: u.name, meta: u.meta }
								}))}
							/>
						</React.Fragment>
					)}
				</Section>
			</ScrollableContainer>
		</div>
	);
};

export default Component;
