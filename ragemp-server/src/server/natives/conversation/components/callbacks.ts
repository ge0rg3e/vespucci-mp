import * as rpc from 'rage-rpc';

rpc.on('conversation@closed', (_, { player }: rpc.ProcedureInfo) => {
	if (!player) return false;

	// Updating player variables to set the conversation ID to null
	player.updateVars({
		conversationId: null
	});

	return true;
});
