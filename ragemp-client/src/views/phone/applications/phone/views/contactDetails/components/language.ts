import { type LanguagePack } from '@vmp/i18n';

const Language: LanguagePack = {
	'Header:left-side:label': {
		EN: 'Contacts',
		RO: 'Contacte'
	},
	'Header:right-side:label': {
		EN: 'Edit',
		RO: 'Editează'
	},

	yes: {
		EN: 'Yes',
		RO: 'Da'
	},
	no: {
		EN: 'No',
		RO: 'Nu'
	},
	confirmation: {
		EN: 'Confirmation',
		RO: 'Confirmare'
	},
	phone: {
		EN: 'Phone',
		RO: 'Telefon'
	},
	notes: {
		EN: 'Notes',
		RO: 'Notițe'
	},

	'phone-credit': {
		EN: 'Phone Credit',
		RO: 'Credit'
	},

	'notes:contactCard': {
		EN: `This is your personal contact card, which includes the phone number you can
		share with other players for messaging and calling purposes.`,
		RO: `Aceasta este cartea ta de contact personală, care include numărul de telefon pe care îl poți partaja cu alți jucători pentru mesaje și apeluri.`
	},
	'Options:deleteContact:description': {
		EN: 'Are you sure you want to delete this Contact? This action is irreversible.',
		RO: 'Sunteți sigur că doriți să ștergeți acest contact? Această acțiune este ireversibilă.'
	},

	'Options:blockNumber:description': {
		EN: 'Are you sure you want to block this phone number? This number will not be able to call you or send you messages anymore.',
		RO: 'Sunteți sigur că doriți să blocați acest număr de telefon? Acest număr nu va mai putea să vă apeleze sau să vă trimită mesaje.'
	},
	'Options:blockNumber:Confirmation.title': {
		EN: 'Confirmation',
		RO: 'Confirmare'
	},
	'Options:blockNumber:Confirmation.description': {
		EN: 'The phone number has been blocked.',
		RO: 'Numărul de telefon a fost blocat.'
	},
	'Options:blockNumber:Confirmation:Error': {
		EN: 'A problem has occurred.',
		RO: 'A apărut o problemă.'
	},
	'Options:unblockNumber:Confirmation.title': {
		EN: 'Confirmation',
		RO: 'Confirmare'
	},
	'Options:unblockNumber:Confirmation.description': {
		EN: 'The phone number has been unblocked.',
		RO: 'Numărul de telefon a fost deblocat.'
	},
	'Options:unblockNumber:Confirmation:Error': {
		EN: 'A problem has occurred.',
		RO: 'A apărut o problemă.'
	},

	'Options:deleteContact:Alert:title': {
		EN: 'Contact Deleted',
		RO: 'Contactul a fost șters'
	},
	'Options:deleteContact:Alert:description': {
		EN: 'The contact has been deleted successfully.',
		RO: 'Contactul a fost șters cu succes.'
	},
	'Options:deleteContact:Alert:Error:description': {
		EN: 'We are experiencing technical difficulties, please try again.',
		RO: 'Experimentăm dificultăți tehnice, vă rugăm să încercați din nou.'
	},
	'Options:deleteContact:Alert:Error:description:notInContact': {
		EN: `This number wasn't present in your phone contacts. Please check again, we refreshed your contacts.`,
		RO: 'Acest număr nu era prezent în lista dvs. de contacte. Vă rugăm să verificați din nou, am actualizat lista de contacte.'
	},

	'Options:entries:message': {
		EN: 'Send Message',
		RO: 'Trimite mesaj'
	},
	'Options:entries:editContact': {
		EN: 'Edit this Contact',
		RO: 'Editează acest contact'
	},
	'Options:entries:deleteContact': {
		EN: 'Delete this Contact',
		RO: 'Șterge acest contact'
	},
	'Options:entries:deleteContact:Alert:description': {
		EN: 'Are you sure you want to delete this Contact? This action is irreversible.',
		RO: 'Sunteți sigur că doriți să ștergeți acest contact? Această acțiune este ireversibilă.'
	},
	'Options:entries:blockNumber': {
		EN: 'Block this Number',
		RO: 'Blochează acest număr'
	},
	'Options:entries:unblockNumber': {
		EN: 'Unblock this Number',
		RO: 'Deblochează acest număr'
	},

	'Fields:copyPhoneNumber:title': {
		EN: 'Number copied',
		RO: 'Număr copiat'
	},
	'Fields:copyPhoneNumber:description': {
		EN: 'The phone number has been successfully copied to your clipboard.',
		RO: 'Numărul de telefon a fost copiat cu succes în clipboard-ul dvs.'
	},

	'Actions:message': {
		EN: 'Message',
		RO: 'Mesaj'
	},
	'Actions:call': {
		EN: 'Call',
		RO: 'Apel'
	},
	'Actions:mail': {
		EN: 'Mail'
	},

	'Error.reponse': {
		EN: 'A problem has occurred.',
		RO: 'A apărut o problemă.'
	}
};

export default Language;
