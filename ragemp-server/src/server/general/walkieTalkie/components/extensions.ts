mp.Player.prototype.setWalkieFrequency = function (frequency) {
	// If current frequency is not null we need to disconnect them before the change.
	if (this.vars.walkieTalkie.frequency !== null) {
		// Invoke this event so we disconnect the ones that are currently speaking.
		mp.events.call(`walkieTalkie:disconnectFrequency`, this, this.vars.walkieTalkie.frequency);
	}

	// Update state
	this.updateVars({ walkieTalkie: { ...this.vars.walkieTalkie, frequency } });

	// Inform client interface
	this.triggerBrowserEvent(`walkieTalkie:setFrequency`, { frequency });

	// Update meta to remember.
	this.updateMeta({ walkieTalkieFrequency: frequency });
};

mp.Player.prototype.setWalkieActive = function (active) {
	// Update state..
	this.updateVars({ walkieTalkie: { ...this.vars.walkieTalkie, active } });
};

mp.Player.prototype.setWalkieEnabled = function (enabled) {
	// Update state..
	this.updateVars({ walkieTalkie: { ...this.vars.walkieTalkie, enabled } });

	// Update meta to remember.
	this.updateMeta({ walkieTalkieEnabled: enabled });

	// Inform client interface
	this.triggerBrowserEvent(`walkieTalkie:setEnabled`, { enabled });
};

mp.Player.prototype.setWalkieUsable = function (usable) {
	// Update state..
	this.updateVars({ walkieTalkie: { ...this.vars.walkieTalkie, usable } });

	// Inform client interface
	this.triggerBrowserEvent(`walkieTalkie:setUsable`, { usable });
};

mp.Player.prototype.setWalkieHolding = function (holding) {
	// Update state..
	this.updateVars({ walkieTalkie: { ...this.vars.walkieTalkie, holding } });
};

declare global {
	interface PlayerMp {
		setWalkieFrequency(freq: string | null): void;
		setWalkieActive(state: boolean): void;
		setWalkieEnabled(state: boolean): void;
		setWalkieHolding(state: boolean): void;
		setWalkieUsable(state: boolean): void;
	}
}

export {};
