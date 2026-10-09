import React from 'react';
import List from '@phone/components/ui/list';
import Section from '@phone/components/ui/section';
import { AppState } from '../../..';

const Component = () => {
	const { vehicleSelected, sendEventServer, lang } = AppState();

	const onVehicleResetSpecificInfo = () => {
		window.phone.showActionSheet({
			title: lang.get('ResetSpecificInfo:ActionSheetTitle'),
			description: lang.get('ResetSpecificInfo:ActionSheetDescription'),
			options: [
				{
					text: 'Tunning',
					onSelection: ({ dismiss }) => {
						sendEventServer('resetSpecificInfo', { value: 'tunning' });
						window.phone.showAlert({
							title: lang.get('ResetSpecificInfo:ConfirmationTitle'),
							description: lang.get('ResetSpecificInfo:ConfirmationContent', {
								type: 'tunning'
							}),
							buttons: [
								{
									text: 'Ok',
									onSelection: ({ dismiss }) => dismiss(),
									color: 'blue'
								}
							]
						});
						dismiss();
					}
				},
				{
					text: 'Inventory',
					onSelection: ({ dismiss }) => {
						sendEventServer('resetSpecificInfo', { value: 'inventory' });
						window.phone.showAlert({
							title: lang.get('ResetSpecificInfo:ConfirmationTitle'),
							description: lang.get('ResetSpecificInfo:ConfirmationContent', {
								type: 'inventory'
							}),
							buttons: [
								{
									text: 'Ok',
									onSelection: ({ dismiss }) => dismiss(),
									color: 'blue'
								}
							]
						});
						dismiss();
					}
				}
			],
			cancel: {
				text: lang.get('Cancel'),
				onCancel: ({ dismiss }) => dismiss()
			}
		});
	};

	const onVehicleChangeOdometer = () => {
		window.phone.showKeyboard({
			inputData: {
				defaultValue: parseInt(vehicleSelected.odometer),
				type: 'number',
				instructions: lang.get('ChangeOdometer:Instructions'),
				placeholder: lang.get('ChangeOdometer:Placeholder')
			},
			onSubmit: (value, { dismiss }) => {
				sendEventServer('updateOdometer', { value: parseInt(value) });
				window.phone.showAlert({
					title: lang.get('ChangeOdometer:ConfirmationTitle'),
					description: lang.get('ChangeOdometer:ConfirmationDescription'),
					buttons: [
						{
							text: 'Ok',
							onSelection: ({ dismiss }) => dismiss(),
							color: 'blue'
						}
					]
				});
				dismiss();
			},
			validationFunc: (value) => {
				if (value < 0) return lang.get('ChangeOdometer:ValueBelowTheLimit');
				if (value > 999999999) return lang.get('ChangeOdometer:ValueOverTheLimit');
				return true;
			}
		});
	};

	const onVehicleChangeOwner = () => {
		window.phone.showKeyboard({
			inputData: {
				defaultValue: vehicleSelected.ownerName,
				type: 'text',
				instructions: lang.get('ChangeOwner:Instructions'),
				placeholder: lang.get('ChangeOwner:Placeholder')
			},
			onSubmit: async (value, { dismiss }) => {
				const res = await window.rpc.callServer(
					`onVehicleAction:updateOwner`,
					JSON.stringify({
						id: vehicleSelected.id,
						value
					})
				);

				window.phone.showAlert({
					title: lang.get(
						res === true ? 'ChangeOwner:ConfirmationTitle' : 'ChangeOwner:FailedTitle'
					),
					description: lang.get(
						res === true
							? 'ChangeOwner:ConfirmationDescription'
							: 'ChangeOwner:FailedDescription'
					),
					buttons: [
						{
							text: 'Ok',
							onSelection: ({ dismiss }) => dismiss(),
							color: 'blue'
						}
					]
				});

				dismiss();
			},
			validationFunc: (value) => {
				if (value.length < 0) return lang.get('ChangeOwner:NoValue');
				return true;
			}
		});
	};

	const adminEntries: FixableAny = [
		// sa verifice pe back-end ca are admin ,daca nu sa nu mearga.
		{
			label: lang.get('AdminAction:ResetSpecificInfo'), // actionsheet sa ma intrebe ce anume
			icon: `fa-regular fa-database`,
			onSelection: onVehicleResetSpecificInfo
		},
		{
			label: lang.get('AdminAction:UpdateOdometer'),
			icon: `fa-regular fa-gauge`,
			onSelection: onVehicleChangeOdometer
		},
		{
			label: lang.get('AdminAction:UpdateOwner'), // sa ma intrebe owner name, apoi owner id. si abia cand ai am2 detalii sa udpateze!
			icon: `fa-regular fa-file-signature`,
			onSelection: onVehicleChangeOwner
		}
	];

	return (
		<React.Fragment>
			<Section header="Administrator">
				<List
					items={adminEntries.map((x: FixableAny) => ({
						...x,
						icon: {
							type: `fa`,
							class: `variant-custom`,
							elm: x.icon
						},
						value: (
							<div className="arrow-right form-arrow">
								<i className="elm fa-solid fa-chevron-right"></i>
							</div>
						)
					}))}
				/>
			</Section>
		</React.Fragment>
	);
};

export default Component;
