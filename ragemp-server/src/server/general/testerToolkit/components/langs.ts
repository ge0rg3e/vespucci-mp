import { formatNumber } from '@server/utils/helpers';
import { createLanguagePack } from '@vmp/i18n';

createLanguagePack('TesterToolkit', {
	'Toast:TeleportedTo': {
		EN: ({ name }) => `You've teleported to ${name}`,
		RO: ({ name }) => `Te-ai teleportat la ${name}`
	},
	'Toast:SetValue': {
		EN: ({ valueName, value }: ExpectedAny) => {
			let message = ``;

			switch (valueName) {
				case 'health':
					message = `You set your health to ${value}%`;
					break;

				case 'armour':
					message = `You set your armour to ${value}%`;
					break;

				case 'experience':
					message = `Your experience points are now set to ${value} XP `;
					break;

				case 'level':
					message = `Your level is now set to ${value}`;
					break;
				case 'money':
					message = `Your money balance is now ${formatNumber(value, true)}`;
					break;

				default:
					message = `You set ${valueName} to ${value}`;
			}

			return message;
		},
		RO: ({ valueName, value }: ExpectedAny) => {
			let message = ``;

			switch (valueName) {
				case 'health':
					message = `Ți-ai setat viața la ${value}%`;
					break;

				case 'armour':
					message = `Ți-ai setat armura la ${value}%`;
					break;

				case 'experience':
					message = `Punctele tale de experiență au fost setate la ${value} XP `;
					break;

				case 'level':
					message = `Nivelul tău a fost setat la ${value}`;
					break;
				case 'money':
					message = `Balanța ta de bani este acum ${formatNumber(value, true)}`;
					break;

				default:
					message = `Ai setat ${valueName} la ${value}`;
			}

			return message;
		}
	},
	'Toast:ResetValue': {
		EN: ({ valueName }: ExpectedAny) => {
			let translatedValueName = '';

			switch (valueName) {
				case 'inventory':
					translatedValueName = 'Items in inventory have';
					break;
				default:
					translatedValueName = valueName;
			}

			return `${translatedValueName} been reset`;
		},
		RO: ({ valueName }: ExpectedAny) => {
			let translatedValueName = '';

			switch (valueName) {
				case 'inventory':
					translatedValueName = 'Itemele din inventar au';
					break;
				default:
					translatedValueName = valueName;
			}

			return `${translatedValueName} fost resetate`;
		}
	},
	'Toast:GhostMode': {
		EN: ({ enabled }) => `Ghostmode has been ${enabled ? 'enabled' : 'disabled'}`,
		RO: ({ enabled }) => `Ghostmode a fost ${enabled ? 'pornit' : 'oprit'}`
	}
});
