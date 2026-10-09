mp.events.add('render', () => {
	const frameTime = mp.game.invokeFloat('0x0000000050597EE2');

	mp.objects.streamed.forEach((obj: ExpectedAny) => {
		if (!obj.getVariable('_isPickup')) return;
		const { x, y, z } = obj.getRotation(2);
		obj.setRotation(x, y, z + 90 * frameTime, 2, true);

		const light = obj.getVariable('_light');

		if (light) {
			const pos = obj.position;
			mp.game.graphics.drawLightWithRangeAndShadow(pos.x, pos.y, pos.z, light.r, light.g, light.b, 1.6, 2.4, 15.0);
		}
	});
});

mp.events.add('playerReady', () => {
	mp.objects.forEach((entity: ExpectedAny) => {
		if (!entity.getVariable('_isPickup')) return;

		entity._isPickup = true;
		entity.notifyStreaming = true;
		entity._light = entity.getVariable('_light');
	});
	return;
});

mp.events.add('entityStreamIn', (entity: ExpectedAny) => {
	if (entity.type === 'object' && entity._isPickup) {
		entity.setCollision(false, false);
	}
});

mp.events.addDataHandler('_isPickup', (entity: ExpectedAny, value: ExpectedAny) => {
	if (entity.type !== 'object') return;

	entity._isPickup = value;
	entity.notifyStreaming = value;
	entity._light = entity.getVariable('_light');
});
