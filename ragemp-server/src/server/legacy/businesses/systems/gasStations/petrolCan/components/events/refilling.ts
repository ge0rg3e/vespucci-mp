import { getLanguagePack } from '@vmp/i18n';

// Dependencies
import { GasStations, getPump, updatePump } from '../../../business/components/functions';
import { MAX_PETROL_CAN_LITRES } from '../items';
import { logError } from '@server/utils/helpers';
import { onTimeoutRefillPetrolCan } from './refilling.functions';
import { cancelTimeout, createTimeout, isTimeoutValid } from '@server/natives/timeouts';

mp.events.add(`loadPlayerDefaults`, (player) => {
	// Add it to client-side
	player.addClientsideVariables(['petrolCan']);

	// To set this
	player.updateVars({
		petrolCan: {
			status: null,
			inventoryItemId: null,
			litres: 0
		}
	});
});

mp.events.add(`petrolCan:showRefillDialog`, async (player: PlayerMp, payload: ExpectedAny) => {
	try {
		// @Reminder: This event is called when someone wants to refill their petrol can at a Gas Station.

		// Get the language
		const lang = getLanguagePack(`petrolCan:fillDialog`, player.lang);

		// Prepare the buttons
		const buttons: ExpectedAny = [
			{
				text: lang.get('submitButton'),
				key: `F`
			}
		];

		// Get the gas station price of ltire.
		const gasStation = GasStations.find((c) => c.id === payload.gasStationId);
		if (!gasStation) throw new Error(`Failed to find gas station data.`);

		// Get the footer text from client-side (language is defined there and used here only once.)
		const footerText: ExpectedAny = await player.invokeClientEvent(`getDialogFooterText@petrolCan:fill`, { litres: 1, costPerLitre: gasStation.costPerLitre });

		// Show the dialog
		player.showPlayerDialog({
			dialogId: `petrolCan:fill`,
			icon: 'information',
			hideInSeconds: null,
			appearInSeconds: null, // instant.
			type: 'input',
			buttons,
			inputProps: {
				type: 'number'
			},
			title: lang.get('dialogTitle'),
			content: lang.get('dialogContent', { maxLitres: MAX_PETROL_CAN_LITRES }),
			footer: footerText,
			payload: {
				...payload,
				costPerLitre: gasStation.costPerLitre
			}
		});
	} catch (err) {
		await logError(`petrolCan:showRefillDialog`, err, payload);
	}
});

mp.events.add(`onDialogResponse@petrolCan:fill`, async (player: PlayerMp, response: ExpectedAny) => {
	try {
		// @Reminder: this is the response to the dialog above.

		// How much fuel he wants
		const fuelAmount = parseInt(response.inputText);

		// Amount is invalid or zero.
		if (!fuelAmount || isNaN(fuelAmount)) return false;

		// If by server mistake they're not holding a petrol can (which would be impossible)
		if (!player.vars.petrolCan.status || !player.vars.petrolCan.inventoryItemId) return false;

		// Get current item
		const inventoryItem = player.getInventoryItemMatch({ id: player.vars.petrolCan.inventoryItemId });
		if (!inventoryItem) return false;

		// Get current fuel amount
		const currentFuel = inventoryItem.meta.litres || 0;

		// Get language pack
		const lang = getLanguagePack(`petrolCan:fillDialog@onResponse`, player.lang);

		// He tries to fill to more than what he has
		if (fuelAmount > MAX_PETROL_CAN_LITRES) return player.alert({ system: 'petrolCan', type: 'error', message: lang.get(`maxPetrolLitres`, { litres: MAX_PETROL_CAN_LITRES }) });

		// IF he already has some and is too much with what he want to add
		if (fuelAmount + currentFuel > MAX_PETROL_CAN_LITRES && currentFuel !== 0)
			return player.alert({ system: 'petrolCan', type: 'error', message: lang.get(`TooMuchForThisPetrolCan`, { fuelAmount, currentFuel }) });

		// Has enough money
		const fuelCost = fuelAmount * response.payload.costPerLitre;

		// Does not have enough money..
		if (!player.hasEnoughMoney(fuelCost)) return player.alert({ system: 'petrolCan', type: 'error', message: lang.get(`NotEnoughMoney`, { moneyNeeded: fuelCost - player.info.money }) });

		// Check if pump is used already...?
		const pumpData = getPump(response.payload.gasStationId, response.payload.pumpId);
		if (!pumpData) return false; // Server mistake.

		// If pump is now used
		if (pumpData.used) return player.alert({ system: 'petrolCan', type: 'error', message: lang.get(`PumpAlreadyUsed`) });

		// Close the dialog
		player.hidePlayerDialog();

		// Take his money..
		player.takeMoney(fuelCost);

		// Update his variables..
		player.updateVars({
			petrolCan: {
				...player.vars.petrolCan,
				// To avoid ESC for working.
				status: 'refilling',
				// To know how many litres
				litres: parseInt(currentFuel + fuelAmount)
			}
		});

		// Mark pump as used
		updatePump(response.payload.gasStationId, response.payload.pumpId, { used: true });

		// Mark him as using the pump
		player.updateVars({
			gasStationPump: {
				gasStationId: response.payload.gasStationId,
				position: response.payload.position,
				pumpId: response.payload.pumpId,
				vehicleId: null,
				litres: null
			}
		});

		// Play the right sound
		player.playSoundEffect(`${`__ASSETS__`}/audios/items/petrolCan/filling.mp3`, { volume: 0.4, identifier: 'petrolCan' });

		// Show loading info
		player.showProgressBar(lang.get('progressBarLabel'), 30);

		// Play animation..
		player.applyAnimation({
			dict: `timetable@gardener@filling_can`,
			name: `gar_ig_5_filling_can`,
			flags: 50,
			speed: 1.0
		});

		// Clear alerts..
		player.clearAlertsFromSystem('petrolCan');

		// Track..
		player.createAmplitudeEvent(`Filling up petrol can`, { currentFuel, fuelAmount, fuelCost });

		// After 30 seconds..
		createTimeout(`fillingPetrolCan:${player.info.id}`, () => onTimeoutRefillPetrolCan(player.info.id, currentFuel + fuelAmount, inventoryItem), 30 * 1000);

		return true;
	} catch (err) {
		await logError(`onDialogResponse@petrolCan:fill`, err);
	}
});

mp.events.add('onPlayerExitColshape', async function (player) {
	// Get colshape
	const colshapes = await player.getActiveColshapes();

	// Making sure..
	if (!colshapes.find((c) => c.identifier.includes(`GasStationPump:`))) return false;

	// Is not ours.
	if (player.vars.dialogId !== 'petrolCan:fill') return false;

	// Hide dialog.
	player!.hidePlayerDialog();

	return;
});

mp.events.add(`pump:cancelHoldingNozzle`, (player: PlayerMp, reason: string) => {
	// He wasn't holding the petrol can at all.
	if (player.vars.petrolCan.status !== 'refilling') return false;

	// If we're filling it as we speak..
	if (isTimeoutValid(`fillingPetrolCan:${player.info.id}`)) {
		// Cancel timeout
		cancelTimeout(`fillingPetrolCan:${player.info.id}`);
	}

	// Clear animation too
	player.clearAnimations();

	// Inform server to stop holding the petrol can
	mp.events.call(`petrolCan:stopHoldingItem`, player);

	// Hide progress bar
	player.hideProgressBar();

	// Stop the sound
	player.stopAudio(`petrolCan`);

	// Track amplitude..
	player.createAmplitudeEvent(`Put petrol can back into Inventory`, { reason });

	return true;
});
