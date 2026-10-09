import * as rpc from 'rage-rpc';
import { loadMinimap } from './functions';

rpc.on(`minimap:setOffset`, (args: string) => {
	const { value } = JSON.parse(args);

	const parsedValue = parseFloat(value);

	if (isNaN(parsedValue)) return false;

	loadMinimap(parsedValue);

	mp.console.logInfo(`Minimap reloaded with offset: ${JSON.stringify(parsedValue)}`);
	return false;
});
