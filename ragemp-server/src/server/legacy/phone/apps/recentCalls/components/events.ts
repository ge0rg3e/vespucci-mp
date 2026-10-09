import { getParticipant, getPhoneLine } from '../../call/components/functions';

mp.events.add('loadPlayerDefaults', (player: PlayerMp) => {
	// If is the first time logging in we will set array to [];
	if (player.meta.recentCalls === undefined) {
		player.updateMeta({
			recentCalls: []
		});
	}
});

const logOnCallResponse = (lineId: string, rejected: boolean) => {
	const line = getPhoneLine(lineId);
	if (!line) return false;

	// Log call for all participants
	const caller: PlayerMp | null = getParticipant(line.id, 'caller');
	const participant: PlayerMp | null = getParticipant(line.id, 'participant');

	// Double check.
	if (!caller || !participant) return false;

	// Log it for the caller..
	caller.logRecentCall({
		phoneNumber: participant.info.phoneNumber,
		isCaller: true
	});

	// Log it for the called..
	participant.logRecentCall({
		phoneNumber: caller.info.phoneNumber,
		callMissed: rejected ? true : false,
		isCaller: false
	});

	return true;
};

mp.events.add(`phoneLine:onCallAccepted`, (lineId) => logOnCallResponse(lineId, false));

mp.events.add(`phoneLine:onCallRejected`, (lineId) => logOnCallResponse(lineId, true));
