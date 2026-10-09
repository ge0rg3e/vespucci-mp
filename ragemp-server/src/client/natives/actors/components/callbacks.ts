import * as rpc from 'rage-rpc';

rpc.register('actor:isAmbientSpeechPlaying', (args: ExpectedAny) => {
	const { pedId } = JSON.parse(args);

	// Get the ped..
	const ped = mp.peds.atRemoteId(pedId);
	if (!ped) return false;

	// Return if is speaking or not..
	return mp.game.audio.isAmbientSpeechPlaying(ped.handle);
});

rpc.register('actor:isStreamedIn', (args: ExpectedAny) => {
	const { pedId } = JSON.parse(args);

	let isStreamedIn = false;

	// check through all streamed in peds.
	mp.peds.forEachInStreamRange((ped) => {
		if (ped.remoteId !== pedId) return false;
		if (isStreamedIn === true) return false; // ok no longer needed.
		isStreamedIn = true;
		return true;
	});

	return isStreamedIn;
});
