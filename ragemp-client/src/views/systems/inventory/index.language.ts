import { type LanguagePack } from '@vmp/i18n';

const Language: LanguagePack = {
	// Stores
	Inventory: {
		EN: 'Your inventory',
		RO: 'Inventarul tău'
	},
	PickupHeading: {
		EN: `Items on the ground`,
		RO: `Îteme pe jos`
	},
	// Tooltip
	NonTradable: {
		EN: 'Non-tradable',
		RO: 'Non-negociabil'
	},

	// Context Menu
	ContextUseItem: {
		EN: `Use item`,
		RO: `Foloseste item`
	},
	ContextMenuDestroy: {
		EN: `Destroy item`,
		RO: `Distruge item`
	},
	ContextMenuDrop: {
		EN: `Drop item`,
		RO: `Arunca item`
	},
	NoOptionsAvailable: {
		EN: `No options available`,
		RO: `Fără opțiuni disponibile`
	},
	DropItemHere: {
		EN: `Drop item here to drop it`,
		RO: `Trage item-ul aici pentru a-l arunca`
	},
	FooterSideBox: {
		EN: ({ type }) =>
			type === 0
				? 'Drop your items here to throw them on the ground'
				: 'Use this to store your items in a separate inventory',
		RO: ({ type }) =>
			type === 0
				? 'Aruncă itemele aici pentru a le lăsa pe jos'
				: 'Foloseste acest inventar separat pentru a depozita itemele'
	},
	SwitchTo: {
		EN: ({ type }) => (type === 0 ? 'Switch to dropped items' : 'Switch to separate inventory'),
		RO: ({ type }) => (type === 0 ? 'Schimbă pe iteme aruncate' : 'Schimbă pe inventar separat')
	},
	// Clothes
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
	Type: {
		EN: 'Type',
		RO: 'Tip'
	},
	UndershirtCompatible: {
		EN: 'Undershirt Compatible',
		RO: 'Compatibil cu Undershirt'
	},
	DontWearCloth: {
		EN: "You don't wear any clothing for this",
		RO: `Nu porți de nici articol pentru asta`
	},
	Key: {
		EN: 'Key',
		RO: 'Tasta'
	},
	WeaponSlot: {
		EN: `Weapon slot`,
		RO: `Slot de armă`
	},
	DontHaveWeapon: {
		EN: `This slot is empty`,
		RO: `Acest slot este gol`
	},
	// Tooltip
	TooltipDroppedBy: {
		EN: `Dropped by`,
		RO: `Aruncat de`
	},
	TooltipExpiryDate: {
		RO: `Dată de expirare`,
		EN: `Expiry date`
	},
	InventoryPageLockedHeading: {
		EN: 'This inventory page is locked',
		RO: 'Pagina de inventar trebuie deblocată'
	},
	InventoryPageLockedContent: {
		EN: 'You must unlock this page in-game first before being able to use it',
		RO: 'Trebuie să deblochezi pagina în joc ca să o poți folosii'
	},
	Yes: {
		EN: 'Yes',
		RO: 'Da'
	},
	No: {
		EN: ' No',
		RO: 'Nu'
	},
	ItemsOnTheGround: {
		EN: 'Items on the ground',
		RO: 'Iteme aruncate pe jos'
	},
	Gender: {
		EN: 'Gender',
		RO: 'Sex'
	},
	GenderValue: {
		EN: ({ value }) => (value === 'unisex' ? 'Unisex' : value === 'male' ? 'Male' : 'Female'),
		RO: ({ value }) => (value === 'unisex' ? 'Unisex' : value === 'male' ? 'Masculin' : 'Feminin')
	}
};

export default Language;
