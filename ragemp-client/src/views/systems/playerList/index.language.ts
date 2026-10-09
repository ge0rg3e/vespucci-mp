import { type LanguagePack } from '@vmp/i18n';

const Language: LanguagePack = {
	SearchInput: {
		EN: () => `Search for a player by their name or ID`,
		RO: () => `Caută un jucător după nume sau player id`
	},
	PlayersOnline: {
		EN: () => `Players online`,
		RO: () => `Jucători online`
	},
	ReportPlayer: {
		EN: `Report this player`,
		RO: `Reportează jucător`
	},
	MutePlayer: {
		EN: `Mute microphone`,
		RO: `Mute microfon`
	},
	SearchNoMatch: {
		EN: `There is no match for this search`,
		RO: `Nu există rezultate pentru căutare`
	},
	EmptyList: {
		EN: `No players listed here`,
		RO: `Nici un jucător listat aici`
	},
	AllPlayers: {
		EN: `All players`,
		RO: `Toți jucătorii`
	},
	Nearby: {
		EN: 'Nearby',
		RO: `În apropiere`
	},
	Staff: {
		EN: `Staff`,
		RO: `Echipă`
	},
	CountPlayers: {
		EN: ({ value, tab }) => (tab === 'all' ? `${value}/1000` : `${value} players`),
		RO: ({ value, tab }) => (tab === 'all' ? `${value}/1000` : `${value} jucători`)
	},
	KeyHintESC: {
		EN: `Close interface`,
		RO: `Inchide interfață`
	},
	KeySelectKey: {
		EN: `Left click`,
		RO: `Click stânga`
	},
	KeyHintSelect: {
		EN: `Select player from list`,
		RO: `Selectează jucător din listă`
	}
};

export default Language;
