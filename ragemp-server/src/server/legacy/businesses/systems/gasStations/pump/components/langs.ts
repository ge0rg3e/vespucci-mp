import { createLanguagePack } from '@vmp/i18n';

createLanguagePack('gasStation.pump:useDialog', {
	dialogTitle: {
		EN: ({ pumpId }) => `Gas Station - Pump No. ${pumpId}`,
		RO: ({ pumpId }) => `Benzinărie - Pompa Nr. ${pumpId}`
	},
	dialogContent: {
		EN: () => `What do you wish to do with the pump?`,
		RO: () => `Ce dorești să faci cu pompa?`
	},
	pickUpNozzle: {
		EN: 'Pick up the pump nozzle',
		RO: 'Ridică duza pompei'
	},
	dropNozzle: {
		EN: 'Put back the pump nozzle',
		RO: 'Pune duza pompei înapoi'
	},
	refillPetrolCan: {
		EN: 'Refill petrol can',
		RO: `Umple canistra cu benzină`
	}
});

createLanguagePack(`gasStation:usePump`, {
	pumpUsed: {
		EN: () => `This pump is currently in use by another player.`,
		RO: () => `Această pompă este în prezent folosită de un alt jucător.`
	}
});
