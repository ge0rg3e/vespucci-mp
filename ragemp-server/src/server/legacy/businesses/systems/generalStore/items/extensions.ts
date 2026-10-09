mp.Player.prototype.isDrinking = function () {
	return this.vars.isDrinking;
};

mp.Player.prototype.isEating = function () {
	return this.vars.isEating;
};

mp.Player.prototype.isSmoking = function () {
	return this.vars.isSmoking;
};

mp.Player.prototype.getConsumableHold = function () {
	return this.vars.holdConsumable.id !== null ? this.vars.holdConsumable : null;
};

mp.Player.prototype.isHoldingConsumable = function () {
	return this.vars.holdConsumable.id !== null ? true : false;
};

mp.Player.prototype.isAvailableToConsume = function () {
	return this.vars.gasStationPump.gasStationId === null && this.vars.petrolCan.status === null;
};

declare global {
	interface PlayerMp {
		isDrinking(): boolean;
		isEating(): boolean;
		isSmoking(): boolean;
		isHoldingConsumable(): boolean;
		getConsumableHold(): PlayerVariables['holdConsumable'] | null;
		isAvailableToConsume(): boolean;
	}
}

export {};
