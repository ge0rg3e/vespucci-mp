import { type LanguagePack } from '@vmp/i18n';

const Language: LanguagePack = {
	'Respond.reject': {
		EN: 'Reject',
		RO: 'Respinge'
	},
	'Respond.message': {
		EN: 'Message',
		RO: 'Mesaj'
	},
	'Respond.Call': {
		EN: ({ callAccepted }) => (callAccepted ? 'call accepted' : 'click to answer'),
		RO: ({ callAccepted }) => (callAccepted ? 'apel acceptat' : 'click pentru a raspunde')
	},

	'Options.mute': {
		EN: 'Mute'
	},
	'Options.keypad': {
		EN: 'Keypad'
	},
	'Options.speaker': {
		EN: 'Speaker'
	},
	'Options.add-call': {
		EN: 'Add call'
	},
	'Options.camera': {
		EN: 'Camera'
	},
	'Options.block-caller': {
		EN: 'Block caller'
	},

	'QuickMessage.title': {
		EN: 'Quick Message',
		RO: 'Mesaj Rapid'
	},
	'QuickMessage.description': {
		EN: 'Select a quick message:',
		RO: 'Selecteaza un mesaj rapid:'
	}
};

export default Language;
