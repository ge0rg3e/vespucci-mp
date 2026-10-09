import { createLanguagePack } from '@vmp/i18n';

createLanguagePack('houseStorages', {
	UseStorageCloset: {
		EN: 'Use special inventory',
		RO: 'Foloseste inventar special'
	},
	Cancel: {
		EN: 'Cancel',
		RO: 'Anulează'
	},
	FriskStorageInventories: {
		EN: 'Frisk inventories',
		RO: 'Inspectează inventarele'
	},
	StorageClosetTitle: {
		EN: 'House Inventory',
		RO: 'Inventar casă'
	},
	StorageClosetDescription: {
		EN: 'You can use this as a special storage for your items',
		RO: 'Aici poți să îți depozitezi itemele din inventar'
	},
	HouseUpgradeLevelIsTooSmall: {
		EN: ({ val }) => `The house upgrade level must be at least ${val} to to use this.`,
		RO: ({ val }) => `Nivelul de upgrade al casei trebuie sa fie minim ${val} pentru a-l folosii.`
	},
	SelectInventory: {
		EN: `Select an inventory to check`,
		RO: `Selectează un inventar pentru verificare`
	},
	NumberItems: {
		EN: `Amount of items`,
		RO: `Numarul de iteme`
	},
	NoInventories: {
		EN: `This house has no inventories available to check`,
		RO: `Această casă nu are inventare valabile pentru verificare`
	},
	InventoryList: {
		EN: `List of house inventories`,
		RO: `Lista de inventare pentru casă`
	}
});
