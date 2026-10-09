import { createLanguagePack } from '@vmp/i18n';

createLanguagePack('BusinessGeneralStore:MainDialog', {
	DialogTitle: {
		EN: `Clerk - General Store`,
		RO: `Vânzător - Magazin general`
	},
	DialogContent: {
		EN: () => `Need anything specific? Our store has it all - just ask!`,
		RO: () => `Cautati ceva anume? Magazinul nostru are tot ce va trebuie - cereti-ne!`
	},
	DialogFooter: {
		EN: ({ id }) => `The ID of this business is ${id}`,
		RO: ({ id }) => `ID-ul acestui business este ${id}`
	},
	Use: {
		EN: 'Access Store',
		RO: 'Deschide Magazin'
	}
});

createLanguagePack('BusinessGeneralStore:BasketValidation', {
	NotEnoughSpace: {
		EN: "You don't have enough space in your inventory.",
		RO: 'Nu ai destul spatiu in inventar.'
	},
	NotEnoughMoney: {
		EN: "You don't have enough money.",
		RO: 'Nu ai destui bani.'
	},
	'Phone:AlreadyHasOne': {
		EN: "You already own a phone. You can't own more than one.",
		RO: 'Ai deja un telefon. Nu poti detine mai mult de un telefon.'
	},
	'Phone:BuyMoreThanOne': {
		EN: "You can't buy more than one phone.",
		RO: 'Nu poti cumpara mai mult de un telefon odata.'
	},
	'PhoneCredit:NoPhone': {
		EN: `You don't have a phone.`,
		RO: 'Nu ai un telefon.'
	},
	'PhoneCredit:BuyMoreThanOne': {
		EN: `You can't buy more than one.`,
		RO: 'Nu poți cumpăra mai mult de unul.'
	},
	'AlreadyOwn:Dices': {
		EN: 'You already own dice. You cannot buy more.',
		RO: 'Deja deții zaruri. Nu poți cumpăra altele.'
	},
	'MoreThanOne:Dices': {
		EN: 'You cannot buy more than one dice.',
		RO: 'Nu poți cumpăra mai mult de o pereche de zaruri.'
	}
});

createLanguagePack(`BusinessGeneralStore:PurchaseBasket`, {
	'Toast:CompletedPurchase': {
		EN: `Purchase complete. Your items are now in your inventory.`,
		RO: `Achizitie completă. Itemele sunt au fost puse în inventar.`
	},
	'Alert:DicesBought': {
		EN: 'You have bought dices. Use /dice to play with players.',
		RO: 'Ai cumparat zaruri. Folosește /dice sa te joci cu alte persoane.'
	}
});
