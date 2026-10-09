export const MAX_ECONOMY_VALUE = 999999999;

mp.Player.prototype.givePendingPaycheck = function (value) {
	this.info.pendingPaycheck += value;

	return this.info.pendingPaycheck;
};

mp.Player.prototype.givePaycheck = function (value) {
	this.info.paycheck += value;

	if (this.info.paycheck >= MAX_ECONOMY_VALUE) {
		this.info.paycheck = MAX_ECONOMY_VALUE;
	}
	return this.info.paycheck;
};

mp.Player.prototype.setPendingPaycheck = function (value) {
	this.info.pendingPaycheck = value;

	if (this.info.pendingPaycheck >= MAX_ECONOMY_VALUE) {
		this.info.pendingPaycheck = MAX_ECONOMY_VALUE;
	}

	return this.info.pendingPaycheck;
};

mp.Player.prototype.setPaycheck = function (value) {
	this.info.paycheck = value;

	if (this.info.paycheck >= MAX_ECONOMY_VALUE) {
		this.info.paycheck = MAX_ECONOMY_VALUE;
	}

	return this.info.paycheck;
};

mp.Player.prototype.resetPendingPaycheck = function () {
	this.info.pendingPaycheck = 0;
	return this.info.pendingPaycheck;
};

mp.Player.prototype.resetPaycheck = function () {
	this.info.paycheck = 0;

	return this.info.paycheck;
};

declare global {
	interface PlayerMp {
		givePendingPaycheck(value: number): number;
		givePaycheck(value: number): number;
		setPendingPaycheck(value: number): number;
		setPaycheck(value: number): number;
		resetPendingPaycheck(): void;
		resetPaycheck(): void;
	}
}

export {};
