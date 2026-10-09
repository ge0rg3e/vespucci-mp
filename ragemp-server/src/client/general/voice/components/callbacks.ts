import * as rpc from 'rage-rpc';

rpc.on('onAuthCompleted', () => {
	// Request anim directories
	mp.game.streaming.requestAnimDict('mp_facial');
	mp.game.streaming.requestAnimDict('facials@gen_male@variations@normal');
});
