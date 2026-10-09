import { formatNumber } from '@server/utils/helpers';
import { createLanguagePack } from '@vmp/i18n';

createLanguagePack('dice:chatReaction.acceptDice', {
	tooFar: {
		EN: () => `You are too far from the player.`,
		RO: () => `Esti prea departe de celălalt jucător.`
	},
	playerIsOffline: {
		EN: `The other player is offline.`,
		RO: `Celălalt jucator nu mai este online.`
	},
	youDontHaveEnoughMoney: {
		EN: () => `You don't have that much money.`,
		RO: () => `Nu ai suma asta de bani.`
	},
	heDoesntHaveEnoughMoney: {
		EN: () => `He don't have that much money.`,
		RO: () => `Celălalt jucator nu are suma asta de bani.`
	},
	tooLateToAccept: {
		EN: 'The offer is either expired or already accepted.',
		RO: 'Oferta este expirată sau a fost deja acceptată.'
	},
	reactionOfferAccepted: {
		EN: `You accepted`,
		RO: `Ai acceptat`
	},
	alreadyPlaying: {
		EN: `You or the other player is already playing a dice game.`,
		RO: `Tu sau celălalt jucatăr deja joacă un joc de zaruri.`
	},
	MissingTheItem: {
		EN: 'Both players need dice to play this game. You can buy them at the General Store.',
		RO: 'Ambii jucători trebuie să aibă zaruri pentru a juca acest joc. Puteți să le cumpărați de la Magazinul General.'
	},
	'diceResult:Draw': {
		EN: ({ sender, recipient, senderRolls, recipientRolls }) => `${sender} rolls ${senderRolls[0]} ${senderRolls[1]}. ${recipient} rolls ${recipientRolls[0]} ${recipientRolls[1]}. Nobody won.`,
		RO: ({ sender, recipient, senderRolls, recipientRolls }) =>
			`${sender} aruncă zarurile ${senderRolls[0]} și ${senderRolls[1]}. ${recipient} aruncă zarurile ${recipientRolls[0]} și ${recipientRolls[1]}. Nimeni nu a câștigat.`
	},
	'diceResult:Won': {
		EN: ({ sender, recipient, senderRolls, recipientRolls, winner }) =>
			`${sender} rolls ${senderRolls[0]} ${senderRolls[1]}. ${recipient} rolls ${recipientRolls[0]} ${recipientRolls[1]}. ${winner} won.`,
		RO: ({ sender, recipient, senderRolls, recipientRolls, winner }) =>
			`${sender} aruncă zarurile ${senderRolls[0]} și ${senderRolls[1]}. ${recipient} aruncă zarurile ${recipientRolls[0]} și ${recipientRolls[1]}. ${winner} a câștigat.`
	},
	'diceAlert:YouWon': {
		EN: ({ amount }) => `You won ${formatNumber(amount, true)} at the Dice Game.`,
		RO: ({ amount }) => `Ai câștigat ${formatNumber(amount, true)} la barbut.`
	},
	'diceAlert:YouLost': {
		EN: ({ amount }) => `You lost ${formatNumber(amount, true)} at the Dice Game.`,
		RO: ({ amount }) => `Ai pierdut ${formatNumber(amount, true)} la barbut.`
	}
});

createLanguagePack('dice:chatReaction.cancelOffer', {
	reactionTextYouCancelled: {
		EN: 'You cancelled the offer',
		RO: 'Ai anulat oferta'
	},
	reactionTextCancelled: {
		EN: 'Offer cancelled',
		RO: 'Ofertă anulata'
	},
	tooLateToCancel: {
		EN: 'The offer is either expired or already accepted.',
		RO: 'Oferta este expirată sau a fost deja acceptată.'
	}
});

createLanguagePack(`itemProperties:11`, {
	usageLabel: {
		EN: 'Usage',
		RO: 'Usage'
	},
	usageValue: {
		EN: `Use command /dice`,
		RO: `Folosește comanda /dice`
	},
	wins: {
		EN: 'Wins',
		RO: 'Câștigate'
	},
	notUsed: {
		EN: 'This dice has never been used.',
		RO: 'Acest zar nu a fost folosit niciodată.'
	}
});
