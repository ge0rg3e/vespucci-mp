import { createLanguagePack } from '@vmp/i18n';

createLanguagePack('BusinessAmmuNation:MainDialog', {
	DialogTitle: {
		EN: `Clerk - Ammu-Nation`,
		RO: `Vânzător - Ammu-Nation`
	},
	DialogContent: {
		EN: () => `Need a specific gun? Our store has it all - just ask!`,
		RO: () => `Cautati o arma anume? Magazinul nostru are tot ce va trebuie - cereti-ne!`
	},
	DialogFooter: {
		EN: ({ id }) => `The ID of this business is ${id}`,
		RO: ({ id }) => `ID-ul acestui business este ${id}`
	},
	Use: {
		EN: 'Access Store',
		RO: 'Deschide Magazin'
	},
	GetLicense: {
		EN: 'Get License',
		RO: 'Obtine licenta'
	}
});

createLanguagePack('BusinessAmmuNation:MainDialog@Responses', {
	YouNeedLicenseToBuy: {
		EN: 'A weapon license is required for purchasing from this store.',
		RO: 'Este necesară o licență pentru arme pentru a cumpăra de la acest magazin.'
	},
	TaskNotification: {
		EN: 'You learned where to get the license and went there.',
		RO: 'Ai aflat unde să obții licența și ai mers acolo.'
	}
});

createLanguagePack('BusinessAmmuNation:BasketValidation', {
	NotEnoughSpace: {
		EN: "You don't have enough space in your inventory.",
		RO: 'Nu ai destul spatiu in inventar.'
	},
	NotEnoughMoney: {
		EN: "You don't have enough money.",
		RO: 'Nu ai destui bani.'
	}
});

createLanguagePack(`BusinessAmmuNation:PurchaseBasket`, {
	'Toast:CompletedPurchase': {
		EN: `Purchase complete. Your items are now in your inventory.`,
		RO: `Achizitie completă. Itemele sunt au fost puse în inventar.`
	}
});
