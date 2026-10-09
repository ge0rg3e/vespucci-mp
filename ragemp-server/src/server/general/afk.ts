import { createLanguagePack, getLanguagePack } from '@vmp/i18n';

// VARIABLES
export const MAX_MINUTES_AFK = 30;

mp.events.add('loadPlayerDefaults', (player) => {
	// Mark this variable to be available in client-side.
	player.addClientsideVariables(['awayFromKeyboard']);

	// We set the defaults for when he just conects
	player.updateVars({ awayFromKeyboard: { enabled: false, seconds: 0 } });
});

mp.events.add('awayFromKeyboard:active', (player) => {
	// He's not logged in.
	if (!player.vars.loggedIn) return;

	// We will increase his AFK seconds now
	const afkSeconds = player.vars.awayFromKeyboard.seconds + 1;
	const afkMinutes = afkSeconds / 60;

	// Update his variables..
	player.updateVars({ awayFromKeyboard: { seconds: afkSeconds, enabled: true } });

	// Inform the server he's still AFK and for how many seconds and minutes so the script can run any codes he wants.
	mp.events.call('afk:isAwayFromKeyboard', player, afkSeconds, afkMinutes);
});

mp.events.add('awayFromKeyboard:inactive', (player) => {
	// We store for how long he was afk just in case maybe some script needs to do something with that.
	const afkSeconds = player.vars.awayFromKeyboard.seconds;

	// Update his variables
	player.updateVars({ awayFromKeyboard: { enabled: false, seconds: 0 } });

	// Inform the server..
	mp.events.call('afk:isBack', player, afkSeconds);
});

// This is an example of how a developer should use this.
// We need to listen to afk:isAwayFromKeyboard and afk:isBack

mp.events.add(`afk:isAwayFromKeyboard`, (player, _, minutes) => {
	// We check that the time required has passed.
	if (minutes < MAX_MINUTES_AFK) return;

	// Get the llanguage
	const lang = getLanguagePack('AfkMessage', player.lang);

	// Kick..
	player.kickDelayed('Kicked', lang.get('Message'), 50);
});

createLanguagePack('AfkMessage', {
	Message: {
		EN: 'You have been kicked because you were AFK for more than 30 minutes.',
		RO: 'Ai primit kick din joc pentru ca ai stat AFK mai mult de 30 minute.'
	}
});

declare global {
	interface PlayerVariables {
		awayFromKeyboard: {
			enabled: boolean;
			seconds: number;
		};
	}
}

export {};
