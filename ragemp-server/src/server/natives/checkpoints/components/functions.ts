import { Checkpoints, createParams } from './types';

let serverCheckpoints: Checkpoints[] = [];

export const createCheckpoint = async (params: createParams) => {
	const { identifier, type, position, radius, direction, color, visible = true, dimension = 0 } = params;

	const alreadySyncedCheckpoint = serverCheckpoints.filter((elem) => elem.identifier === identifier);
	if (alreadySyncedCheckpoint.length > 0) return false;

	const entity = mp.checkpoints.new(type, position, radius, {
		direction,
		color,
		visible: visible !== undefined ? visible : true,
		dimension: dimension !== undefined ? dimension : 0
	});

	serverCheckpoints.push({
		identifier: identifier,
		type,
		position,
		radius,
		direction,
		color,
		entity
	});

	return true;
};

export const deleteCheckpoint = async (identifier: string) => {
	const entityFound = serverCheckpoints.find((match) => match.identifier === identifier);
	if (!entityFound) return false;
	entityFound.entity!.destroy();
	serverCheckpoints = serverCheckpoints.filter((elem) => elem.identifier !== identifier);
	return true;
};
