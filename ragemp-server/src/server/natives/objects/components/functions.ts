import { ServerObject, createParams } from './types';

export let serverObjects: ServerObject[] = [];

export const createObject = async (params: createParams) => {
	const { identifier, model, position, rotation, alpha = 255, dimension = 0, vars = {} } = params;

	if (serverObjects.find((m) => m.identifier === identifier)) return null;

	const entity = mp.objects.new(model, position, {
		rotation: rotation,
		alpha: alpha,
		dimension: dimension
	});

	if (vars) {
		Object.keys(vars).forEach((key: string) => entity.setVariable(key, vars[key]));
	}

	serverObjects.push({
		identifier: identifier,
		model,
		position,
		rotation,
		alpha,
		dimension,
		entity,
		vars
	});

	return entity;
};

export const deleteObject = async (identifier: string) => {
	const entityFound = serverObjects.find((match) => match.identifier === identifier);

	if (!entityFound) return false;

	entityFound.entity!.destroy();

	serverObjects = serverObjects.filter((elem) => elem.identifier !== identifier);

	return true;
};
