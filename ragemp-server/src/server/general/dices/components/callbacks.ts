import { getOfferByUuid, updateOfferStatus } from '@server/general/offers/components/functions';
import { isInRange, logError } from '@server/utils/helpers';
import * as rpc from 'rage-rpc';
import { calculateDiceWinner, getRandomDiceNumbers } from './functions';
import { getLanguagePack } from '@vmp/i18n';

rpc.on('onChatReaction@dice.acceptDice', async (args, { player }: rpc.ProcedureInfo) => {
	if (!player) return false; // Avoiding TS Error.
	try {
		// Extract passed data..
		const { reactionId, messageId, payload } = JSON.parse(args);

		// Get the language
		const playerLang = getLanguagePack(`dice:chatReaction.acceptDice`, player.lang);

		// Does the offer exist and is not accepted?
		const offer = getOfferByUuid(payload.offerId);
		if (!offer || (offer && offer.status !== 'pending')) return player.alert({ type: 'error', message: playerLang.get(`tooLateToAccept`) });

		// Get the other player that invited you
		const sender = mp.players.atAccountId(payload.senderId);

		// If the other player is offline..
		if (!sender) return player.alert({ type: 'error', message: playerLang.get(`playerIsOffline`) });

		// Already playing with someone
		if (player.vars.playingDice === true || sender.vars.playingDice === true) return player.alert({ type: 'error', message: playerLang.get(`alreadyPlaying`) });

		// You are too far
		if (!isInRange(player.position, sender.position, 5)) return player.alert({ type: 'error', message: playerLang.get(`tooFar`) });

		// If not in same dimension
		if (player.dimension !== sender.dimension) return player.alert({ type: 'error', message: playerLang.get(`tooFar`) });

		// You don't have enough money
		if (!player.hasEnoughMoney(payload.amount)) return player.alert({ type: 'error', message: playerLang.get(`youDontHaveEnoughMoney`) });

		// The sender does not have money
		if (!sender.hasEnoughMoney(payload.amount)) return player.alert({ type: 'error', message: playerLang.get(`heDoesntHaveEnoughMoney`) });

		// One player is missing the dice item.
		const missingItem = player.getInventoryItemMatch({ itemId: 11 }) === null || sender.getInventoryItemMatch({ itemId: 11 }) === null ? true : false;
		if (missingItem) return player.alert({ type: 'error', message: playerLang.get('MissingTheItem') });

		// Update offer status
		updateOfferStatus(offer.uuid, 'accepted');

		// Update the offer on the recipient message chatbox.
		player.updateChatMessageReaction(messageId, reactionId, { label: playerLang.get(`reactionOfferAccepted`), disabled: true });

		// Update states
		player.updateVars({ playingDice: true });
		sender.updateVars({ playingDice: true });

		// Roll the dice and let the magic happen 🎲
		const playerRolls = getRandomDiceNumbers();
		const senderRolls = getRandomDiceNumbers();

		// Get the winner
		const rollingWinner = calculateDiceWinner(playerRolls, senderRolls);

		// If someone won..
		if (rollingWinner !== 'draw') {
			// Get each one..
			const loser = rollingWinner === 'recipient' ? sender : player;
			const winner = rollingWinner === 'recipient' ? player : sender;

			// Recipient gets money. We do this now to make sure there's no chance of disconnect.
			winner.giveMoney(payload.amount);
			loser.takeMoney(payload.amount);

			// Get their lang again...
			const winnerLang = getLanguagePack(`dice:chatReaction.acceptDice`, winner.lang);
			const loserLang = getLanguagePack(`dice:chatReaction.acceptDice`, loser.lang);

			// Show alerts.
			winner.alert({ type: 'success', message: winnerLang.get(`diceAlert:YouWon`, { amount: payload.amount }) });
			loser.alert({ type: 'warning', message: loserLang.get(`diceAlert:YouLost`, { amount: payload.amount }) });

			// Update item meta..
			const winnerItem = winner.getInventoryItemMatch({ itemId: 11 });
			const loserItem = loser.getInventoryItemMatch({ itemId: 11 });

			// If item is found (just to be safe)
			if (winnerItem) {
				winner.updateItem(winnerItem.id, {
					meta: {
						// Load existing meta..
						...winnerItem.meta,
						// Update meta..
						totalGames: winnerItem.meta.totalGames + 1,
						wins: winnerItem.meta.wins + 1
					}
				});
			}

			// If item is found (just to be safe)
			if (loserItem) {
				loser.updateItem(loserItem.id, {
					meta: {
						// Load existing meta..
						...loserItem.meta,
						// Update meta..
						totalGames: loserItem.meta.totalGames + 1
					}
				});
			}
		}

		// Announce roleplay action in chat
		mp.chat.announceRoleplayAction({
			position: player.position,
			systemId: `dice:chatReaction.acceptDice`,
			messageId: rollingWinner === 'draw' ? `diceResult:Draw` : `diceResult:Won`,
			range: 5,
			args: () => ({
				sender: sender.info.username,
				recipient: player.info.username,
				senderRolls: senderRolls,
				recipientRolls: playerRolls,
				winner: rollingWinner === 'draw' ? 'Draw' : rollingWinner === 'recipient' ? player.info.username : sender.info.username
			})
		});

		// Play sound effects.
		player.playSoundEffect(`${'__ASSETS__'}/audios/items/dice/roll.mp3`, { volume: 0.15 });
		sender.playSoundEffect(`${`__ASSETS__`}/audios/items/dice/roll.mp3`, { volume: 0.15 });

		// Play animations
		player.applyAnimation({
			dict: `anim@mp_player_intcelebrationmale@wank`,
			name: `wank`,
			speed: 8.0,
			flags: 49,
			duration: 2400
		});

		sender.applyAnimation({
			dict: `anim@mp_player_intcelebrationmale@wank`,
			name: `wank`,
			speed: 8.0,
			flags: 49,
			duration: 2400
		});

		// Track this..
		player.createAmplitudeEvent(`Dice Game`, {
			invitedBy: sender.info.username,
			winner: rollingWinner === 'draw' ? 'Draw' : rollingWinner === 'recipient' ? player.info.username : sender.info.username,
			amount: payload.amount
		});

		sender.createAmplitudeEvent(`Dice Game`, {
			invited: player.info.username,
			winner: rollingWinner === 'draw' ? 'Draw' : rollingWinner === 'recipient' ? player.info.username : sender.info.username,
			amount: payload.amount
		});

		// Update states
		player.updateVars({ playingDice: false });
		sender.updateVars({ playingDice: false });

		return true;
	} catch (err) {
		await logError('onChatReaction:acceptDice', err, { player: player?.info.username, args });
		return false;
	}
});

rpc.on('onChatReaction@dice.cancelOffer', async (args, { player }: rpc.ProcedureInfo) => {
	if (!player) return false; // Avoiding TS Error.
	try {
		// Extract passed data..
		const { reactionId, messageId, payload } = JSON.parse(args);

		// Get the language
		const playerLang = getLanguagePack(`dice:chatReaction.cancelOffer`, player.lang);

		// Get the offer details to check if is accepted yet.
		const offer = getOfferByUuid(payload.offerId);
		if (!offer) return player.alert({ type: 'error', message: playerLang.get(`tooLateToCancel`) });

		// The game can be cancelled only before the other party responded.
		if (offer.status !== 'pending') return player.alert({ type: 'error', message: playerLang.get(`tooLateToCancel`) });

		// Update offer..
		updateOfferStatus(offer.uuid, 'expired');

		// Disable the chat reaction button pressed.
		player.updateChatMessageReaction(messageId, reactionId, {
			label: playerLang.get(`reactionTextYouCancelled`),
			disabled: true
		});

		// Is the recipient online?
		const target = mp.players.atAccountId(payload.recipientId);
		if (!target) return false;

		// Get the language
		const targetLang = getLanguagePack(`dice:chatReaction.cancelOffer`, target.lang);

		// Update the offer for the recipient too.
		target.updateChatMessageReaction(payload.recipientOfferMessageId, `dice.acceptDice`, {
			label: targetLang.get(`reactionTextCancelled`),
			disabled: true
		});

		return true;
	} catch (err) {
		await logError('onChatReaction:cancelOffer', err, { player: player?.info.username });
		return false;
	}
});
