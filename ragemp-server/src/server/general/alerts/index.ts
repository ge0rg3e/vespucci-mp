mp.Player.prototype.alert = function toast(params) {
	this.triggerBrowserEvent(`alerts:create`, params);
};

mp.Player.prototype.clearAlerts = function clearToasts() {
	this.triggerBrowserEvent(`alerts:clear`);
};

mp.Player.prototype.clearAlertsFromSystem = function (id) {
	this.triggerBrowserEvent(`alerts:clearAlertsFromSystem`, { id });
};
