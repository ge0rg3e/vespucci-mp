mp.Player.prototype.toast = function toast(params) {
	this.triggerBrowserEvent(`toasts:create`, params);
};

mp.Player.prototype.clearToasts = function clearToasts() {
	this.triggerBrowserEvent(`toasts:clear`);
};
