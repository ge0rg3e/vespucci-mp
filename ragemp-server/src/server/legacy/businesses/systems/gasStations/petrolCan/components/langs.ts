import { formatNumber } from '@server/utils/helpers';
import { createLanguagePack } from '@vmp/i18n';

createLanguagePack('petrolCan:onItemUse', {
	alreadyHoldingPetrolCan: {
		EN: 'You are already holding a petrol can.',
		RO: 'Deja ții în mână o canistră de benzină.'
	},
	noGasStationNearby: {
		EN: 'Cannot use item. The petrol can is empty. Go to a gas station to fill it.',
		RO: 'Nu poți folosii item-ul. Canistra e goală. Du-te la o benzinărie să încarci.'
	},
	noVehicleNearby: {
		EN: 'Cannot use item. There is no vehicle nearby to fill.',
		RO: 'Nu poți folosii item-ul. Nu există nici o mașină în jur.'
	},
	'instructions:empty': {
		EN: 'Approach a pump to fill the petrol can.',
		RO: 'Apropie-te de o pompă pentru a umple canistra cu benzină.'
	},
	'instructions:filledIn': {
		EN: 'Get close to a vehicle to start filling.',
		RO: 'Apropie-te de o mașină pentru a începe să alimentezi.'
	},
	'instructions:escape': {
		EN: "Press 'ESC' to return petrol can to inventory",
		RO: " Apasă 'ESC' pentru a pune canistra înapoi în inventar."
	},
	cannotUseInVehicle: {
		EN: 'Cannot use item inside a vehicle.',
		RO: 'Nu poți folosi item-ul în mașină.'
	}
});

createLanguagePack(`petrolCan:fillDialog`, {
	submitButton: {
		EN: 'Pay and fill the petrol can',
		RO: 'Plătește și umple canistra'
	},
	dialogTitle: {
		EN: 'Filling petrol can',
		RO: 'Încarcă canistră benzină'
	},
	dialogContent: {
		EN: ({ maxLitres }) => `Please specify the desired quantity for this petrol can.{BR}The petrol can has a maximum capacity of ${maxLitres} liters.`,
		RO: ({ maxLitres }) => `Te rugăm să specifici cantitatea dorită pentru umplerea acestei canistre.{BR}Canistra de benzină are o capacitate maximă de ${maxLitres} litri.`
	}
});

createLanguagePack(`petrolCan:fillDialog@onResponse`, {
	maxPetrolLitres: {
		EN: ({ litres }) => `This petrol can holds a maximum of ${litres} litres.`,
		RO: ({ litres }) => `Această canistră poate conține maxim ${litres} litri de benzină.`
	},
	TooMuchForThisPetrolCan: {
		EN: ({ fuelAmount, currentFuel }) => `You can't add ${fuelAmount} litres as it exceeds the limit. Currently, there are ${currentFuel} litres in this petrol can.`,
		RO: ({ fuelAmount, currentFuel }) => `Nu poți adăuga ${fuelAmount} litri deoarece depășește limita. În acest moment, canistra conține ${currentFuel} litri.`
	},
	NotEnoughMoney: {
		EN: ({ moneyNeeded }) => `Insufficient funds. You need ${formatNumber(moneyNeeded, true)} to pay for the petrol.`,
		RO: ({ moneyNeeded }) => `Fonduri insuficiente. Ai nevoie de ${formatNumber(moneyNeeded, true)} pentru a plăti pentru benzină.`
	},
	PumpAlreadyUsed: {
		EN: () => `This pump is currently in use by someone else.`,
		RO: () => `Această pompă este în prezent utilizată de altcineva.`
	},
	SuccessFill: {
		EN: ({ litres }) => `Petrol successfully added. It now contains ${litres} litres. The item has been returned to your inventory.`,
		RO: ({ litres }) => `Ai adăugat cu succes benzină în această canistră. Acum conține ${litres} litri de benzină. Item-ul a fost pus în inventar.`
	},
	progressBarLabel: {
		EN: 'Filling the petrol can..',
		RO: 'Se umple canistra..'
	}
});

createLanguagePack(`petrolCan:onTimeoutSuccessful`, {
	SuccessFill: {
		EN: ({ litres }) => `Petrol successfully added. This vehicle has now ${litres} litres. The item has been returned to your inventory.`,
		RO: ({ litres }) => `Ai adăugat cu succes benzină. Acest vehicul are acum ${litres} litri de benzină. Item-ul a fost pus în inventar.`
	}
});

createLanguagePack(`petrolCan:fillVehicleInSight`, {
	progressBarLabel: {
		EN: 'Adding fuel...',
		RO: 'Se adaugă combustibil...'
	},
	gasTankIsFull: {
		EN: 'This vehicle is full already.',
		RO: 'Acest vehicul este full deja.'
	}
});
