declare global {
	// The statuses a participant can have.
	type phoneLineStatus =
		| 'pending' // means we're waiting for a response
		| 'active' // means he's in the call already.
		| 'unreachable' // means he's offline or he's blocked us
		| 'busy' // he denied the call
		| 'hangedUp'; // he hanged up the call.

	type phoneLineRoles = 'caller' | 'participant';

	type phoneLineParticipant = {
		displayName: string;
		role: phoneLineRoles;
		status: phoneLineStatus;
		joinedAt: Date | null;
		_isLocalPlayer: boolean;
	};
}

export {};
