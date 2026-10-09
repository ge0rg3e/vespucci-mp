import { type LanguagePack } from '@vmp/i18n';

const Language: LanguagePack = {
	admins: {
		EN: ({ level }) => `Administrator Lv.${level}`
	},
	developers: {
		EN: 'Server Developer'
	},
	helpers: {
		EN: ({ level }) => `Helper Lv.${level}`
	},
	owner: {
		EN: 'Server Owner'
	},
	Civillian: {
		EN: 'Civillian',
		RO: 'Civil'
	}
};

export default Language;
