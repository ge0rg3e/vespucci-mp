import * as rpc from 'rage-rpc';

let clientCheckpoints: Checkpoints[] = [];

rpc.on('createCheckpoint', (args) => {
	const { identifier, type, position, radius, direction, color, visible, dimension, setAsRoute } = JSON.parse(args);
	const entity = mp.checkpoints.new(type, position, radius, {
		direction,
		color,
		visible: visible !== undefined ? visible : true,
		dimension: dimension !== undefined ? dimension : 0
	});

	// Create blip if setAsRoute is not falsy value
	const blip = setAsRoute
		? mp.blips.new(1, position, {
				name: 'Checkpoint route',
				color: 1,
				shortRange: false,
				dimension: dimension !== undefined ? dimension : 0
		  })
		: undefined;

	// If the above blip is created, set it as route
	if (blip) blip.setRoute(true);

	clientCheckpoints.push({
		identifier,
		type,
		position,
		radius,
		direction,
		color,
		entity,
		blip
	});
});

rpc.on('deleteCheckpoint', (args) => {
	const { identifier } = JSON.parse(args);
	const entityFound = clientCheckpoints.find((match) => match.identifier === identifier);
	if (!entityFound) return false;
	entityFound.entity!.destroy();
	entityFound.blip?.destroy?.();
	clientCheckpoints = clientCheckpoints.filter((elem) => elem.identifier !== identifier);
	return true;
});

mp.events.add('playerEnterCheckpoint', (checkpoint) => {
	// Find the checkpoint
	const checkpointFound = clientCheckpoints.find((match) => match.entity === checkpoint);

	// If the checkpoint is not found, return
	if (!checkpointFound) return;

	// We need to remove the entity from the object (to send it to the server)
	const { entity, ...checkpointWithoutEntity } = checkpointFound;

	// Send to the server..
	mp.events.callRemote('onPlayerEnterCheckpoint_init', JSON.stringify(checkpointWithoutEntity));

	// Also send to the client..
	mp.events.call('onPlayerEnterCheckpoint', checkpointFound);
});

mp.events.add('playerExitCheckpoint', (checkpoint) => {
	// Find the checkpoint
	const checkpointFound = clientCheckpoints.find((match) => match.entity === checkpoint);

	// If the checkpoint is not found, return
	if (!checkpointFound) return;

	// We need to remove the entity from the object (to send it to the server)
	const { entity, ...checkpointWithoutEntity } = checkpointFound;

	// Send to the server..
	mp.events.callRemote('onPlayerExitCheckpoint_init', JSON.stringify(checkpointWithoutEntity));

	// Also send to the client..
	mp.events.call('onPlayerExitCheckpoint', checkpointFound);
});

interface Checkpoints {
	identifier: string;
	type: number;
	position: Vector3;
	radius: number;
	direction: Vector3;
	color: [number, number, number, number];
	visible?: boolean;
	dimension?: number;
	entity?: EntityMp;
	blip?: BlipMp;
}
