import { getPlayerVariable } from '@client/utils/helpers';

/**
 *
 * @returns The game settings of this player.
 */

export const getGameSettings = () => {
	let res: GameSettings | null = getPlayerVariable(mp.players.local.remoteId, 'settings');
	return res;
};

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
		ignored: Array<string>;
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
		vehicleSeatbelt: string;
		vehicleEngine: string;
	};
};
