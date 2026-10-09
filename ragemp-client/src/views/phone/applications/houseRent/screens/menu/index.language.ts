import { LanguagePack } from '@vmp/i18n';

const Language: LanguagePack = {
	WelcomeHome: {
		EN: 'Welcome to your rent',
		RO: 'Bun venit în chirie'
	},
	YourRentHeading: {
		EN: 'Your rent',
		RO: 'Chiria ta'
	},
	HouseID: {
		EN: 'Identifier',
		RO: 'Identificare'
	},
	UpgradeLevel: {
		EN: 'Upgrade level',
		RO: 'Nivel upgrade'
	},
	OwnerName: {
		EN: 'Owner',
		RO: 'Propietar'
	},
	RentCost: {
		EN: 'Rent cost',
		RO: 'Costul chiriei'
	},
	PerHour: {
		EN: ({ value }) => `${value} per hour`,
		RO: ({ value }) => `${value} per oră`
	},
	Garage: {
		EN: 'Garage exists',
		RO: 'Garaj există'
	},
	GarageSlots: {
		EN: ({ bool }) => (bool ? `Yes` : 'No'),
		RO: ({ bool }) => (bool ? 'Da' : 'Nu')
	},
	Tenants: {
		EN: 'Number of tenants',
		RO: 'Număr de chiriași'
	},
	LeaveThisRent: {
		EN: 'Leave this rent',
		RO: 'Părăsește chiria'
	},

	// Alerts
	'ConfirmEviction:Title': {
		EN: 'Leave rent',
		RO: 'Părăsește chiria'
	},
	'ConfirmEviction:Description': {
		EN: 'Are you sure you want to leave this rent? You will not have a home anymore.',
		RO: 'Ești sigur că vrei să părăsești această chirie? Vei rămâne fără casă.'
	},
	'ConfirmEviction:Confirm': {
		EN: 'Confirm',
		RO: 'Confirmă'
	},
	'ConfirmEviction:Cancel': {
		EN: 'Cancel',
		RO: 'Anulează'
	}
};

export default Language;
