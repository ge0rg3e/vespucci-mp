mp.Player.prototype.getHungerPoints = function () {
	// @ts-ignore
	return parseFloat(this.vars.hungerPoints);
};

mp.Player.prototype.giveHungerPoints = function (amount) {
	// @ts-ignore
	let newAmount = parseFloat(this.vars.hungerPoints);

	// Add new amount..
	newAmount += amount;

	// If is over 100.. reset we can't overfeed ourselves.
	if (newAmount > 100) {
		newAmount = 100;
	}

	// Set value..
	this.updateVars({ hungerPoints: newAmount });
};

mp.Player.prototype.reduceHungerPoints = function (amount) {
	// Take curent amount
	// @ts-ignore
	let newAmount = parseFloat(this.vars.hungerPoints);

	// Reduce new amount..
	newAmount -= amount;

	// We can't let it be negative -1
	if (newAmount < 1) {
		newAmount = 0;
	}

	// Set value..
	this.updateVars({ hungerPoints: newAmount });
};

mp.Player.prototype.setHungerPoints = function (amount) {
	// Safety checks..
	if (amount > 100 || amount < 1) {
		amount = amount > 100 ? 100 : 0;
	}

	this.updateVars({ hungerPoints: amount });
};

mp.Player.prototype.getThirstPoints = function () {
	// @ts-ignore
	return parseFloat(this.vars.thirstPoints);
};

mp.Player.prototype.giveThirstPoints = function (amount) {
	// Take curent amount
	// @ts-ignore-next-line
	let newAmount = parseFloat(this.vars.thirstPoints);

	// Add new amount..
	newAmount += amount;

	// Can't let too much
	if (newAmount > 100) {
		newAmount = 100;
	}

	// Set value..
	this.updateVars({ thirstPoints: newAmount });
};

mp.Player.prototype.reduceThirstPoints = function (amount) {
	// Take curent amount
	// @ts-ignore-next-line
	let newAmount = parseFloat(this.vars.thirstPoints);

	// Reduce new amount..
	newAmount -= amount;

	// Can't let too less
	if (newAmount < 1) {
		newAmount = 0;
	}

	// Set value..
	this.updateVars({ thirstPoints: newAmount });
};

mp.Player.prototype.setThirstPoints = function (amount) {
	// Safety checks..
	if (amount > 100 || amount < 1) {
		amount = amount > 100 ? 100 : 0;
	}

	this.updateVars({ thirstPoints: amount });
};

declare global {
	interface PlayerMp {
		// For food..
		getHungerPoints(): number;
		giveHungerPoints(amount: number): void;
		reduceHungerPoints(amount: number): void;
		setHungerPoints(amount: number): void;

		// For thirst..
		getThirstPoints(): number;
		giveThirstPoints(amount: number): void;
		reduceThirstPoints(amount: number): void;
		setThirstPoints(amount: number): void;
	}
}

export {};
