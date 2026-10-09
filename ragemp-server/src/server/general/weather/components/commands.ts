import { currentGameTime } from './gameTime';
import { getCurrentGameWeather, setGameWeather, weatherRotation } from './weather';

mp.commands.addCommand({
	name: 'mytod',
	permission: 'cmds.mytod',
	defineLangs: {
		Message: {
			EN: ({ hour }) => `You've changed your in-game hour to ${hour}:00.`,
			RO: ({ hour }) => `Ti-ai schimbat ora in joc la ${hour}:00. `
		},
		ErrorMessage: {
			EN: ({ hour }) => `Value ${hour} is not a valid in-game hour. Choose a number between 0 and 23.`,
			RO: ({ hour }) => `Valoarea ${hour} nu este o ora in joc validă. Alege un număr între 0 și 23.`
		}
	},
	args: {
		hour: 'number'
	},
	handler: (player, { hour }, lang) => {
		if (hour < 0 || hour > 23) return player.sendErrorMessage('Server', 'system', lang(player.lang, `ErrorMessage`, { hour }), 'system');
		player.sendAdminMessage('Server', 'system', lang(player.lang, `Message`, { hour }), 'system');
		player.triggerClientEvent(`setGameTime`, { hour, minutes: 0, seconds: 0 });
		const { hour: serverHour } = currentGameTime;
		player.updateVars({ ownTimeOfDay: serverHour === hour ? null : hour });
		player.triggerClientEvent(`setCustomGameHour`, { hour: serverHour === hour ? null : hour });
		player.createAmplitudeEvent('Changed his time of day', { hour });
	}
});

mp.commands.addCommand({
	name: 'tod',
	permission: 'cmds.tod',
	defineLangs: {
		Message: {
			EN: ({ player, hour, reason }) => `${player} changed in-game hour to ${hour < 10 ? `0${hour}` : hour}:00 for everyone. Reason: ${reason}`,
			RO: ({ player, hour, reason }) => `${player} a schimbat ora din joc la ${hour < 10 ? `0${hour}` : hour}:00 pentru toti. Motiv: ${reason}`
		},
		ErrorMessage: {
			EN: ({ hour }) => `Value ${hour} is not a valid in-game hour. Choose a number between 0 and 23.`,
			RO: ({ hour }) => `Valoarea ${hour} nu este o ora in joc validă. Alege un număr între 0 și 23.`
		}
	},
	args: {
		hour: 'number',
		reason: 'fullText'
	},
	handler: (player, { hour, reason }, lang) => {
		if (hour < 0 || hour > 23) return player.sendErrorMessage('Server', 'system', lang(player.lang, `ErrorMessage`, { hour }), 'system');

		mp.chat.sendStaffMessageToAll({
			systemId: 'cmdLangs:tod',
			messageId: 'Message',
			permission: 'cmds.tod',
			args: () => ({
				player: player.info.username,
				reason,
				hour
			})
		});

		// The timing..
		currentGameTime.hour = hour;
		currentGameTime.minutes = 0;

		// Setting up the game time for later players that will join the game later.
		mp.world.time.set(currentGameTime.hour, currentGameTime.minutes, 0);

		// Re-syncing the time to the players...
		mp.players.forEachLoggedIn((p: PlayerMp) => {
			p.syncServerGameTime();
			p.triggerClientEvent(`setGameTime`, { hour, minutes: 0, seconds: 0 });
		});

		player.createAmplitudeEvent('Changed time of day', { hour, reason });
	}
});

mp.commands.addCommand({
	name: 'wod',
	permission: 'cmds.wod',
	defineLangs: {
		Message: {
			EN: ({ player, weatherId, reason }) => `${player} changed in-game weather to ${weatherRotation[weatherId]} for everyone. Reason: ${reason}`,
			RO: ({ player, weatherId, reason }) => `${player} a schimbat vremea din joc la ${weatherRotation[weatherId]} pentru toti. Motiv: ${reason}`
		},
		ErrorMessage: {
			EN: ({ weatherId }) => `Value ${weatherId} is not a valid in-game weather id. Choose a number between 0 and ${weatherRotation.length - 1}.`,
			RO: ({ weatherId }) => `Valoarea ${weatherId} nu este o vreme in joc validă. Alege un număr între 0 și ${weatherRotation.length - 1}.`
		},
		SyntaxExampleMessage: {
			EN: () =>
				`SYNTAX: Weather Ids: {BR}-  ${weatherRotation
					.map((w, ix) => `{b9b9b9}(${ix}){FFFFFF} ${w}${[2, 5, 8, 11].includes(ix) ? `{BR}-  ` : ix === weatherRotation.length - 1 ? '' : ', '}`)
					.join('')}`,
			RO: () =>
				`SYNTAX: Weather Ids: {BR}-  ${weatherRotation
					.map((w, ix) => `{b9b9b9}(${ix}){FFFFFF} ${w}${[2, 5, 8, 11].includes(ix) ? `{BR}-  ` : ix === weatherRotation.length - 1 ? '' : ', '}`)
					.join('')}`
		}
	},
	args: {
		weatherId: 'number',
		reason: 'fullText'
	},
	handler: (player, { reason, weatherId }, lang) => {
		if (!weatherRotation[weatherId]) return player.sendErrorMessage('Server', 'system', lang(player.lang, `ErrorMessage`, { weatherId }), 'system');
		mp.chat.sendStaffMessageToAll({
			systemId: 'cmdLangs:wod',
			messageId: 'Message',
			permission: 'cmds.wod',
			args: () => ({
				player: player.info.username,
				reason,
				weatherId
			})
		});
		setGameWeather(weatherId);
		player.createAmplitudeEvent('Changed game weather', { weather: weatherRotation[weatherId], reason });
	}
});

mp.commands.addCommand({
	name: 'mywod',
	permission: `cmds.mywod`,
	defineLangs: {
		Message: {
			EN: ({ weatherId }) => `You've changed your in-game weather to ${weatherRotation[weatherId]}.`,
			RO: ({ weatherId }) => `Ti-ai schimbat vremea in joc la ${weatherRotation[weatherId]}`
		},
		ErrorMessage: {
			EN: ({ weatherId }) => `Value ${weatherId} is not a valid in-game weather id. Choose a number between 0 and ${weatherRotation.length - 1}.`,
			RO: ({ weatherId }) => `Valoarea ${weatherId} nu este o vreme in joc validă. Alege un număr între 0 și ${weatherRotation.length - 1}.`
		},
		SyntaxExampleMessage: {
			EN: () =>
				`SYNTAX: Weather Ids: {BR}-  ${weatherRotation
					.map((w, ix) => `{F1C410}(${ix}){FFFFFF} ${w}${[2, 5, 8, 11].includes(ix) ? `{BR}-  ` : ix === weatherRotation.length - 1 ? '' : ', '}`)
					.join('')}`,
			RO: () =>
				`SYNTAX: Weather Ids: {BR}-  ${weatherRotation
					.map((w, ix) => `{F1C410}(${ix}){FFFFFF} ${w}${[2, 5, 8, 11].includes(ix) ? `{BR}-  ` : ix === weatherRotation.length - 1 ? '' : ', '}`)
					.join('')}`
		}
	},
	args: {
		weatherId: 'number'
	},
	handler: (player, { weatherId }, lang) => {
		if (!weatherRotation[weatherId]) return player.sendErrorMessage('Server', 'system', lang(player.lang, `ErrorMessage`, { weatherId }), 'system');
		player.sendAdminMessage('Server', 'staff', lang(player.lang, `Message`, { weatherId }), 'system');
		player.triggerClientEvent(`setGameWeather`, { weatherString: weatherRotation[weatherId] });
		player.updateVars({ ownWeather: getCurrentGameWeather() === weatherRotation[weatherId] ? null : weatherRotation[weatherId] });
		player.createAmplitudeEvent('Changed his game weather', { weather: weatherRotation[weatherId] });
	}
});
