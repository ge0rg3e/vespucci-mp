import { type LanguagePack } from '@vmp/i18n';

const Language: LanguagePack = {
	'normal:title': {
		EN: 'Paint your vehicle a normal color',
		RO: 'Vopseste-ti vehiculul intr-o culoare normala'
	},
	'special:title': {
		EN: ({ type }) => `Paint your vehicle with a ${type} color`,
		RO: ({ type }) => `Vopseste-ti vehiculul cu o culoare ${type}`
	},
	metallic: {
		EN: 'metallic',
		RO: 'metalica'
	},
	matte: {
		EN: 'matte',
		RO: 'mata'
	},
	premium: {
		EN: 'premium'
	},
	itemRequired: {
		EN: 'Item Required',
		RO: 'Item Necesar'
	},
	voucherFor: {
		EN: 'Voucher for',
		RO: 'Voucher pentru'
	},
	cost: {
		EN: 'Cost',
		RO: 'Pret'
	},
	Primary: {
		EN: 'Primary',
		RO: 'Principala'
	},
	Secondary: {
		EN: 'Secondary',
		RO: 'Secundara'
	},
	purchase: {
		EN: 'Purchase',
		RO: 'Cumpara'
	}
};

export default Language;
