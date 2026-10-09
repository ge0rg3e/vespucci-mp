import { createParams } from './types';

export let serverColshapes: Colshape[] = [];

/**
 *
 * @param params The required params to create a colshape server-side
 * This will create a RAGE:MP Colshape server-side which is visible to all players.
 */
export const createColshape = async (params: createParams) => {
	const { identifier, position, range, payload = {}, dimension = 0 } = params;
	// Already exists
	if (serverColshapes.find((m) => m.identifier === identifier)) return false;

	const entity = mp.colshapes.newSphere(position.x, position.y, position.z, range, dimension);

	serverColshapes.push({
		identifier: identifier,
		position,
		range,
		entity: entity,
		payload: payload || {}
	});

	return true;
};

/**
 *
 * @param identifier the id of the object
 * This will delete the object from game and from the array.
 */

export const deleteColshape = async (identifier: string) => {
	const entityFound = serverColshapes.find((match) => match.identifier === identifier);

	if (!entityFound) return false;

	entityFound.entity!.destroy();

	serverColshapes = serverColshapes.filter((elem) => elem.identifier !== identifier);

	return true;
};
