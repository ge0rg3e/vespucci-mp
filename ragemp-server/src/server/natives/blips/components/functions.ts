import { createParams } from './types';

export let serverBlips: ServerBlips[] = [];

export const createBlip = async (params: createParams) => {
	const { identifier, type, position, dimension = 0, label, color, shortRange = true } = params;

	if (serverBlips.find((m) => m.identifier === identifier)) return false;

	const entity = mp.blips.new(type, position, {
		name: label,
		color,
		shortRange,
		dimension
	});

	serverBlips.push({
		identifier,
		type,
		position,
		label,
		color,
		entity
	});

	return true;
};

export const deleteBlip = async (identifier: string) => {
	const entityFound = serverBlips.find((match) => match.identifier === identifier);

	if (!entityFound) return false;

	entityFound.entity!.destroy();

	serverBlips = serverBlips.filter((elem) => elem.identifier !== identifier);

	return true;
};
