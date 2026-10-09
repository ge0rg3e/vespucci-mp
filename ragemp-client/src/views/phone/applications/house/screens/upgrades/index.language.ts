import { LanguagePack } from '@vmp/i18n';

const Language: LanguagePack = {
	'Upgrades:ScreenTitle': {
		EN: 'House Upgrades',
		RO: 'Upgrades casă'
	},
	'Upgrades:Details': {
		EN: 'Current details',
		RO: 'Detalii curente'
	},
	'Upgrades:Cost': {
		EN: 'Cost:',
		RO: 'Cost:'
	},
	'Upgrades:Level': {
		EN: `Current upgrade level`,
		RO: `Upgrade level curent`
	},
	'Upgrades:NextLevelCost': {
		EN: 'Next level cost',
		RO: 'Cost nivel următor'
	},
	'Upgrades:NotAvailable': {
		EN: 'Not available',
		RO: 'Indisponibil'
	},
	'Upgrades:BenefitsAt': {
		EN: ({ val }) => `Benefits at level ${val}`,
		RO: ({ val }) => `Beneficii la nivel ${val}`
	},
	'Upgrades:YouReachedMaximumLevel': {
		EN: "You've reached maximum upgrade level",
		RO: 'Ai atins nivelul maxim de upgrade'
	},
	'Upgrades:Button': {
		EN: 'Upgrade house',
		RO: 'Upgrade casă'
	},
	// Level 1
	'Upgrades:Healing': {
		EN: 'Healing (Max 50 HP)',
		RO: 'Vindecare (Max 50 HP)'
	},
	'Upgrades:Healing-Description': {
		EN: 'Your wounds are automatically healed',
		RO: 'Rănile sunt vindecate automat în casă'
	},
	'Upgrades:Safe': {
		EN: 'Safe',
		RO: 'Seif'
	},
	'Upgrades:Safe-Description': {
		EN: 'You can deposit and withdraw cash safely',
		RO: 'Poți depozita și scoate bani în siguranță'
	},
	// Level 2
	'Upgrades:Renting': {
		EN: 'Rent your house',
		RO: 'Închiriază casa'
	},
	'Upgrades:Renting-Description': {
		EN: 'Earn money from renting your rooms',
		RO: 'Câștigă bani din inchierea casei'
	},
	'Upgrades:Wardrobe': {
		EN: 'Wardrobe',
		RO: 'Garderobă'
	},
	'Upgrades:Wardrobe-Description': {
		EN: 'You can store clothes in your wardrobe',
		RO: 'Spații extra de depozitare pentru haine'
	},
	// Level 3
	'Upgrades:StorageCloset': {
		EN: 'Storage closet',
		RO: 'Cutie depozitare'
	},
	'Upgrades:StorageCloset-Description': {
		EN: 'Extra storage for depositing items',
		RO: 'Spațiu extra de depozitare'
	},
	'Upgrades:Garage': {
		EN: 'Vehicle garage',
		RO: 'Garaj vehicule'
	},
	'Upgrades:GarageDescription': {
		EN: `Park your vehicles inside the garage`,
		RO: `Parchează-ți vehiculele în garaj`
	},
	// Alert 1
	'Upgrades:Alert-1-Title': {
		EN: 'Not enough money',
		RO: 'Bani insuficienți'
	},
	'Upgrades:Alert-1-Description': {
		EN: "You don't have enough money in your house safe.",
		RO: 'Nu ai destui bani în seiful casei.'
	},
	// Alert 2
	'Upgrades:Alert-2-Title': {
		EN: 'Oops.',
		RO: 'Oops.'
	},
	'Upgrades:Alert-2-Description': {
		EN: "We're experiencing difficulties, please try again later.",
		RO: 'Am întămpinat dificultăți, încearcă mai târziu.'
	}
};

export default Language;
