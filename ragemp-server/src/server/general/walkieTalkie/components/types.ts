declare global {
	interface PlayerVariables {
		walkieTalkie: {
			frequency: null | string; // Will be WT-{Number} or FT-1 (Faction 1)
			active: boolean; // If they currently speak on the walkie.
			enabled: boolean; // If they have it turned on (so they can hear and speak)
			usable: boolean; // If they can use a walkie. (Ex: if they own one or are in a faction)
			holding: boolean; // If they have it in their hand (for animation sync) will be updated through client-side task
		};
	}

	interface PlayerMeta {
		walkieTalkieFrequency?: null | string;
		walkieTalkieEnabled?: boolean;
	}

	interface IServerEvents {
		// Player
		'walkieTalkie:startSpeaking': (player: PlayerMp) => void;
		'walkieTalkie:stopSpeaking': (player: PlayerMp) => void;
	}
}

export {};
