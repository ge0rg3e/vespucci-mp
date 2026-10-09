mp.Player.prototype.showProgressBar = function (label, seconds) {
	this.triggerClientEvent(`showProgressBar`, { label, seconds });
};

mp.Player.prototype.hideProgressBar = function () {
	this.triggerClientEvent(`hideProgressBar`);
};

declare global {
	interface PlayerMp {
		showProgressBar(label: string, seconds: number): void;
		hideProgressBar(): void;
	}
}

export {};
