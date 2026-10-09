import { getNativeRadio } from './core';

mp.Player.prototype.playCarRadio = async function (id) {
	// Get the game radio..
	const radio = getNativeRadio({ id });
	if (!radio) return false;

	// Play audio...
	this.playAudio(radio.source, {
		// So we can stop the music on demand.
		identifier: `carRadio`,
		// Preferences
		autoplay: true,
		volume: this.vars.settings.carSpeakers.volume
	});

	this.updateVars({
		carRadio: radio.id
	});

	return true;
};

mp.Player.prototype.stopCarRadio = function () {
	// Stop Audio
	this.stopAudio(`carRadio`); // sa corectez astea

	this.updateVars({
		carRadio: 0
	});
};

declare global {
	interface PlayerMp {
		playCarRadio(id: number): void;
		stopCarRadio(): void;
	}

	interface PlayerVariables {
		carRadio: number;
	}
}

export {};
