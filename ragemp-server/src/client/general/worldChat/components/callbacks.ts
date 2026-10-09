import * as rpc from 'rage-rpc';

// Dependencies
import { localVoiceRangeDistances } from './definitions';
import { isDistanceTooFar } from './functions';

rpc.register('getWorldChatRangeDefintions', () => localVoiceRangeDistances);

rpc.register(`worldChat:isDistanceTooFar`, (args) => {
	const { type, fromLocation, toLocation } = JSON.parse(args);
	return isDistanceTooFar(type, fromLocation, toLocation);
});
