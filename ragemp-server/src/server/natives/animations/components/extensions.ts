import { clearAnimTimeout, setAnimOnTimeoutCallback } from './functions';

mp.Player.prototype.applyAnimation = function (params) {
	// Extract paramteres
	const { dict, name, speed, flags, duration = undefined, speedMultiplier = undefined, onCallback = undefined } = params;

	// Get current animations
	let currentAnims = this.vars.animations;

	// Push one more animation to the list so we can play it in client-side synced.
	currentAnims.push({
		dict,
		name,
		speed,
		flags,
		duration,
		speedMultiplier
	});

	// @Prevention: Can't have more than 10 anims at once. I don't wnat to spam the array to the point where it will have issues.
	if (currentAnims.length > 10) {
		currentAnims.splice(0, 1);
	}

	// Sync it via client-side
	this.updateVars({ animations: currentAnims });

	// If there is a certain function to be executed after that time out..
	if (duration) {
		// If there is no callback but there is a duration we need to at least cancel the anim.
		const defaultCallback = (_: ExpectedAny, stopCurrentAnimation: ExpectedAny) => {
			stopCurrentAnimation();
		};

		setAnimOnTimeoutCallback(this, { dict, name }, duration, onCallback ? onCallback : defaultCallback);
	}

	return true;
};

mp.Player.prototype.isPlayingAnimation = function (dict, name) {
	// Get the index..
	const indexOf = this.vars.animations.findIndex((c) => c.dict === dict && c.name === name);

	// Give answer
	return indexOf === -1 ? false : true;
};

mp.Player.prototype.stopSpecificAnimation = function (dict, name) {
	// Get current animations
	let currentAnims = this.vars.animations;

	// Get the index..
	const indexOf = currentAnims.findIndex((c) => c.dict === dict && c.name === name);
	if (indexOf === -1) return false;

	// Remove anim
	currentAnims.splice(indexOf, 1);

	// Cancel current timeout (if exists)
	clearAnimTimeout(this, { dict, name });

	// Sync it via client-side
	this.updateVars({ animations: currentAnims });

	return true;
};

mp.Player.prototype.clearAnimations = function () {
	// Cancel current anim timeouts..
	this.vars.animations.forEach((anim) => {
		clearAnimTimeout(this, { dict: anim.dict, name: anim.name });
	});

	// Sync it via client-side
	this.updateVars({ animations: [] });
};

type playAnimParams = {
	dict: string /** Animation dictionary */;
	name: string /** Animation name */;
	speed: number /** The speed to play at 1x */;
	flags: number /** The flag. Use a flag calculator online */;
	duration?: number /** how many miliseconds */;
	speedMultiplier?: number;
	onCallback?: (player: PlayerMp, stopCurrentAnimation: Function) => ExpectedAny /** Function to be called after the duration ends. */;
};

declare global {
	interface PlayerMp {
		// Functions fully synced via client-side.
		applyAnimation(params: playAnimParams): boolean;
		stopSpecificAnimation(dict: string, name: string): void;
		clearAnimations(): void;
		isPlayingAnimation(dict: string, name: string): boolean;
	}
}

export {};
