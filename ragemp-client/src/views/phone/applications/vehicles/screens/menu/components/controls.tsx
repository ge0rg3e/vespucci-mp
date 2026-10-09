import { ButtonBase } from '@mui/material';
import React from 'react';
import { AppState } from '../../..';

const Component = () => {
	const { vehicleSelected, lang } = AppState();

	const showNotSpawnedMessage = () => {
		window.phone.showAlert({
			title: lang.get('AlertNotSpawned:Title'),
			description: lang.get('AlertNotSpawned:Description', {
				inGarage: vehicleSelected.status === 2 ? true : false
			}),
			buttons: [
				{
					text: 'Ok',
					onSelection: ({ dismiss }) => dismiss(),
					color: 'blue'
				}
			]
		});
	};

	const onVehicleLock = () => {
		if (vehicleSelected.status !== 1) return showNotSpawnedMessage();
		window.rpc.triggerServer(
			`onVehicleAction:Lock`,
			JSON.stringify({
				id: vehicleSelected.id
			})
		);
	};

	const onVehiclePark = () => {
		if (vehicleSelected.status !== 1) return showNotSpawnedMessage();
		window.rpc.triggerServer(
			`onVehicleAction:Park`,
			JSON.stringify({
				id: vehicleSelected.id
			})
		);
	};

	const onVehicleFind = () => {
		if (vehicleSelected.status === 0) return showNotSpawnedMessage();
		window.rpc.triggerServer(
			`onVehicleAction:Find`,
			JSON.stringify({
				id: vehicleSelected.id
			})
		);
	};

	const controls: FixableAny = [
		{
			label: vehicleSelected.locked ? lang.get('Locked') : lang.get('Unlocked'),
			icon: vehicleSelected.locked ? `fa-solid fa-lock` : `fa-solid fa-lock-open`,
			onClick: onVehicleLock
		},
		{
			label: lang.get('Park'),
			icon: `fa-solid fa-circle-parking`,
			onClick: onVehiclePark
		},
		{
			label: lang.get('Location'),
			icon: `fa-solid fa-location-arrow`,
			onClick: onVehicleFind
		}
	];

	return (
		<React.Fragment>
			<div className="quick-controls">
				{controls.map((entry: FixableAny, ix: number) => (
					<ButtonBase
						key={ix}
						className="entry"
						disabled={entry.disabled ? true : false}
						onClick={entry.onClick}
					>
						<i
							key={`entry-icon:${ix}-${entry.icon}`}
							className={`elm ${entry.icon}`}
						></i>
						<div className="label">{entry.label}</div>
					</ButtonBase>
				))}
			</div>
		</React.Fragment>
	);
};

export default Component;
