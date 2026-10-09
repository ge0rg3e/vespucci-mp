import * as rpc from 'rage-rpc';
import { hasCountdown, startCountdown, stopCountdown } from './functions';

rpc.on('countDown@start', async (args: ExpectedAny) => {
	const { identifier, seconds } = JSON.parse(args);

	const { error } = await startCountdown({ identifier, seconds });

	// If there is an error then send it to the server
	if (error) return rpc.triggerServer(`countDown@error:${identifier}`, JSON.stringify({ error }));

	// If there is no error then send the finished event to the server
	rpc.triggerServer(`countDown@finished:${identifier}`);
});

rpc.on('countDown@stop', async (args: ExpectedAny) => {
	const { identifier } = JSON.parse(args);

	stopCountdown({ identifier });
});

rpc.register('countDown@hasCountdown', (args: ExpectedAny) => {
	const { identifier } = JSON.parse(args);

	return hasCountdown({ identifier });
});
