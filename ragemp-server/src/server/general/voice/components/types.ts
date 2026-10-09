declare global {
	type VoiceChatSettings = {
		// Settings
		active: boolean;
		channel: string | null;

		// The range of the voice chat.. (Reminder: car means only those in his vehicle can hear him)
		range: 'normal' | 'whisper' | 'shout' | 'car';

		// A system that makes sure that Phone VoIp won't disconnect the player from world chat when they hang up.
		lines: Array<{ id: string; playerId: number }>;
	};

	interface PlayerVariables {
		voiceChat: Partial<VoiceChatSettings>;
	}

	// This is where we will store the last settings so when we reconnect to game we'll re-apply.
	interface PlayerMeta {
		voiceChat: Partial<VoiceChatSettings>;
	}
}

export {};
