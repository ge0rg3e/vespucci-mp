mp.Player.prototype.getAlcoholLevel = function () {
	return this.vars.bloodAlcoholLevel;
};

mp.Player.prototype.increaseAlcoholLevel = function (amount) {
	// Take curent amount
	let newAmount = this.vars.bloodAlcoholLevel;

	// Add new amount..
	newAmount += amount;

	// If is over 100.. reset we can't overdrunk ourselves.
	if (newAmount > 100) {
		newAmount = 100;
	}

	// Set value..
	this.updateVars({ bloodAlcoholLevel: newAmount });
};

mp.Player.prototype.reduceAlcoholLevel = function (amount) {
	// Take curent amount
	let newAmount = this.vars.bloodAlcoholLevel;

	// Reduce new amount..
	newAmount -= amount;

	// We can't let it be negative -1
	if (newAmount < 1) {
		newAmount = 0;
	}

	// Set value..
	this.updateVars({ bloodAlcoholLevel: newAmount });
};

mp.Player.prototype.setAlcoholLevel = function (amount) {
	// Safety checks..
	if (amount > 100 || amount < 1) {
		amount = amount > 100 ? 100 : 0;
	}

	// Set value..
	this.updateVars({ bloodAlcoholLevel: amount });
};

declare global {
	interface PlayerMp {
		getAlcoholLevel(): number;
		increaseAlcoholLevel(amount: number): void;
		reduceAlcoholLevel(amount: number): void;
		setAlcoholLevel(amount: number): void;
	}
}

export {};
