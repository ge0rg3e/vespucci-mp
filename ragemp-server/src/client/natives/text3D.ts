import * as rpc from 'rage-rpc';

let client3DTexts: Texts3D[] = [];

rpc.on('text3D:create', (args) => {
	const { identifier, text, font, position, dimension, drawDistance } = JSON.parse(args);

	// Create entity
	const entity = mp.labels.new(text, position, {
		los: true,
		font,
		drawDistance,
		color: [255, 255, 255, 255],
		dimension
	});

	// Add it to array
	client3DTexts.push({
		identifier: identifier,
		msg: text,
		position,
		entity
	});
});

rpc.on('text3D:delete', (args) => {
	const { identifier } = JSON.parse(args);
	const entityFound = client3DTexts.find((match) => match.identifier === identifier);
	if (!entityFound) return false;
	entityFound.entity!.destroy();
	client3DTexts = client3DTexts.filter((elem) => elem.identifier !== identifier);
	return true;
});

interface Texts3D {
	identifier: string;
	msg: string;
	position: Vector3;
	dimension?: number;
	entity?: EntityMp;
}
