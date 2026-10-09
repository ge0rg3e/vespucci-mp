mp.Player.prototype.createCheckpoint = function createSelfCheckpoint(params) {
	const { identifier, type, position, radius, direction, color, visible = true, dimension = 0, setAsRoute = false } = params;
	this.triggerClientEvent('createCheckpoint', { identifier, type, position, radius, direction, color, visible, dimension, setAsRoute });
};

mp.Player.prototype.deleteCheckpoint = function deleteSelfCheckpoint(identifier) {
	this.triggerClientEvent('deleteCheckpoint', { identifier });
};
