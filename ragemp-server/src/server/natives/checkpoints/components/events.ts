mp.events.add('onPlayerEnterCheckpoint_init', (player: PlayerMp, checkpoint: string) => {
	const checkpointParsed = JSON.parse(checkpoint);
	mp.events.call('onPlayerEnterCheckpoint', player, checkpointParsed);
});

mp.events.add('onPlayerExitCheckpoint_init', (player: PlayerMp, checkpoint: string) => {
	const checkpointParsed = JSON.parse(checkpoint);
	mp.events.call('onPlayerExitCheckpoint', player, checkpointParsed);
});
