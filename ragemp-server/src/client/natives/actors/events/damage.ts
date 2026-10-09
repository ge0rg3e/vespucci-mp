mp.events.add('outgoingDamage', (sourceEntity: PlayerMp, targetEntity: PedMp) => {
	if (sourceEntity !== mp.players.local) return false; // Not local player doing the damage.
	if (targetEntity.type !== 'ped') return false; // is not a ped.

	// Is actor? (legacy npcs are client-sided only.)
	if (!targetEntity.remoteId) return false;

	// We don't give damage to peds when they don't have controllers to avoid issues (desync)
	if (!targetEntity.controller) return true;

	// If not is fine to give them damage.
	return false;
});
