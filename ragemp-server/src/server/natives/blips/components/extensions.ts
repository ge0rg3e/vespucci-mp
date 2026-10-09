mp.Player.prototype.createBlip = function (params) {
	// Extract variabiles
	const { identifier, type, position, label, color, shortRange = true, dimension = 0, scale = 1 } = params;

	// Create it in-game..
	this.triggerClientEvent('blips:create', { identifier, type, position, label, color, shortRange, dimension, scale });
};

mp.Player.prototype.deleteBlip = function (identifier: string) {
	this.triggerClientEvent('blips:delete', { identifier });
};

mp.Player.prototype.getBlips = function () {
	return this.invokeClientEvent('blips:getAll');
};
