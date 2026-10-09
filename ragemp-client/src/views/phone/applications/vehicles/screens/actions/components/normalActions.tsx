import React from 'react';
import List from '@phone/components/ui/list';
import Section from '@phone/components/ui/section';
import { AppState } from '../../..';

const Component = (props: ExpectedAny) => {
	const { vehicleSelected, sendEventServer, lang, setScreen, setSelectedVehicle } = AppState();

	const onVehicleRespawn = () => {
		if (vehicleSelected.status !== 1) return props.showNotSpawnedMessage();
		sendEventServer('Respawn');
	};

	const onVehicleChangeAutomaticSpawn = () => {
		if (vehicleSelected.position === null) return props.showNotSpawnedMessage();

		window.phone.showActionSheet({
			title: lang.get('AutomaticSpawn:ActionSheetTitle'),
			description: lang.get('AutomaticSpawn:ActionSheetDescription'),
			options: [
				{
					text: lang.get('Activate'),
					onSelection: ({ dismiss }) => {
						sendEventServer('automaticVehicleSpawn', { boolean: true });
						dismiss();
					}
				},
				{
					text: lang.get('Deactivate'),
					onSelection: ({ dismiss }) => {
						sendEventServer('automaticVehicleSpawn', { boolean: false });
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

	const onVehicleAbandoned = () => {
		window.phone.showAlert({
			title: lang.get('VehicleAbandonAlert:Title'),
			description: lang.get('VehicleAbandonAlert:Description'),
			buttons: [
				{
					text: lang.get('Confirm'),
					color: 'red',
					onSelection: ({ dismiss }) => {
						setScreen('list');
						setSelectedVehicle(null);
						sendEventServer('abandonVehicle');
						dismiss();
					}
				},
				{
					text: lang.get('Cancel'),
					onSelection: ({ dismiss }) => dismiss(),
					color: 'blue'
				}
			]
		});
	};

	const entries = [
		{
			label: lang.get('Action:RespawnVehicle'),
			icon: `fa-solid fa-arrows-repeat`,
			onSelection: onVehicleRespawn
		},
		{
			label: lang.get('Action:AutomaticSpawn'),
			icon: `fa-regular fa-circle-parking`,
			onSelection: onVehicleChangeAutomaticSpawn
		},
		{
			label: lang.get('Action:AbandonVehicle'),
			icon: `fa-regular fa-trash`,
			onSelection: onVehicleAbandoned
		}
	];

	return (
		<React.Fragment>
			<Section header="General">
				<List
					items={entries.map((x) => ({
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
