// Vespucci Gamemode - Started 7th November 2021

import { green, red, yellow } from 'colorette';
import Database from './utils/database';

import '@utils/loader';

// Delays server's initialization of packages to run early functions.
mp.events.delayInitialization = true;

Database.connect()
	.then(() => {
		console.info(`${green('[DONE]')} Server environment set is ${yellow(`"${process.env.ENVIRONMENT}"`)}`);
		console.info(`${green('[DONE]')} Gamemode has been started ❤️`);
		console.info(`${green('[DONE]')} Loaded ${yellow(`${mp.commands.getSize()}`)} commands`);
		console.info(`${green('[DONE]')} Loaded ${yellow(`${mp.items.getSize()}`)} items`);
		console.info(`${green('[DONE]')} Loaded ${yellow(`${mp.actors.getSize()}`)} actors`);

		mp.events.call('gamemodeStarted');

		// Allowing 5 seconds for the server to boot up right.
		setTimeout(
			() => {
				// Remove the server's delays initialization of packages to allow the server to start.
				mp.events.delayInitialization = false;

				// Is something called once all the natives, scripts have been loaded.
				mp.events.call('gamemodeLoaded');
			},
			process.env.ENVIRONMENT === 'local' ? 2000 : 5000
		);
	})
	.catch(() => {
		console.info(`${red('[ERROR]')} Unable to connect to the database.`);
		process.exit(1);
	});
