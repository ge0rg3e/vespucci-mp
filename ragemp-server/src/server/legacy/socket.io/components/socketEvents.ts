import { red } from 'colorette';

export const registeredSocketEvents: Array<{ eventName: string; handler: callback; loggedInOnly: boolean }> = [];

export const createSocketEvent = (eventName: string, callback: callback, loggedIn = true) => {
	if (registeredSocketEvents.find((e) => e.eventName === eventName)) {
		console.info(`${red('[ERROR]')} Socket event name "${eventName}" is already used.`);
		process.exit(1);
	}

	registeredSocketEvents.push({
		eventName: eventName,
		handler: callback,
		loggedInOnly: loggedIn
	});

	return true;
};

type callback = (player: PlayerMp, data: ExpectedAny) => void;
