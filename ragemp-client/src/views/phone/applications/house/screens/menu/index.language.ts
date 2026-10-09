import { LanguagePack } from '@vmp/i18n';

const Language: LanguagePack = {
	WelcomeHome: {
		EN: 'Welcome home',
		RO: 'Bun venit acasă'
	},
	'Option:Renting': {
		EN: 'Renting',
		RO: 'Închiriere casă'
	},
	'Option:Upgrades': {
		EN: 'Upgrades',
		RO: 'Upgrades'
	},
	'Option:Interiors': {
		EN: 'Change house interior',
		RO: 'Schimbă interior casă'
	},
	'Option:SellToState': {
		EN: 'Sell house to the state',
		RO: 'Vinde casa la stat'
	},
	'SellToState:Title': {
		EN: 'Sell the house to the state',
		RO: 'Vinde casa la stat'
	},
	'SellToState:Description': {
		EN: ({ reward }) =>
			`Are you sure you want to sell the house for only 20% of the price? You will get back only ${reward}`,
		RO: ({ reward }) =>
			`Esti sigur că vrei să vinzi casa pentru 20% din pretul ei? Vei primi inapoi doar ${reward}`
	},
	'SellToState:AcceptOffer': {
		EN: 'Accept offer',
		RO: 'Acceptă ofertă'
	},
	'SellToState:RefuseOffer': {
		EN: 'Refuse offer',
		RO: 'Refuză ofertă'
	}
};

export default Language;
