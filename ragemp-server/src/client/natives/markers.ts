import * as rpc from 'rage-rpc';

// Variables
let markers: ExpectedAny[] = [];
const player = mp.players.local;

rpc.on('markers:create', (args) => {
	const { identifier, type, position, scale = 1, direction, rotation, color, dimension } = JSON.parse(args);

	// Already exists..
	if (markers.find((m) => m.identifier === identifier)) {
		return false;
	}

	markers.push({
		identifier: identifier,
		type,
		direction,
		rotation,
		position,
		color: color !== undefined ? color : [255, 255, 255, 255],
		scale,
		dimension
	});

	return true;
});

rpc.on('markers:delete', (args) => {
	const { identifier } = JSON.parse(args);

	const index = markers.findIndex((match) => match.identifier === identifier);

	if (index === -1) return false;

	// Delete..
	markers.splice(index, 1);

	return true;
});

/**
 *
 * @param params The required params to create
 * This will create the draw marker in the gta 5. Is a helper cause the original function is too hard to read.
 */

export const drawMarker = (params: drawParams) => {
	const { type, position, direction, rotation, scale, color, goUpAndDown = false, faceCamera = true } = params;

	// Draw marker.
	mp.game.graphics.drawMarker(
		type,
		// Position..
		position.x,
		position.y,
		position.z,
		// Direction
		direction.x,
		direction.y,
		direction.z,
		// Rotation
		rotation.x,
		rotation.y,
		rotation.z,
		// Scale
		scale,
		scale,
		scale,
		// Color?
		color[0],
		color[1],
		color[2],
		color[3],
		// Others..
		goUpAndDown, // go up and down
		faceCamera, // face camera
		2,
		false,
		null,
		null,
		false
	);
};

mp.events.add('render', () => {
	// @Bugfix: This is the equivalent of what that createMarker does. The only difference is that we're drawing the markers only when is nearby.
	// WE need this cause we have places with too many houses. And those areas cannot have more markers.

	markers.forEach((marker) => {
		// Marker too far away.
		const distance = mp.game.gameplay.getDistanceBetweenCoords(player.position.x, player.position.y, player.position.z, marker.position.x, marker.position.y, marker.position.z, true);
		if (distance > 50) return;

		// Not the same dimension
		if (player.dimension !== marker.dimension) return;

		// Draw marker.

		drawMarker({
			type: marker.type,
			position: marker.position,
			direction: marker.direction,
			rotation: marker.rotation,
			scale: marker.scale,
			color: marker.color
		});
	});
});

type drawParams = {
	type: number;
	position: Vector3;
	direction: Vector3;
	rotation: Vector3;
	scale: number;
	color: Array<number>;
	goUpAndDown?: boolean;
	faceCamera?: boolean;
};
