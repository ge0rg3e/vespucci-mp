mp.Player.prototype.updateSettings = function giveExperience(settings) {
	this.updateVars({
		settings: {
			...this.vars.settings,
			...settings
		}
	});
};

declare global {
	interface PlayerMp {
		updateSettings(settings: Partial<PlayerVariables['settings']>): void;
	}
}

export {};
