import * as rpc from 'rage-rpc';

let entries: ExpectedAny[] = [];

rpc.on('objects:create', (args) => {
	const { identifier, model, position, rotation, alpha, dimension, vars } = JSON.parse(args);

	// Already exist
	if (entries.find((m) => m.identifier === identifier)) return false;

	// Create object
	const entity = mp.objects.new(model, position, {
		alpha,
		dimension,
		rotation
	});

	// Add to array
	entries.push({
		identifier: identifier,
		entity,
		vars
	});

	return true;
});

rpc.on('objects:delete', (args) => {
	const { identifier } = JSON.parse(args);

	// Exists?
	const index = entries.findIndex((match) => match.identifier === identifier);
	if (index === -1) return false;

	// Destroy entity..
	entries[index].entity!.destroy();

	// Delete it from array
	entries.splice(index, 1);

	return true;
});
