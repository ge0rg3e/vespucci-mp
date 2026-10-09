import { Texts3D, createParams } from './types';

export let server3DTexts: Texts3D[] = [];

export const create3DTextLabel = async (params: createParams) => {
	const { identifier, text, position, dimension = 0, drawDistance = 5, font = 4 } = params;

	// Already created
	const alreadySyncedText = server3DTexts.filter((elem) => elem.identifier === identifier);
	if (alreadySyncedText.length > 0) return false;

	// Create entity
	const entity = mp.labels.new(text, position, {
		los: true,
		font,
		drawDistance: drawDistance !== undefined ? drawDistance : 5,
		color: [255, 255, 255, 255],
		dimension: dimension !== undefined ? dimension : 0
	});

	// Add it to array
	server3DTexts.push({
		identifier: identifier,
		msg: text,
		position,
		entity
	});
	return true;
};

export const delete3DTextLabel = async (identifier: string) => {
	const entityFound = server3DTexts.find((match) => match.identifier === identifier);
	if (!entityFound) return false;
	entityFound.entity!.destroy();
	server3DTexts = server3DTexts.filter((elem) => elem.identifier !== identifier);
	return true;
};
