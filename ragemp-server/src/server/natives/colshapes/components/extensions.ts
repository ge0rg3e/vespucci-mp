import { serverColshapes } from './functions';

mp.Player.prototype.getActiveColshapes = async function () {
	let arr = [];

	for (const id of this.vars.activeColshapes) {
		// Is it a server colshape
		const server = serverColshapes.find((c: Colshape) => c.identifier === id);

		// It was a server colshape
		if (server) {
			arr.push({ ...server, type: 'serverside' });
		}

		// is it a client-side one
		const client: ExpectedAny = await this.invokeClientEvent(`colshapes:getData`, { id });

		// It was a client one
		if (client) {
			arr.push({ ...client, type: 'clientside' });
		}
	}

	return arr;
};

mp.Player.prototype.createColshape = function (params) {
	// Extract these
	const { identifier, position, range, dimension = 0, payload = {}, type } = params;

	this.triggerClientEvent('colshapes:create', { identifier, position, range, dimension, payload, type });
};

mp.Player.prototype.deleteColshape = function (identifier: string) {
	this.triggerClientEvent('colshapes:delete', { identifier });
};
