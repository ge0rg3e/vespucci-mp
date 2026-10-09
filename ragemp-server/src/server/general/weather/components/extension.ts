import { currentGameTime, SECONDS_TO_MINUTES_IN_GAME } from './gameTime';

mp.Player.prototype.syncCustomGameTime = function () {
	this.triggerClientEvent(`setGameTime`, { hour: this.vars.ownTimeOfDay, minutes: 0, seconds: 0 });
};

mp.Player.prototype.syncServerGameTime = function () {
	this.triggerClientEvent(`setGameTimePassing`, {
		SECONDS_TO_MINUTES_IN_GAME,
		currentServerGameTime: currentGameTime
	});
};
// Since now we use a game time dictated by our server-side
// Whenever we spawn the ped, it seems RAGE:MP is resetting game time and weather, weird.

mp.events.add('playerSpawn', (player) => {
	if (player.vars.ownTimeOfDay !== null) {
		player.syncCustomGameTime();
	}
});

// When the player joins the server we must sync his client-side to our server-side.

mp.events.add('loadPlayerDefaults', (player) => {
	player.syncServerGameTime();
});

declare global {
	interface PlayerMp {
		syncCustomGameTime(): void;
		syncServerGameTime(): void;
	}
}

export {};
