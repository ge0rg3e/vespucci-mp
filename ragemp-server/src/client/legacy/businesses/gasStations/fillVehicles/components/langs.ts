import { createLanguagePack } from '@vmp/i18n';

createLanguagePack(`gasStationPump:Text3D`, {
	pumpHeading: {
		EN: ({ number }) => `Pump No. ${number}`,
		RO: ({ number }) => `Pompa Nr. ${number}`
	},
	priceText: {
		EN: () => `Price per litre:`,
		RO: () => `Pret per litru:`
	},
	Litres: {
		EN: 'Litres',
		RO: 'Litri'
	}
});

createLanguagePack(`gasStation:hintFillVehicle`, {
	insertPump: {
		EN: 'Insert pump in vehicle',
		RO: 'Bagă pompa în mașină'
	},
	removePump: {
		EN: 'Remove pump from vehicle',
		RO: 'Scoate pompa din mașină'
	}
});
