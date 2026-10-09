import { createOffer } from '@server/general/offers/components/functions';
import { formatNumber, isInRange } from '@server/utils/helpers';

mp.commands.addCommand({
	name: 'dice',
	defineLangs: {
		targetOfferMessage: {
			EN: ({ amount }) => `You have been invited to play a game of dice for ${formatNumber(amount, true)}.`,
			RO: ({ amount }) => `Ai fost invitat să joci un joc de zaruri pentru miza de ${formatNumber(amount, true)}.`
		},
		senderOfferConfirmation: {
			EN: ({ recipient, amount }) => `You have invited ${recipient} to a dice game for ${formatNumber(amount, true)}.`,
			RO: ({ recipient, amount }) => `Ai invitat pe ${recipient} la un joc de zaruri pentru miza de ${formatNumber(amount, true)}.`
		},
		acceptReactionButton: {
			EN: () => `Accept game offer`,
			RO: () => `Acceptă oferta de joc`
		},
		cancelOfferButton: {
			EN: () => `Cancel game offer`,
			RO: () => `Anulează oferta de joc`
		},
		cannotPlayYourself: {
			EN: () => `You cannot play with yourself.`,
			RO: () => `Nu te poti juca cu tine însuți.`
		},
		tooFar: {
			EN: () => `You are too far from the player.`,
			RO: () => `Esti prea departe de celălalt jucător.`
		},
		notEnoughMoney: {
			EN: () => `You don't have that much money.`,
			RO: () => `Nu ai suma asta de bani.`
		},
		MissingTheItem: {
			EN: 'Both players need dice to play this game. You can buy them at the General Store.',
			RO: 'Ambii jucători trebuie să aibă zaruri pentru a juca acest joc. Puteți să le cumpărați de la Magazinul General.'
		}
	},

	args: {
		target: 'player',
		amount: 'number'
	},
	handler: (player, { target, amount }, lang) => {
		// If they try to play with themselves
		if (player === target) return player.sendErrorMessage(`Server`, 'system', lang(player.lang, `cannotPlayYourself`), 'system');

		// Are the too far?
		if (!isInRange(player.position, target.position, 5)) return player.sendErrorMessage(`Server`, 'system', lang(player.lang, `tooFar`), 'system');

		// He doesn't have the required amount of money.
		if (!player.hasEnoughMoney(amount)) return player.sendErrorMessage(`Server`, 'system', lang(player.lang, `notEnoughMoney`), 'system');

		// One player is missing the dice item.
		const missingItem = player.getInventoryItemMatch({ itemId: 11 }) === null || target.getInventoryItemMatch({ itemId: 11 }) === null ? true : false;
		if (missingItem) return player.sendErrorMessage(`Server`, 'system', lang(player.lang, `MissingTheItem`), 'system');

		// Generate an offer id so we can keep track if we accept or not the invitaiton
		const offerId = createOffer();

		// Send offer to target..
		const messageId = target.sendChatMessage({
			sender: player.info.username,
			type: mp.chat.getMessageType('diceGame', target.lang),
			channel: 'system',
			content: {
				type: 'text',
				data: `{0be881}${lang(target.lang, `targetOfferMessage`, { amount })}`,
				reactions: [
					{
						id: 'dice.acceptDice',
						label: lang(target.lang, `acceptReactionButton`),
						payload: {
							// The offer to keep track of status: accepted, denied etc.
							offerId: offerId,
							// The player recipient id..
							recipientId: target.info.id,
							// The sender
							senderId: player.info.id,
							// Amount of money
							amount
						}
					}
				]
			}
		});

		// Inform us of confirmation
		player.sendChatMessage({
			sender: `Server`,
			type: mp.chat.getMessageType('diceGame', player.lang),
			channel: 'system',
			content: {
				type: 'text',
				data: `{0be881}${lang(player.lang, `senderOfferConfirmation`, { recipient: target.info.username, amount })}`,
				reactions: [
					{
						id: 'dice.cancelOffer',
						label: lang(target.lang, `cancelOfferButton`),
						payload: {
							// The offer to keep track
							offerId: offerId,
							// The player recipient id..
							recipientId: target.info.id,
							// The sender
							senderId: player.info.id,
							// The message id of the offer
							recipientOfferMessageId: messageId
						}
					}
				]
			}
		});

		// Track this..
		player.createAmplitudeEvent(`Invited someone to play Dice`, {
			target: target.info.username,
			amount
		});
		return true;
	}
});
