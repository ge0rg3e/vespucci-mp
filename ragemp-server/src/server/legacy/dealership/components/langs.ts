import { formatNumber } from '@server/utils/helpers';
import { createLanguagePack } from '@vmp/i18n';

createLanguagePack(`Dealership:DialogMenu`, {
	DialogTitle: {
		EN: 'Dealership',
		RO: 'Dealership'
	},
	DialogContent: {
		EN: ({ disabled }) => {
			let str = `Welcome to our dealership. Would you like to buy a new vehicle today or are you just looking?`;

			if (disabled) {
				str = `This dealership is currently closed. Please come back later.`;
			}

			return str;
		},
		RO: ({ disabled }) => {
			let str = `Bun venit la dealership. Dorești să cumperi un vehicul nou astăzi sau dorești să vezi niște modele noi?`;

			if (disabled) {
				str = `Acest dealership este momentan închis. Te rog să revii mai târziu.`;
			}

			return str;
		}
	},
	DialogFooter: {
		EN: ({ id }) => `The ID of this dealership is ${id}`,
		RO: ({ id }) => `ID-ul acestui dealership este ${id}`
	},
	SeeVehicles: {
		EN: 'Enter dealership',
		RO: 'Intră în dealership'
	},
	ManageStock: {
		EN: 'Manage dealership',
		RO: 'Manage dealership'
	}
});

createLanguagePack('DealershipCallback:Buy', {
	'Toast:DsIsDisabled': {
		EN: 'This dealership is closed. Purchases cannot be made.',
		RO: 'Acest dealership a fost inchis. Nu se pot face cumpărături.'
	},
	'Toast:NoStock': {
		EN: "We don't have stock for this vehicle anymore.",
		RO: 'Nu mai avem stock pentru acest vehicul.'
	},
	'Toast:VehiclesLimitReached': {
		EN: `You already reached the limit of vehicles owned. Buy an extra vehicle slot from the shop if you want more slots.`,
		RO: 'Ai atins deja limita de vehicule deținute. Cumără un slot de vehicul extra din shop dacă vrei mai multe slot-uri.'
	},
	'Toast:MinimumDonorTier': {
		EN: ({ tier }) => `Only donors of tier ${tier} can buy this vehicle.`,
		RO: ({ tier }) => `Doar donatorii de tier ${tier} pot cumpăra acest vehicul.`
	},
	'Toast:LowBalance': {
		EN: ({ type }) => `You don't have enough ${type === 'cash' ? 'cash' : 'beach coins'} to buy this vehicle.`,
		RO: ({ type }) => `Nu ai ${type === 'cash' ? 'bani' : 'beach coins'} destui să plătești pentru acest vehicul.`
	},
	'Toast:Success': {
		EN: ({ model, price, purchaseMethod }) => `You bought a ${model} for ${purchaseMethod === 'cash' ? `${formatNumber(price, true)}` : `${formatNumber(price, false)} Beach Coins.`}`,
		RO: ({ model, price, purchaseMethod }) => `Ai cumpărat un ${model} pentru ${purchaseMethod === 'cash' ? `${formatNumber(price, true)}` : `${formatNumber(price, false)} Beach Coins.`}`
	},
	'Toast:NoPhone': {
		EN: `You cannot own a personal vehicle because you don't have a phone.`,
		RO: 'Nu poți deține un vehicul personal deoarece nu ai telefon.'
	}
});

createLanguagePack('DealershipCallback:TestDrive', {
	'Toast:DsIsDisabled': {
		EN: 'This dealership is closed. Purchases cannot be made.',
		RO: 'Acest dealership a fost inchis. Nu se pot face cumpărături.'
	},
	DialogTitle: {
		EN: 'Test Drive',
		RO: 'Test Drive'
	},
	DialogContent: {
		EN: 'This test drive will end in 60 seconds. Get out of the vehicle to stop the test drive sooner than that.',
		RO: 'Acest test drive se va termina în 60 secunde. Coboară din mașina pentru a oprii acest test drive mai devreme.'
	}
});
