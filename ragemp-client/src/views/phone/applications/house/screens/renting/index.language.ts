import { LanguagePack } from '@vmp/i18n';

const Language: LanguagePack = {
	'Rent:Title': {
		EN: 'Renting',
		RO: 'Inchiriere'
	},
	'Rent:AllowRenting': {
		EN: 'Rent the house',
		RO: `Închiriază casa`
	},
	'Rent:RentPriceInstructions': {
		EN: ({ min, max }) => `The rent must be between $${min} and $${max}`,
		RO: ({ min, max }) => `Chiria trebuie să fie între $${min} și $${max}`
	},
	'Rent:PriceLabel': {
		EN: 'Cost to rent',
		RO: 'Cost de închiriere'
	},
	'Rent:PriceError': {
		EN: ({ type, min, max }) =>
			type === 'less'
				? `Price can't be less than $${min}`
				: `Price can't be more than $${max}`,
		RO: ({ type, min, max }) =>
			type === 'less'
				? `Prețul nu poate fi mai mic de $${min}`
				: `Prețul nu poate fi mai mult de $${max}`
	},
	'Rent:Tenants': {
		EN: 'Tenants',
		RO: 'Chiriași'
	},
	'Rent:NoOne': {
		EN: 'No one is renting this house',
		RO: 'Nimeni nu închiriază această casă'
	},
	'Rent:ActionSheetTitle': {
		EN: 'Choose an action',
		RO: 'Alege o acțiune'
	},
	'Rent:ActionSheetDescription': {
		EN: `What would you do with this tenant?`,
		RO: `Ce dorești să faci cu acest chiriaș?`
	},
	'Rent:ActionSheetEvict': {
		EN: 'Evict',
		RO: 'Evacuează'
	},
	'Rent:ActionSheetGiveParking': {
		EN: ({ cb }) => (cb === true ? `Remove access from garage` : `Give access to garage`),
		RO: ({ cb }) => (cb === true ? `Scoate access la garaj` : `Oferă access la garaj`)
	},
	'ActionSheet:Cancel': {
		EN: 'Cancel',
		RO: 'Anulează'
	},
	// Alert 1
	'Rent:Alert-1-Title': {
		EN: 'Insufficent upgrade level',
		RO: 'Nivel upgrade insuficient'
	},
	'Rent:Alert-1-Description': {
		EN: 'Check the upgrades section within the application. Upgrade level is too low.',
		RO: 'Verifică secțiunea de upgrades din aplicație. Nivelul de upgrade este prea mic.'
	}
};

export default Language;
