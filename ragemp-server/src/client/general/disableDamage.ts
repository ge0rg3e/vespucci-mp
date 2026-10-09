import { getPlayerVariable } from '@client/utils/helpers';

export const isPlayerInNonDamageArea = (remoteId: number) => {
	// Get variables
	const isInSafezone = getPlayerVariable(remoteId, `isInSafezone`);
	const garageEntered = getPlayerVariable(remoteId, `garageEntered`);

	// If we're in safezone we don't take damage.
	if (isInSafezone || garageEntered) return true; // canceling damage
	return false;
};

mp.events.add('incomingDamage', function (_, __, targetEntity) {
	if (targetEntity !== mp.players.local) return false; // This damage has not been done to us.
	if (isPlayerInNonDamageArea(mp.players.local.remoteId)) return true; // we don't take damage

	return false; // is ok to take damage
});

mp.events.add('outgoingDamage', (sourceEntity, targetEntity) => {
	if (sourceEntity !== mp.players.local) return false; // Damage not done by you.
	if (isPlayerInNonDamageArea(targetEntity.remoteId)) return true; // no damage

	// Is ok to get daamge
	return false;
});
