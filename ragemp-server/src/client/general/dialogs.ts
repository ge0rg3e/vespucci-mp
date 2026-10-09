import * as rpc from 'rage-rpc';
import { interfacesOpened, loggedIn, setInterfaceIsOpened } from '@client/natives/interfaces';
import { setEscapeKeyDisabled } from './disableEscape';
import { setControlsDisabled, setCursorVisible } from './cursor';

const ESC_KEY = 0x1b; // ESC

export let dialogActive: ExpectedAny = null;
let dialogDisableEscapeTimer: UndefinedAny = null;

export const getDialogActive = () => dialogActive;

export const isButtonUsedByDialog = (button: string) => {
	if (!dialogActive) return false;
	if (!dialogActive.buttons || dialogActive.buttons.length < 1) return false;

	const used = dialogActive.buttons.find((b: { key: string }) => b.key.toString().toLowerCase() === button.toString().toLocaleLowerCase());

	return used ? true : false;
};

const onShowDialog = (args: ExpectedAny) => {
	dialogActive = JSON.parse(args);
	rpc.triggerBrowsers(`onShowDialog`, args);

	setEscapeKeyDisabled(`dialog`, true, true);

	if (dialogDisableEscapeTimer !== null) {
		// Clear timeout
		clearTimeout(dialogDisableEscapeTimer);

		// Reset variable
		dialogDisableEscapeTimer = null;
	}

	if (dialogActive.type === 'input') {
		setInterfaceIsOpened('dialog', true);
		setCursorVisible(`dialog`, true);
		setControlsDisabled(`dialog`, true);
	}
};

const onHideDialog = async () => {
	rpc.triggerBrowsers(`onHideDialog`);

	dialogDisableEscapeTimer = setTimeout(() => {
		// Reset variable
		setEscapeKeyDisabled(`dialog`, false, true);

		// Reset timeout variable
		dialogDisableEscapeTimer = null;
	}, 1500);

	if (dialogActive && dialogActive.type === 'input') {
		setCursorVisible(`dialog`, false);
		setInterfaceIsOpened('dialog', false);
		setControlsDisabled(`dialog`, false);
	}

	dialogActive = null;
};

rpc.on(`showDialog`, onShowDialog);
rpc.on(`hideDialog`, onHideDialog);

rpc.on(`dialog@close`, () => {
	onHideDialog();
});

mp.keys.bind(ESC_KEY, true, () => {
	if (!loggedIn || !dialogActive || (interfacesOpened.length > 0 && dialogActive && dialogActive.type !== 'input')) {
		return;
	}

	// If they have disabled escape we don't listen to this.
	if (dialogActive.payload.discapeEscapeDialog) return false;

	onHideDialog();
});

const dialogIsUsingButton = (key: string) => (dialogActive && dialogActive.buttons.find((b: ExpectedAny) => b.key.toLowerCase() === key.toLowerCase()) ? true : false);

mp.events.add('render', () => {
	if (dialogActive === null) return;

	if (dialogIsUsingButton('R')) {
		mp.game.controls.disableControlAction(1, 140, true); // R QUICK ATTACK
	}

	if (dialogIsUsingButton('Q"')) {
		mp.game.controls.disableControlAction(1, 141, true); // Q HEAVY ATTACK
	}

	if (dialogIsUsingButton('C')) {
		mp.game.controls.disableControlAction(1, 26, true); // C KEY OIN FOOT
		mp.game.controls.disableControlAction(1, 79, true); // C KEY IN VEHICLE
	}

	if (dialogIsUsingButton('V')) {
		mp.game.controls.disableControlAction(1, 0, true); // V Change camera
	}

	if (dialogIsUsingButton('R') && mp.players.local.vehicle) {
		mp.game.controls.disableControlAction(2, 80, true); // R Key to change veh camera.
	}

	if (dialogIsUsingButton('F')) {
		mp.game.controls.disableControlAction(0, 23, true); // F - Veh Enter
		mp.game.controls.disableControlAction(2, 75, true); // F - Veh Exit
	}

	if (dialogIsUsingButton('G') && !mp.players.local.vehicle) {
		mp.game.controls.disableControlAction(0, 47, true); // G - Veh Passenger
	}
});
