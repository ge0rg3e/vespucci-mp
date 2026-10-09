import { isPlayerInNonDamageArea } from './disableDamage';

// Variables
let outgoingDamageTo: ExpectedAny = [];
let incomingDamageFrom: ExpectedAny = [];

// Damage log
mp.events.add('incomingDamage', function (_, sourcePlayer, targetEntity) {
	if (sourcePlayer.type !== 'player') return false; // Damage not received from a player
	if (targetEntity !== mp.players.local) return false; // Damage not done to local player
	if (isPlayerInNonDamageArea(mp.players.local.remoteId)) return false; // We are in safezone

	// Damage log
	const damageLoggedIndex = incomingDamageFrom.findIndex((c: ExpectedAny) => c.remoteId === sourcePlayer.remoteId);
	if (damageLoggedIndex === -1) {
		incomingDamageFrom.push({
			remoteId: sourcePlayer.remoteId,
			expiresAt: new Date(Date.now() + 1 * 60 * 1000) // Current date + 1 minute
		});
	} else {
		incomingDamageFrom[damageLoggedIndex].expiresAt = new Date(Date.now() + 15 * 1000); // Current date + 15 seconds
	}

	return false;
});

mp.events.add('outgoingDamage', (sourceEntity, targetEntity) => {
	if (sourceEntity !== mp.players.local) return false; //Damage not done to local player
	if (targetEntity.type !== 'player') return false; // You're not attacking a player

	if (isPlayerInNonDamageArea(targetEntity.remoteId)) return false; // We are in safezone

	const damageLoggedIndex = outgoingDamageTo.findIndex((c: ExpectedAny) => c.remoteId === targetEntity.remoteId);
	if (damageLoggedIndex === -1) {
		outgoingDamageTo.push({
			remoteId: targetEntity.remoteId,
			expiresAt: new Date(Date.now() + 1 * 60 * 1000) // Current date + 1 minute
		});
	} else {
		outgoingDamageTo[damageLoggedIndex].expiresAt = new Date(Date.now() + 15 * 1000); // Current date + 15 seconds
	}

	return false;
});

const clearingTask = () => {
	const currentDate = new Date();

	// Remove elements with expiresAt in the past from incomingDamageFrom
	incomingDamageFrom = incomingDamageFrom.filter((element: ExpectedAny) => element.expiresAt > currentDate);

	// Remove elements with expiresAt in the past from outgoingDamageTo
	outgoingDamageTo = outgoingDamageTo.filter((element: ExpectedAny) => element.expiresAt > currentDate);
};

export const isAttackedByPlayer = (remoteId: number) => (incomingDamageFrom.find((c: ExpectedAny) => c.remoteId === remoteId) ? true : false);
export const isAttackingPlayer = (remoteId: number) => (outgoingDamageTo.find((c: ExpectedAny) => c.remoteId === remoteId) ? true : false);

// Function to clear them..
setInterval(clearingTask, 1000);
