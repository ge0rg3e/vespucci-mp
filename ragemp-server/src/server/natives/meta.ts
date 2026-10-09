import packageJSON from '../../../package.json';

mp.events.add('loadPlayerMeta', async function loadPlayerMeta(player) {
	const metaStored = await player.invokeClientEvent(`getLocalStorage`, { id: `playerMeta` });
	player.meta = metaStored !== undefined ? metaStored : ({} as PlayerMeta);

	if (Object.keys(player.meta).length > 0) {
		player.updateMeta({ serverVersion: packageJSON.version });
	}

	this.cancel = true;
});
