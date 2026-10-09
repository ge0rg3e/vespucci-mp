// Player helpers
mp.Player.prototype.createMarker = function (params) {
	// Extract these..
	const { identifier, type, position, scale, direction = new mp.Vector3(0, 0, 0), rotation = new mp.Vector3(0, 0, 0), color = [255, 255, 255, 255], dimension = 0 } = params;

	// Call client-side..
	this.triggerClientEvent('markers:create', { identifier, type, position, scale, direction, rotation, color, dimension });
};

mp.Player.prototype.deleteMarker = function deleteSelf3DText(identifier: string) {
	this.triggerClientEvent('markers:delete', { identifier });
};
