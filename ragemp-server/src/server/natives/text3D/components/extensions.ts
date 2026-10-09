// Player helpers

mp.Player.prototype.create3DTextLabel = function createSelf3DText(params) {
	const { identifier, text, position, font = 4, dimension = 0, drawDistance = 5 } = params;
	this.triggerClientEvent('text3D:create', { identifier, font, text, position, dimension, drawDistance });
};

mp.Player.prototype.delete3DTextLabel = function deleteSelf3DText(identifier) {
	this.triggerClientEvent('text3D:delete', { identifier });
};
