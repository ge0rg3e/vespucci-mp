// Player helpers
mp.Player.prototype.createObject = function (params) {
	// Extract these..
	const { identifier, model, position, rotation, alpha = 255, dimension = 0, vars = {} } = params;

	// Call client-side..
	this.triggerClientEvent('objects:create', { identifier, model, position, rotation, alpha, dimension, vars });
};

mp.Player.prototype.deleteObject = function (identifier: string) {
	this.triggerClientEvent('objects:delete', { identifier });
};
