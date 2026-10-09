import { warps } from '@server/definitions/warps';
import { logError } from '@server/utils/helpers';
import { getLanguagePack } from '@vmp/i18n';
import * as rpc from 'rage-rpc';

// In the far future maybe we will make a few custom ones only for testing.

const testerTeleports: Record<string, Vector3> = { ...warps };

// For security reasons we must make sure that all the commands and callbacks are 100% available only when not in production.

if (process.env.ENVIRONMENT !== 'production') {
	rpc.register('getTesterToolkitAppData', async (_, { player }: rpc.ProcedureInfo) => {
		try {
			if (!player) return false; // Avoiding TS Error.
			return {
				teleports: Object.keys(testerTeleports),
				currentValues: {
					ghostMode: player.vars.isInGhostmode,
					health: player.health,
					armour: player.armour,
					experience: player.info.experience,
					money: player.info.money,
					level: player.info.level
				}
			};
		} catch (err) {
			await logError('GET_TESTER_TOOLKIT_APP_DATA', err, { player: player?.info.username });
			return rpc.sendInterpetedResponse(500, 'Internal server error');
		}
	});

	rpc.on('onTesterToolkitAction:Teleport', async (args, { player }: rpc.ProcedureInfo) => {
		try {
			if (!player) return false; // Avoiding TS Error.
			const lang = getLanguagePack('TesterToolkit', player.info.language);

			const { selected } = JSON.parse(args);

			// Find the teleport
			const tp = testerTeleports[selected];
			if (!tp) throw new Error(`Failed to find the teleport "${selected}"`);

			if (player.vars.isInGhostmode) {
				player.triggerClientEvent('setGhostCameraPos', { x: tp.x, y: tp.y, z: tp.z });
			}

			player.resetInteriorVarsOnTeleport();

			if (player.vehicle) {
				player.vehicle.setPositionPatched(new mp.Vector3(tp));
				player.vehicle.setDimension(0);
			} else {
				player.position = new mp.Vector3(tp);
				player.dimension = 0;
			}

			player.updateVars({
				houseEntered: null,
				garageEntered: null
			});

			player.createAmplitudeEvent(`Used testing teleport`, { name: selected });
			player.triggerClientEvent(`setPhoneIsRaised`, { boolean: false });
			player.alert({ message: lang.get('Toast:TeleportedTo', { name: selected }), type: 'success' });
			return true;
		} catch (err) {
			await logError(`TESTER_TOOLKIT_TELEPORT`, err, { args });
			return false;
		}
	});

	rpc.on('onTesterToolkitAction:Set', async (args, { player }: rpc.ProcedureInfo) => {
		try {
			if (!player) return false; // Avoiding TS Error.
			const { valueName, value } = JSON.parse(args);
			const lang = getLanguagePack('TesterToolkit', player.info.language);

			if (valueName === 'health') {
				if (value === 0) {
					player.triggerClientEvent(`setPhoneIsRaised`, { boolean: false });
				}
				player.health = value;
				player.triggerBrowserEvent(`updateTesterToolkitData`, {
					path: `currentValues.health`,
					value: value === 0 ? 100 : value
				});
			}

			if (valueName === 'armour') {
				player.armour = value;
				player.triggerBrowserEvent(`updateTesterToolkitData`, {
					path: `currentValues.armour`,
					value: value === 0 ? 100 : value
				});
			}

			if (['experience', 'level', 'money'].includes(valueName)) {
				const keyValue: 'experience' | 'level' | 'money' = valueName;

				if (valueName === 'money') {
					player.setMoney(value);
				} else if (valueName === 'experience') {
					player.setExperience(value);
				} else {
					player.info[keyValue] = value;
				}

				const obj: ExpectedAny = {};
				obj[keyValue] = value;
				player.saveInfo(obj);

				player.triggerBrowserEvent(`updateTesterToolkitData`, {
					path: `currentValues.${keyValue}`,
					value: value
				});
			}

			player.alert({
				message: lang.get('Toast:SetValue', { valueName, value }),
				type: 'success'
			});

			player.createAmplitudeEvent(`Set testing values`, { valueName, value, isTesting: true });
			return true;
		} catch (err) {
			await logError(`TESTER_TOOLKIT_SET`, err, { args });
			return false;
		}
	});

	rpc.on('onTesterToolkitAction:Reset', async (args, { player }: rpc.ProcedureInfo) => {
		try {
			if (!player) return false; // Avoiding TS Error.
			const { valueName } = JSON.parse(args);
			const lang = getLanguagePack('TesterToolkit', player.info.language);

			if (valueName === 'inventory') {
				player.info.inventory = [];
			}

			player.alert({
				message: lang.get('Toast:ResetValue', { valueName }),
				type: 'success'
			});
			player.createAmplitudeEvent(`Reset testing values`, { valueName, isTesting: true });
			return true;
		} catch (err) {
			await logError(`TESTER_TOOLKIT_RESET`, err, { args });
			return false;
		}
	});

	rpc.on('onTesterToolkitAction:Ghostmode', async (args, { player }: rpc.ProcedureInfo) => {
		try {
			if (!player) return false; // Avoiding TS Error.
			const lang = getLanguagePack('TesterToolkit', player.info.language);

			player.updateVars({
				isInGhostmode: !player.vars.isInGhostmode
			});

			player.alpha = player.vars.isInGhostmode ? 0 : 255;

			player.triggerClientEvent('setGhostmode', { ghostmode: player.vars.isInGhostmode });
			player.triggerClientEvent(`setPhoneIsRaised`, { boolean: false });
			player.triggerBrowserEvent(`updateTesterToolkitData`, {
				path: `currentValues.ghostMode`,
				value: player.vars.isInGhostmode ? true : false
			});
			player.alert({
				type: 'info',
				message: lang.get('Toast:GhostMode', { enabled: player.vars.isInGhostmode })
			});
			player.createAmplitudeEvent(`Ghost Mode`, { ghostmode: player.vars.isInGhostmode, isTesting: true });
			return true;
		} catch (err) {
			await logError(`TESTER_TOOLKIT_RESET`, err, { args });
			return false;
		}
	});
}
