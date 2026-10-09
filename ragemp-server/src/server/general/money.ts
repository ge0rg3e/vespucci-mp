import { MAX_ECONOMY_VALUE } from './paycheck';
import * as rpc from 'rage-rpc';

mp.Player.prototype.preventMoneyEconomyFailure = function () {
	if (this.info.money >= MAX_ECONOMY_VALUE) {
		this.info.money = MAX_ECONOMY_VALUE;
	}
};

mp.Player.prototype.giveMoney = function (value) {
	this.info.money += value;
	this.preventMoneyEconomyFailure();
	this.updateHudMoney();
	return this.info.money;
};

mp.Player.prototype.takeMoney = function (value) {
	if (this.info.money - value < 0) {
		this.info.money = 0;
	} else {
		this.info.money -= value;
	}
	this.updateHudMoney();
	return this.info.money;
};

mp.Player.prototype.setMoney = function (value) {
	this.info.money = value;
	this.preventMoneyEconomyFailure();
	this.updateHudMoney();
	return this.info.money;
};

mp.Player.prototype.updateHudMoney = function () {
	this.triggerBrowserEvent(`hud:player.setMoney`, {
		value: this.info.money
	});
};

mp.Player.prototype.hasEnoughMoney = function (amount) {
	return this.info.money < amount ? false : true;
};

mp.Player.prototype.getMoney = function () {
	return this.info.money;
};

mp.events.add('onPlayerLogin', (player) => player.updateHudMoney());
mp.events.add('onPlayerRegister', (player) => player.updateHudMoney());

rpc.register('economy:getBalance', async (_, { player }: rpc.ProcedureInfo) => {
	if (!player) return false; // Avoiding TS Error.

	return {
		cash: player.info.money,
		beachCoins: player.info.beachCoins
	};
});

declare global {
	interface PlayerMp {
		giveMoney(value: number): number;
		takeMoney(value: number): number;
		setMoney(value: number): number;
		preventMoneyEconomyFailure(): void;
		updateHudMoney(): void;
		hasEnoughMoney(amount: number): boolean;
		getMoney(): number;
	}
}

export {};
