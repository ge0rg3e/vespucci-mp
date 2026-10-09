import { type LanguagePack } from '@vmp/i18n';

const Language: LanguagePack = {
	House: {
		EN: `House`,
		RO: `Locuință`
	},
	Business: {
		EN: `Business`,
		RO: `Afacere`
	},
	YouDontOwn: {
		EN: ({ type }) => `You don't own a ${type === 'house' ? 'house' : 'business'}`,
		RO: ({ type }) => `Nu ai ${type === 'house' ? `casă` : `un business`}.`
	},
	YouOwn: {
		EN: ({ type, id }) => `Owner of ${type === 'house' ? 'house' : 'business'} ${id}`,
		RO: ({ type, id }) => `Proprietarul ${type === 'house' ? 'casei' : 'afacerii '} ${id}`
	},
	YouRent: {
		EN: ({ id }) => `Tenant of house ${id}`,
		RO: ({ id }) => `Chiriașul casei ${id}`
	}
};

export default Language;
