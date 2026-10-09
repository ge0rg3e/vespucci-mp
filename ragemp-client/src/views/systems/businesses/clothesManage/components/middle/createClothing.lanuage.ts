import { type LanguagePack } from '@vmp/i18n';

const Language: LanguagePack = {
	AddNewClothesHeading: {
		EN: 'Create new clothing',
		RO: 'Adaugă haine noi'
	},
	ShowIdsClothesHeading: {
		EN: 'Last Drawable Ids',
		RO: 'Ultimele Drawable Ids'
	},
	ExitButtonText: {
		EN: 'Exit',
		RO: 'Ieși'
	},
	Type: {
		EN: 'Type',
		RO: 'Tip'
	},
	Gender: {
		EN: 'Gender',
		RO: 'Sex'
	},
	DLCName: {
		EN: 'DLC Name',
		RO: 'Nume DLC'
	},
	IsAddon: {
		EN: 'Is Addon',
		RO: 'Este Addon'
	},
	Yes: {
		EN: 'Yes',
		RO: 'Da'
	},
	No: {
		EN: 'No',
		RO: 'Nu'
	},
	Remove: {
		EN: 'Remove',
		RO: 'Șterge'
	},
	AddClothingButtonText: {
		EN: 'Add Clothing',
		RO: 'Adaugă îmbrăcăminte'
	},
	Save: {
		EN: 'Save',
		RO: 'Salvează'
	},
	ShowLastIds: {
		EN: ({ toggle }) => `${toggle ? 'Hide' : 'Show'} last drawable ids`,
		RO: ({ toggle }) => `${toggle ? 'Ascunde' : 'Arată'} ultimele drawable Ids`
	},
	ChangeGender: {
		EN: 'Change Gender',
		RO: 'Schimbă Sex'
	},
	CurrentGender: {
		EN: 'Current gender',
		RO: 'Sex selectat'
	}
};

export default Language;
