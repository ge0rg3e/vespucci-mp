import { type LanguagePack } from '@vmp/i18n';

const Language: LanguagePack = {
	Skin: {
		EN: 'Skin',
		RO: 'Piele'
	},
	Moles: {
		EN: 'Moles',
		RO: 'Alunițe'
	},
	None: {
		EN: 'None',
		RO: 'Fără'
	},
	Variant: {
		EN: ({ value }) => `Variant ${value + 1}`,
		RO: ({ value }) => `Varianta ${value + 1} `
	},
	Blemishes: {
		EN: 'Blemishes',
		RO: 'Pete de Piele'
	},
	Ageing: {
		EN: 'Ageing',
		RO: 'Îmbătrânire'
	},
	Chest: {
		EN: 'Chest',
		RO: 'Piept'
	},
	ChestHair: {
		EN: 'Chest Hair',
		RO: `Păr pe Piept`
	}
};

export default Language;
