import { getRaycastLookingAtEntity } from '@client/natives/raycast';
import * as rpc from 'rage-rpc';

rpc.register('getVehicleLookingAt', () => {
	const result = getRaycastLookingAtEntity({ distance: 5, flags: { vehicles: true } });

	if (!result || typeof result.entity === 'number' || result.entity.type !== 'vehicle') return false;

	return result.entity.remoteId;
});
