import { logClientsideError } from '@client/general/errors';
import { attachmentObjects } from '@client/natives/playerAttachments/components/functions';
import * as rpc from 'rage-rpc';

// Objects

const disableNearbyObjectCollisions = () => {
	try {
		mp.objects.forEachInStreamRange((object) => {
			// Is not streamed in yet.
			if (!object.handle) return;

			// Validate it
			if (!mp.game.entity.isAnEntity(object.handle)) return;

			// Check if is attachment
			const isAttachment = attachmentObjects.find((c) => c.id === object.id);

			// If is client-side only.
			if (object.remoteId === 65535 && !isAttachment) return;

			if (object.getVariable('disableCollision') == true || isAttachment) {
				object.setCollision(false, true);
			}
			return true;
		});
	} catch (err) {
		logClientsideError(`disableNearbyObjectCollisions`, err);
	}
};

rpc.on('disableNearbyObjectCollisions', async () => {
	// Disabling it after 200 miliseconds for certain reasons.
	await mp.game.waitAsync(200);
	disableNearbyObjectCollisions();
});

// Timers required

setInterval(() => {
	disableNearbyObjectCollisions();
}, 1000);
