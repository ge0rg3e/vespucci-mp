import { Marker, createParams } from './types';

export let serverMarkers: Marker[] = [];

// REMINDER BUG: We had a place with > 300 houses, GTA refuses to draw that many markers in an area. So use markers where there aren't to omany.
// Otherwise is advised to use the client-side markers.

export const createMarker = async (params: createParams) => {
	const { identifier, type, position, scale, direction = new mp.Vector3(0, 0, 0), rotation = new mp.Vector3(0, 0, 0), color = [255, 255, 255, 255], dimension = 0 } = params;

	if (serverMarkers.find((m) => m.identifier === identifier)) return false;

	const entity = mp.markers.new(type, position, scale, {
		direction,
		rotation,
		color: color !== undefined ? color : [255, 255, 255, 255],
		visible: true,
		dimension: dimension !== undefined ? dimension : 0
	});

	serverMarkers.push({
		identifier: identifier,
		type,
		direction,
		rotation,
		position,
		entity
	});

	return true;
};

export const deleteMarker = async (identifier: string) => {
	const entityFound = serverMarkers.find((match) => match.identifier === identifier);

	if (!entityFound) return false;

	entityFound.entity!.destroy();

	serverMarkers = serverMarkers.filter((elem) => elem.identifier !== identifier);

	return true;
};
