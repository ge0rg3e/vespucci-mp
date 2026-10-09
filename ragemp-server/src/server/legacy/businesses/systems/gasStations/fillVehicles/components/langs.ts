import { formatNumber } from '@server/utils/helpers';
import { createLanguagePack } from '@vmp/i18n';

createLanguagePack(`gasStation:pickNozzle`, {
	noVehiclesNearby: {
		EN: 'There are no vehicles nearby that need fuel.',
		RO: 'Nu sunt mașini în apropiere care să aibă nevoie de combustibil.'
	},
	notEnoughMoney: {
		EN: "You don't have enough money to purchase a liter of fuel.",
		RO: 'Nu ai suficienți bani pentru a cumpăra un litru.'
	},
	attachPumpToVehicle: {
		EN: 'Connect the pump to a vehicle to start fueling.',
		RO: 'Pune pompa în vehicul pentru a începe alimentarea.'
	}
});

createLanguagePack(`gasStation:insertNozzleInVehicle`, {
	noCarTank: {
		EN: `This vehicle doesn't have a fuel tank.`,
		RO: 'Acest vehicul nu are rezervor de combustibil.'
	},
	nozzleAlreadyAttached: {
		EN: 'Someone else is already filling this vehicle.',
		RO: 'Acest vehicul este deja alimentat de altcineva.'
	},
	vehicleIsFull: {
		EN: 'The fuel tank is already full.',
		RO: 'Rezervorul de combustibil este deja plin.'
	},
	failedToAttachPump: {
		EN: `You haven't started using the pump in 30 seconds.`,
		RO: 'Nu ai început să folosești pompa în 30 secunde.'
	},
	currentlyFillingPetrolCan: {
		EN: 'You are currently filling a petrol can.',
		RO: 'În acest moment alimentezi o canistră.'
	}
});

createLanguagePack(`gasStation:filling`, {
	ranOutOfMoney: {
		EN: `You've run out of money and cannot continue filling.`,
		RO: `Ai rămas fără bani și nu poți continua alimentarea.`
	},
	finishMessage: {
		EN: ({ litres, cost }) => `You paid ${formatNumber(cost, true)} for ${litres} litres.`,
		RO: ({ litres, cost }) => `Ai plătit ${formatNumber(cost, true)} pentru ${litres} litri.`
	}
});

createLanguagePack(`gasStation:cancelHoldingNozzle`, {
	farAwayFromVehicle: {
		EN: 'You have moved too far from the gas station, we have stopped refueling.',
		RO: 'Te-ai îndepărtat prea mult de stația de alimentare, am oprit alimentarea.'
	}
});
