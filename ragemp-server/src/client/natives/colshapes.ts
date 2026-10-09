import { logClientsideError } from '@client/general/errors';
import * as rpc from 'rage-rpc';

let entries: ExpectedAny[] = [];
export let activeColshapes: ExpectedAny = [];

rpc.on('colshapes:create', (args) => {
	try {
		// Extract these
		const { identifier, position, range, dimension = 0, payload = {}, type = 'circle' } = JSON.parse(args);

		// Create the entity
		let entity = null;

		if (type === 'sphere') {
			entity = mp.colshapes.newSphere(position.x, position.y, position.z, range, dimension);
		}

		if (type === 'circle') {
			entity = mp.colshapes.newCircle(position.x, position.y, range, dimension);
		}

		// Safety..
		if (entity === null) throw new Error(`Failed to create player colshape!`);

		// Add to entries..
		entries.push({
			identifier,
			position,
			range,
			dimension,
			entity,
			payload
		});
	} catch (err) {
		logClientsideError(`colshapes:create`, err, { args });
	}
});

rpc.on('colshapes:delete', (args) => {
	const { identifier } = JSON.parse(args);

	// Fidn the entity..
	const index = entries.findIndex((match) => match.identifier === identifier);
	if (index === -1) return false;

	// Destroy it
	entries[index].entity!.destroy();

	// Delete it from index
	entries.splice(index, 1);

	return true;
});

rpc.register(`colshapes:getData`, (args) => {
	const { id } = JSON.parse(args);

	// Get nay match..
	let match = entries.find((c) => c.identifier === id);

	return match || null;
});

// When they enter a colshape created for the player we will trigger this now.
mp.events.add('playerEnterColshape', (entity: ExpectedAny) => {
	// Get the colshape
	const match = entries.find((c) => c.entity === entity);
	if (!match) return false;

	// Formatting the return object
	const obj = {
		identifier: match.identifier,
		payload: match.payload,
		origin: `client`
	};

	// Call the server now to convert this data to a normal event.
	mp.events.callRemote(`onPlayerEnterColshape_Init`, JSON.stringify(obj));

	// Call also the client-side (we're fine with the data being transfered client to client)
	mp.events.call(`onPlayerEnterColshape`, obj);

	// Save..
	activeColshapes.push({
		...obj,
		position: match.position
	});
	return true;
});

// When they exits a colshape created for the player we will trigger this now.
mp.events.add('playerExitColshape', (entity: ExpectedAny) => {
	// Get the colshape
	const match = entries.find((c) => c.entity === entity);
	if (!match) return false;

	// Formatting the return object
	const obj = {
		identifier: match.identifier,
		payload: match.payload
	};

	// Call the server now..
	mp.events.callRemote(`onPlayerExitColshape_Init`, JSON.stringify(obj));

	// Call also the client-side (we're fine with the data being transfered client to client)
	mp.events.call(`onPlayerExitColshape`, obj);

	// No colshape now!
	activeColshapes = activeColshapes.filter((c: ExpectedAny) => c.identifier !== obj.identifier);
	return true;
});
