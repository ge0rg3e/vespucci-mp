declare global {
	interface PlayerMp {
		// Animated cached on the player
		phoneAnimState: phoneAnimState;

		// Last animation played
		phoneLastAnim: ExpectedAny;

		// To keep track if they already have an attachment
		phoneHasAttachment: boolean;
	}
}

export type phoneAnimState = null | 'holding' | 'writing' | 'speaking';

export {};
