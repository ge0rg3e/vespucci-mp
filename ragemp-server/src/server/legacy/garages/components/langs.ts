import { createLanguagePack } from '@vmp/i18n';

createLanguagePack('Garages:Entrance', {
	DialogKeyEnterText: {
		EN: `Enter this garage`,
		RO: `Intră în acest garaj`
	},
	DialogKeyPutText: {
		EN: `Park vehicle in garage`,
		RO: `Parchează vehicul în garaj`
	},
	DialogKeyCancelText: {
		EN: `Cancel`,
		RO: `Anulează`
	},
	DialogTitle: {
		EN: `House Garage`,
		RO: `Garaj Casă`
	},
	DialogContent: {
		EN: ({ inVehicle }) => {
			if (inVehicle) return `You can put this vehicle in garage or directly take other vehicles out by managing the garage.`;
			else return `You can enter this garage to check your vehicles or directly take the vehicles out by managing the garage.`;
		},
		RO: ({ inVehicle }) => {
			if (inVehicle) return `Poți bagă acest vehicul în garaj sau să scoți alte vehicule din garaj prin gestionarea garajului.`;
			else return `Poți intra în garaj să verifici vehiculele sau scoate vehicule din garaj prin gestionarea garajului.`;
		}
	},
	DialogFooter: {
		EN: ({ ownerId, garageId, type }) => `Garage with Id ${garageId} is linked to ${type === 1 ? 'house' : '(UNKNOWN TYPE)'} with Id ${ownerId}`,
		RO: ({ ownerId, garageId, type }) => `Garaj cu Id ${garageId} aparține de ${type == 1 ? 'casa' : '(UNKNOWN TYPE)'} cu Id ${ownerId}`
	},
	'Toast:DriverParkedHisVehicle': {
		EN: ({ driver }) => `${driver} parked his vehicle in garage.`,
		RO: ({ driver }) => `${driver} a parcat vehiculul în garaj.`
	}
});

createLanguagePack('Garages:Exit', {
	DialogKeyExitText: {
		EN: `Leave garage`,
		RO: `Ieși din garaj`
	},
	DialogKeyEnterHouse: {
		EN: `Enter house`,
		RO: `Intră în casă`
	},
	DialogTitle: {
		EN: `Garage door`,
		RO: `Ușă garaj`
	},
	DialogContent: {
		EN: `What action would you like to do?`,
		RO: `Ce acțiune dorești să faci?`
	},
	DialogContentCannotLeaveOnVehicle: {
		EN: 'You cannot leave while being on a vehicle',
		RO: 'Nu poți ieși din cauză că te aflii intr-un vehicul'
	}
});

createLanguagePack(`Garages:ParkVehicleInGarage`, {
	'Toast:ErrorOnlyYourPersonalVehicles': {
		EN: 'You can park only your personal vehicles in garage.',
		RO: 'Poti parca doar vehiculele tale personale in garaj.'
	},
	'Toast:NoSpaceInGarage': {
		EN: 'This garage is already fully occupied.',
		RO: 'Acest garaj numai are locuri disponibile.'
	},
	'Toast:ParkingSuccess': {
		EN: ({ veh }) => `${veh} has been parked in garage.`,
		RO: ({ veh }) => `${veh} a fost parcat în garaj.`
	},
	'Toast:VehicleTooBig': {
		EN: 'This vehicle is too big to be parked inside a garage.',
		RO: 'Acest vehicul este prea mare pentru a fi parcat în garaj.'
	}
});

createLanguagePack(`Garages:ParkingInstructions`, {
	DialogTitle: {
		EN: 'Vehicle parked successfully',
		RO: 'Vehicul parcat cu success'
	},
	DialogContent: {
		EN: ({ vehicleModel }) => `Your ${vehicleModel} is now parked in garage. Enter the vehicle again to take it out of the garage.`,
		RO: ({ vehicleModel }) => `${vehicleModel} tău este acum parcat în garaj. Intră în vehicul iar ca să îl scoți din garaj.`
	},
	DialogKeyHideDialog: {
		EN: `Hide this message`,
		RO: `Ascunde acest mesaj`
	}
});

createLanguagePack(`Garages:Vehicle`, {
	DialogKeyTakeOutText: {
		EN: `Drive vehicle out of garage`,
		RO: `Scoate vehiculul din garaj`
	},
	DialogTitle: {
		EN: `Vehicle in garage`,
		RO: `Vehicul în garaj`
	},
	DialogContent: {
		EN: `This vehicle is parked in your garage. Press the button below to take the vehicle out of the garage.`,
		RO: `Acest vehicul este parcat în garajul tău. Apasă butonul de mai jos pentru a scoate vehiculul din garaj.`
	}
});

createLanguagePack('Garages:NotOwnerVehicle', {
	DialogTitle: {
		EN: `Cannot remove from garage`,
		RO: `Nu poți scoate vehicul din garaj`
	},
	DialogContent: {
		EN: `Only the owner of this vehicle can remove this vehicle from the garage.`,
		RO: `Doar propietarul acestui vehicul poate scoate acest vehicul din garaj.`
	}
});

createLanguagePack(`Garages:EntranceAccessDenied`, {
	DialogTitle: {
		EN: `Garage Entrance`,
		RO: `Intrare garaj`
	},
	DialogContent: {
		EN: ({ messageId }) => {
			if (messageId === 1) return `You don't have permission to use this garage.`;
			if (messageId === 2) return `House must be upgraded to level 3 to use this. `;
			return `Unknown message.`;
		},
		RO: ({ messageId }) => {
			if (messageId === 1) return `Nu ai permisiunea să folosești acest garaj.`;
			if (messageId === 2) return `Casa trebuie să aibe upgrade level 3 pentru a folosii asta.`;
			return 'Unknown message.';
		}
	}
});
