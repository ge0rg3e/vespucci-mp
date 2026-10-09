/**
 * This function will randomly generate two numbers for the dice.
 */
export const getRandomDiceNumbers = (): [number, number] => {
	const dice1 = Math.floor(Math.random() * 6) + 1;
	const dice2 = Math.floor(Math.random() * 6) + 1;

	return [dice1, dice2];
};

/**
 * This decides who is the winner.
 * @param recipientRolls - The rolls of the player that got invited
 * @param inviterRolls - The rolls of the player that invited.
 * @returns 0 - Draw, 1 - Recipient wins, 2 - Inviter wins.
 */

export const calculateDiceWinner = (recipientRolls: [number, number], inviterRolls: [number, number]) => {
	// If roll 1 wins
	if (recipientRolls[0] + recipientRolls[1] > inviterRolls[0] + inviterRolls[1]) return 'recipient'; // 1 means recipient wins.

	// If roll 2 wins
	if (inviterRolls[0] + inviterRolls[1] > recipientRolls[0] + recipientRolls[1]) return 'inviter'; // 1 means inviter wins.

	// Default is 0 meaning is draw.
	return 'draw';
};
