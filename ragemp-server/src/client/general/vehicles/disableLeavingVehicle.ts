import * as rpc from 'rage-rpc';

let canLeaveVehicle = true;

rpc.on(`setUnableToLeaveVehicle`, (args: string) => {
	const { bool } = JSON.parse(args);
	canLeaveVehicle = !bool;
});

mp.events.add('render', () => {
	if (canLeaveVehicle === false) {
		mp.game.controls.disableControlAction(2, 75, true); // F - Veh Exit
	}
});
