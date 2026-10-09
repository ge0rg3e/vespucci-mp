mp.events.add('onPlayerEnterColshape', function (_, { identifier, payload }) {
	if (!identifier.includes('pickup:')) return;
	const pickup = mp.pickups.get(payload!.id);
	if (!pickup) return;
	mp.events.call('onPickupEntered', pickup.id);
	return;
});

mp.events.add('onPlayerExitColshape', function (_, { identifier, payload }) {
	if (!identifier.includes('pickup:')) return;
	const pickup = mp.pickups.get(payload!.id);
	if (!pickup) return;
	mp.events.call('onPickupExited', pickup.id);
	return;
});
