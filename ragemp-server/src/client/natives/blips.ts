import * as rpc from 'rage-rpc';

let clientBlips: ExpectedAny[] = [];

rpc.on('blips:create', (args) => {
	const { identifier, type, position, label, color, shortRange, dimension = 0, scale = 1 } = JSON.parse(args);

	if (clientBlips.find((b) => b.identifier === identifier)) return false;

	const entity = mp.blips.new(type, position, {
		name: label,
		color,
		shortRange,
		dimension,
		scale
	});

	clientBlips.push({
		identifier,
		position,
		entity
	});

	return true;
});

rpc.on('blips:delete', (args) => {
	const { identifier } = JSON.parse(args);

	const entityFound = clientBlips.find((match) => match.identifier === identifier);

	if (!entityFound) return false;

	entityFound.entity!.destroy();

	clientBlips = clientBlips.filter((elem) => elem.identifier !== identifier);

	return true;
});

rpc.register(`blips:getAll`, () => clientBlips.map((m) => m.identifier));
