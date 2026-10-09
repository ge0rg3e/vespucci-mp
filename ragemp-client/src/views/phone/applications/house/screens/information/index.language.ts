import { LanguagePack } from '@vmp/i18n';

const Language: LanguagePack = {
	'Info:Id': {
		EN: 'Identifier',
		RO: 'Identificare'
	},
	'Info:Level': {
		EN: 'Level',
		RO: 'Nivel'
	},
	'Info:Price': {
		EN: 'Price',
		RO: 'Pret'
	},
	'Info:SafeBalance': {
		EN: 'Safe balance',
		RO: 'Safe balance'
	},
	'Info:PurchasedAt': {
		EN: 'Purchased at',
		RO: 'Dată achizitie'
	},
	'Info:Garage': {
		EN: 'Garage',
		RO: 'Garaj'
	},
	'Info:GarageSlots': {
		EN: ({ slots }) => `Yes - ${slots} parkings`,
		RO: ({ slots }) => `Da - ${slots} parcări`
	},
	'Info:NoGarageSlots': {
		EN: 'No garage',
		RO: 'Fără garaj'
	},
	'Info:HouseSize': {
		EN: 'House size',
		RO: 'Mărime casă'
	},
	'Info:HouseInterior': {
		EN: 'Interior',
		RO: 'Interior'
	},
	'Info:Door': {
		EN: 'Door',
		RO: 'Ușa'
	},
	'Info:DoorLocked': {
		EN: ({ bool }) => `${bool ? `Locked` : `Unlocked`}`,
		RO: ({ bool }) => `${bool ? `Închisă` : `Deschisă`}`
	},
	'Info:HouseSizeValue': {
		EN: ({ size }) => {
			const sizeText = size === 1 ? 'Small' : size === 2 ? 'Medium' : 'Large';
			return sizeText;
		},
		RO: ({ size }) => {
			const sizeText = size === 1 ? 'Mică' : size === 2 ? 'Medie' : 'Mare';
			return sizeText;
		}
	}
};

export default Language;
