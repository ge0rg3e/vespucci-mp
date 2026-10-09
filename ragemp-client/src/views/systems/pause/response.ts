const Response = {
	// Gameplay
	displayOwnNametag: false,
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
		mapZoom: 'M',
		vehicleSeatbelt: 'M',
		vehicleEngine: '2'
	}
};

export default Response;
