// Remember to maintain this in client-side too.
type GameSettings = {
	// Gameplay
	displayOwnNametag: boolean;
	showFPS: boolean;
	// Audio
	carSpeakers: {
		enabled: boolean;
		volume: number;
		ignored: Array<{
			type: 'server' | 'personalVehicle';
			id: number;
		}>;
	};
	carSurroundSound: {
		enabled: boolean;
		volume: number;
		ignored: Array<{
			type: 'server' | 'personalVehicle';
			id: number;
		}>;
	};
	voiceChat: {
		enabled: boolean;
		volume: number;
		ignored: Array<string>;
	};
	walkieTalkie: {
		enabled: boolean;
		volume: number;
		ignored: Array<string>;
	};
	speakers: {
		enabled: boolean;
		volume: number;
		ignored: Array<number>;
	};
	soundEffects: {
		enabled: boolean;
		volume: number;
	};

	// Chats
	chats: {
		premium: boolean;
		gang: boolean;
		faction: boolean;
		admin: boolean;
		staff: boolean;
		newbie: boolean;
	};

	// Hotkeys
	hotkeys: {
		chat: string;
		voiceChat: string;
		inventory: string;
		phone: string;
		profile: string;
		playersList: string;
		vehicleLock: string;
		mapZoom: string;
		openMap: string;
		vehicleSeatbelt: string;
		vehicleEngine: string;
	};
};

declare global {
	interface PlayerVariables {
		settings: GameSettings;
	}
}

export {};
