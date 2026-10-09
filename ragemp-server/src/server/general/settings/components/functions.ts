/**
 * This function returns the settings that all players will have by default.
 * @returns Settings
 */

export const getGameDefaultSettings = () => {
	// Setting the default variables
	let defaultVariables: PlayerVariables['settings'] = {
		// Gameplay
		displayOwnNametag: false,
		showFPS: false,
		// Audio
		voiceChat: {
			enabled: true,
			volume: 1,
			ignored: []
		},
		walkieTalkie: {
			enabled: true,
			volume: 1,
			ignored: []
		},
		speakers: {
			enabled: true,
			volume: 1,
			ignored: []
		},
		carSpeakers: {
			enabled: true,
			volume: 1,
			ignored: [] // Some are server some are personal vehicle ids.
		},
		carSurroundSound: {
			enabled: true,
			volume: 1,
			ignored: []
		},
		soundEffects: {
			enabled: true,
			volume: 1
		},
		// Chats
		chats: {
			premium: true,
			gang: true,
			faction: true,
			admin: true,
			staff: true,
			newbie: true
		},
		// Hotkeys
		hotkeys: {
			chat: 'T',
			voiceChat: 'V',
			inventory: 'I',
			phone: 'O',
			profile: 'P',
			playersList: 'L',
			vehicleLock: 'N',
			mapZoom: 'Z',
			openMap: 'M',
			vehicleSeatbelt: 'M',
			vehicleEngine: '2'
		}
	};

	return defaultVariables;
};
