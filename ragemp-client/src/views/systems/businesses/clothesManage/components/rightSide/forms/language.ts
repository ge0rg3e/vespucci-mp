import { type LanguagePack } from '@vmp/i18n';

const Language: LanguagePack = {
	Name: {
		EN: 'Name',
		RO: 'Nume'
	},
	Category: {
		EN: 'Category',
		RO: 'Categorie'
	},
	NoCategorySelected: {
		EN: 'No category selected',
		RO: 'Nicio categorie selectată'
	},
	Price: {
		EN: 'Price',
		RO: 'Preț'
	},
	BeachCoins: {
		EN: 'Beach Coins'
	},
	MinimumDonorTier: {
		EN: 'Minimum Donor Tier',
		RO: 'Minim Donator Tier'
	},
	None: {
		EN: 'None',
		RO: 'Niciunul'
	},
	AvailableInStore: {
		EN: 'Available in store',
		RO: 'Disponibil în magazin'
	},
	IsAddon: {
		EN: 'Is Clothing Addon',
		RO: 'Este haină addon'
	},
	DlcName: {
		EN: 'DLC Name',
		RO: 'Nume DLC'
	},
	UndershirtCompatible: {
		EN: 'Undershirts Compatible',
		RO: 'Compatibil cu Undershirts'
	},
	TorsoMatch: {
		EN: 'Torso Recommended',
		RO: 'Torso Recomandat'
	},
	CurrentID: {
		EN: 'Current ID',
		RO: 'ID Curent'
	},
	UsingCurrentTorso: {
		EN: 'Using Current Torso',
		RO: 'Folosești Torso Curent'
	},
	UpdateTorso: {
		EN: ({ toggle }) => (!toggle ? 'Show Torsos' : `Hide Torsos`),
		RO: ({ toggle }) => (!toggle ? 'Arata Torsos' : `Ascunde Torsos`)
	},
	Yes: {
		EN: 'Yes',
		RO: 'Da'
	},
	No: {
		EN: 'No',
		RO: 'Nu'
	},
	Previous: {
		EN: 'Previous',
		RO: 'Precedent'
	},
	Next: {
		EN: 'Next',
		RO: 'Urmator'
	},
	DeleteDataHeading: {
		EN: 'Delete Clothing',
		RO: 'Șterge Haină'
	},
	DeleteDataDescription: {
		EN: 'Remove this clothing (all textures) from the database',
		RO: 'Înlătură această haină (toate texturile) din baza de date.'
	},
	DeleteDataButtonText: { EN: 'Delete', RO: 'Șterge' },
	AreYouSureYouWannaDelete: {
		EN: 'Are you sure you wanna do this? This action cannot be reversed.',
		RO: 'Esti sigurcă vrei să faci asta? Această acțiune nu poate fi inverastă.'
	}
};

export default Language;
