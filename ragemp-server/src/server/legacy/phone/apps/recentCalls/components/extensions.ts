import { v4 as uuidv4 } from 'uuid';

mp.Player.prototype.logRecentCall = function (params) {
	const { phoneNumber, isCaller, callMissed = false } = params;

	const recentCalls = this.meta.recentCalls || [];

	// If we have more than 30 recent calls.
	if (recentCalls.length > 30) {
		recentCalls.splice(0, 1); // delete oldest one.
	}

	// Formatting new entry
	const newEntry = {
		uuid: uuidv4(),
		date: new Date(),
		phoneNumber,
		isCaller,
		callMissed
	};

	// Add push..
	recentCalls.push(newEntry);

	// Save it..
	this.updateMeta({ recentCalls });

	// Send it to browser too.
	this.triggerSocketEvent('phoneRecentCalls.receivedData', [newEntry]);
};

mp.Player.prototype.deleteRecentCall = function (uuid) {
	const recentCalls = this.meta.recentCalls || [];

	// Find index
	const index = recentCalls.findIndex((c) => c.uuid === uuid);

	// If found..
	if (index !== -1) {
		recentCalls.splice(index, 1);
	}

	// Save it..
	this.updateMeta({ recentCalls });
};

type Params = {
	phoneNumber: string;
	isCaller: boolean;
	callMissed?: boolean;
};

declare global {
	interface PlayerMp {
		logRecentCall(params: Params): void;
		deleteRecentCall(uuid: string): void;
	}
}

export {};
