import { createLanguagePack } from '@vmp/i18n';

createLanguagePack('BusinessClothes:OptionsDialog', {
	DialogTitle: {
		EN: `Clothes Store`,
		RO: `Magazin de haine`
	},
	DialogContent: {
		EN: () => `Would you like to see our latest clothes collection?`,
		RO: () => `Dorești să vezi ultima noastră colecție de haine?`
	},
	DialogFooter: {
		EN: ({ id }) => `The ID of this business is ${id}`,
		RO: ({ id }) => `ID-ul acestui business este ${id}`
	},
	Use: {
		EN: 'Buy Clothes',
		RO: 'Cumpără Haine'
	},
	Manage: {
		EN: 'Manage clothing',
		RO: 'Gestionează hainele'
	},
	invalidPlayerModel: {
		EN: 'Your skin must be normal in order to use the clothes store.',
		RO: 'Skin-ul tau trebuie sa fie cel normal pentru a folosii magazinul de haine.'
	}
});

createLanguagePack('BusinessClothes:BuyCallback', {
	NotEnoughMoney: {
		EN: "You don't have enough money.",
		RO: 'Nu ai destui bani.'
	},
	NotEnoughBC: {
		EN: "You don't have enough Beach Coins.",
		RO: 'Nu ai destui Beach Coins.'
	},
	NotforSale: {
		EN: 'This item is not for sale anymore.',
		RO: 'Acest item nu mai este la vânzare.'
	},
	NoSpaceToMoveCurrentClothes: {
		EN: ({ slotsNeeded }) => `You need ${slotsNeeded == 1 ? 'one empty slot' : 'at least two empty slots'} in your inventory.`,
		RO: ({ slotsNeeded }) => `Ai nevoie de ${slotsNeeded == 1 ? 'un slot gol' : 'măcar două slot-uri goale'} în inventar.`
	},
	SuccessBought: {
		EN: 'You bought this clothing successfully.',
		RO: 'Ai cumpărat această haină cu success.'
	}
});

createLanguagePack('Clothes:EquipClothingCallback', {
	NoSpaceToMoveCurrentClothes: {
		EN: ({ slotsNeeded }) => `You need ${slotsNeeded == 1 ? 'one empty slot' : 'at least two empty slots'} in your inventory.`,
		RO: ({ slotsNeeded }) => `Ai nevoie de ${slotsNeeded == 1 ? 'un slot gol' : 'măcar două slot-uri goale'} în inventar.`
	},
	WrongGender: {
		EN: ({ gender }) => `Only ${gender === 'male' ? 'male' : 'female'} characters can wear this clothing.`,
		RO: ({ gender }) => `Doar personale de sex ${gender === 'male' ? 'masculin' : 'feminin'} pot purta această îmbrăcăminte.`
	},
	CannotEquipUndershirtAlone: {
		EN: () => `This undershirt cannot be worn without a shirt.`,
		RO: () => `Acest undershirt nu poate fi purtat fără shirt.`
	},
	UndershirtNotCompatible: {
		EN: () => `Current shirt is not compatible with undershirts.`,
		RO: () => `Shirt purtat nu poate fi purtat cu undershirts. `
	}
});

createLanguagePack('Clothes:ItemTooltip', {
	Gender: {
		EN: 'Gender',
		RO: 'Sex'
	},
	GenderValue: {
		EN: ({ value }) => (value === 'unisex' ? 'Unisex' : value === 'male' ? 'Male' : 'Female'),
		RO: ({ value }) => (value === 'unisex' ? 'Unisex' : value === 'male' ? 'Masculin' : 'Feminin')
	},
	'Clothes:top': {
		EN: 'Top',
		RO: 'Top'
	},
	'Clothes:undershirt': {
		EN: 'Undershirt',
		RO: 'Undershirt'
	},
	'Clothes:pants': {
		EN: 'Pants',
		RO: 'Pantaloni'
	},
	'Clothes:shoes': {
		EN: 'Shoes',
		RO: 'Încălțăminte'
	},
	'Clothes:mask': {
		EN: 'Mask',
		RO: 'Mască'
	},
	'Clothes:hat': {
		EN: 'Hat',
		RO: 'Pălărie'
	},
	'Clothes:glasses': {
		EN: 'Glasses',
		RO: 'Ochelari'
	},
	'Clothes:backpack': {
		EN: 'Backpack',
		RO: 'Rucsac'
	},
	'Clothes:watches': {
		EN: 'Watch',
		RO: 'Ceas'
	},
	'Clothes:earings': {
		EN: 'Earings',
		RO: 'Cercei'
	},
	'Clothes:bracelets': {
		EN: 'Bracelets',
		RO: 'Brățări'
	},
	'Clothes:accessory': {
		EN: 'Accessory',
		RO: 'Accesorii'
	},
	UndershirtCompatible: {
		EN: 'Undershirt Compatible',
		RO: 'Compatibil cu Undershirt'
	}
});
