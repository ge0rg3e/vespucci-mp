declare global {
	interface PlayerVariables {
		phoneAnimState: null | 'holding' | 'writing' | 'speaking';
	}
}

export interface PhoneApplication {
	id: string;
	checkAccess: (player: PlayerMp) => boolean;
	sortNumber?: number;
}

export {};
