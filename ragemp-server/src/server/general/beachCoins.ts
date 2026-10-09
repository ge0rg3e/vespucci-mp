mp.Player.prototype.giveBeachCoins = function (value) {
	this.info.beachCoins += value;
	return this.info.beachCoins;
};

mp.Player.prototype.takeBeachCoins = function (value) {
	if (this.info.beachCoins - value < 0) {
		this.info.beachCoins = 0;
	} else {
		this.info.beachCoins -= value;
	}
	return this.info.beachCoins;
};

mp.Player.prototype.setBeachCoins = function (value) {
	this.info.beachCoins = value;
	return this.info.beachCoins;
};

declare global {
	interface PlayerMp {
		giveBeachCoins(value: number): number;
		takeBeachCoins(value: number): number;
		setBeachCoins(value: number): number;
	}
}

export {};
