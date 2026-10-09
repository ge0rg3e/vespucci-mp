import { v4 as uuidv4 } from 'uuid'; // For the type messages there's no need to specify a dialogId since we don't do anything on response.
import * as rpc from 'rage-rpc';

mp.Player.prototype.showPlayerDialog = function (props) {
	const {
		dialogId = uuidv4(),
		type,
		footer = null,
		icon = null,
		inputProps = {},
		title,
		content = '',
		listProps = {},
		payload = {},
		buttons = [],
		hideInSeconds = null,
		appearInSeconds = null
	} = props;

	this.triggerClientEvent(`showDialog`, {
		dialogId,
		type,
		title,
		content,
		footer,
		buttons,
		icon,
		listProps,
		inputProps,
		hideInSeconds,
		appearInSeconds,
		payload
	});

	this.updateVars({
		dialogId: dialogId,
		dialogPayload: payload
	});
};

mp.Player.prototype.hidePlayerDialog = function () {
	if (this.vars.dialogId === null) return false;
	this.triggerClientEvent(`hideDialog`);
	this.updateVars({
		dialogId: null,
		dialogPayload: null
	});
	return true;
};

mp.Player.prototype.setDialogCooldown = function (time = 2000) {
	this.updateVars({
		dialogCooldown: true,
		dialogCooldownSeconds: time
	});
};

mp.events.add('everySecondForPlayerTimer', (player) => {
	if (player.vars.dialogCooldown === true) {
		player.vars.dialogCooldownSeconds -= 1000;

		if (player.vars.dialogCooldownSeconds < 1) {
			player.updateVars({
				dialogCooldown: false,
				dialogCooldownSeconds: 0
			});
		} else {
			player.updateVars({
				dialogCooldownSeconds: player.vars.dialogCooldownSeconds
			});
		}
	}
});

mp.events.add('loadPlayerDefaults', (player) => {
	player.updateVars({
		dialogId: null,
		dialogCooldown: false,
		dialogCooldownSeconds: 0
	});
});

rpc.on('onDialogResponse', async (args: ExpectedAny, { player }: rpc.ProcedureInfo) => {
	if (!player) return false; // Avoiding TS Error.

	const { dialogId, responseKey, listItemSelected, listItemOptions, inputText, expired, payload }: DialogResponse = JSON.parse(args);

	let listItemSelectedFormatted = null;

	if (listItemSelected !== null && listItemOptions !== null && listItemOptions[listItemSelected]) {
		listItemSelectedFormatted = listItemOptions[listItemSelected];
	}

	const dialogResponse = {
		dialogId,
		responseKey,
		listItemSelected: listItemSelectedFormatted,
		listItemOptions,
		listItemSelectedIndex: listItemSelected,
		inputText,
		expired,
		payload
	};

	mp.events.call('onDialogResponse', player, dialogResponse);
	mp.events.call(`onDialogResponse@${dialogResponse.dialogId}`, player, dialogResponse);
	return true;
});

declare global {
	type DialogResponse = {
		dialogId: string;
		responseKey: string;
		listItemSelected: ExpectedAny;
		listItemSelectedIndex: number;
		listItemOptions: Array<ExpectedAny>;
		inputText: string | number;
		expired: boolean;
		buttons: Array<DialogButton>;
		payload: Record<string, ExpectedAny>;
	};

	interface PlayerMp {
		showPlayerDialog(props: dialogProps): void;
		hidePlayerDialog(): void;
		setDialogCooldown(time?: number): void;
	}

	interface DialogButton {
		text: string;
		key: string;
	}

	interface PlayerVariables {
		dialogId: null | string;
		dialogPayload: Record<string, ExpectedAny> | null;
		dialogCooldown: boolean;
		dialogCooldownSeconds: number;
	}

	type dialogType = 'input' | 'message' | 'list';

	interface dialogProps {
		dialogId?: string;
		type: dialogType;
		title: string;
		content?: string;
		footer?: string;
		buttons?: Array<DialogButton>;
		appearInSeconds?: number | null;
		hideInSeconds?: number | null;
		inputProps?: {
			multiline?: boolean;
			type?: 'text' | 'password' | 'number';
		};
		listProps?: {
			columns?: Array<string>; // Will be later used by list.
			entries: Array<ExpectedAny>;
		};
		icon?: 'information' | 'warning' | 'question';
		payload?: Record<string, ExpectedAny>;
	}
}

export {};
