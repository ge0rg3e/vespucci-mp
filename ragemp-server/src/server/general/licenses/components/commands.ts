import { getLanguagePack } from '@vmp/i18n';
import { getLicenseTypes, isValidLicense } from './functions';

const langPack = getLanguagePack('licenseLang');

mp.commands.addCommand({
	name: 'givelicense',
	permission: 'cmds.givelicense',
	args: {
		target: 'player',
		licenseName: 'string',
		hours: 'number'
	},
	defineLangs: {
		Announcement: {
			EN: ({ player, target, licenseName, hours }) => `${player} has given license ${licenseName} for ${hours} hours to ${target}`,
			RO: ({ player, target, licenseName, hours }) => `${player} a dat licenta ${licenseName} pentru ${hours} de ore lui ${target}`
		},
		TargetMessage: {
			EN: ({ player, licenseName, hours }) => `${player} has given you license ${licenseName} for ${hours} hours`,
			RO: ({ player, licenseName, hours }) => `${player} ti-a dat licenta ${licenseName} pentru ${hours} de ore`
		},
		InvalidHours: {
			EN: ({}) => `Choose a number of hours between 1 and 300.`,
			RO: ({}) => `Foloseste un numar de ore dintre 1 si 300.`
		},
		InvalidLicenseName: {
			EN: ({}) => `Invalid license name. Use the following names: ${getLicenseTypes().join(', ')}`,
			RO: ({}) => `Nume invalid de licenta. Foloseste numele urmatoare: ${getLicenseTypes().join(', ')}`
		},
		SyntaxExampleMessage: {
			EN: `License names: ${getLicenseTypes().join(', ')}`,
			RO: `Nume de licente: ${getLicenseTypes().join(', ')}`
		}
	},

	handler: async (player, { target, licenseName, hours }, lang) => {
		if (hours < 1 || hours > 300) {
			player.sendErrorMessage('Server', 'system', lang(player.lang, `InvalidHours`, { hours }), 'system');
			return;
		}

		// IF is not a valid license.
		if (!isValidLicense(licenseName)) {
			player.sendErrorMessage('Server', 'system', lang(player.lang, 'InvalidLicenseName', {}), 'system');
			return;
		}

		// Give the license
		target.giveLicense(licenseName, hours);

		// Send the player the notice if he can't see the staff logs.
		if (!target.checkPermission('game.staffMessages')) {
			target.sendClientMessage('Server', 'system', lang(target.lang, `TargetMessage`, { player: player.info.username, licenseName, hours }), 'system');
		}

		mp.chat.sendStaffMessageToAll({
			permission: 'game.staffMessages',
			systemId: 'cmdLangs:givelicense',
			messageId: 'Announcement',
			args: () => ({ player: player.info.username, target: target.info.username, licenseName, hours })
		});
	}
});

mp.commands.addCommand({
	name: 'checklicense',
	aliases: ['checklicenses'],
	permission: 'cmds.checkLicense',
	args: {
		target: 'player'
	},
	defineLangs: {
		TargetNoLicense: {
			EN: `This player does not have a license.`,
			RO: `Acest jucator nu are o licenta.`
		}
	},
	handler: async (player, { target }, lang) => {
		if (target.info.licenses.length === 0) return player.sendErrorMessage('Server', 'system', lang(player.lang, 'TargetNoLicense'), 'system');

		player.sendClientMessage('Server', 'system', `${target.info.username} licenses:`, 'system');
		target.info.licenses.filter((c) => c.hours > 0).forEach((license) => player.sendClientMessage('Server', 'system', `License: ${license.id} | Hours: ${license.hours}`, 'system'));
	}
});

mp.commands.addCommand({
	name: 'removelicense',
	aliases: ['takelicense'],
	permission: 'cmds.removelicense',
	args: {
		target: 'player',
		licenseName: 'string'
	},
	defineLangs: {
		Announcement: {
			EN: ({ player, target, licenseName }) => `${player} has removed ${licenseName} license from ${target}`,
			RO: ({ player, target, licenseName }) => `${player} a luat licenta de ${licenseName} lui ${target}`
		},
		TargetMessage: {
			EN: ({ player, licenseName }) => `${player} has removed your ${licenseName} license`,
			RO: ({ player, licenseName }) => `${player} ti-a scos licenta de ${licenseName}`
		},
		InvalidLicenseName: {
			EN: `Invalid license name. Use the following names: ${getLicenseTypes().join(', ')}`,
			RO: `Nume invalid de licenta. Foloseste numele urmatoare: ${getLicenseTypes().join(', ')}`
		},
		SyntaxExampleMessage: {
			EN: `License names: ${getLicenseTypes().join(', ')}`,
			RO: `Nume de licente: ${getLicenseTypes().join(', ')}`
		}
	},
	handler: async (player, { target, licenseName }, lang) => {
		if (!isValidLicense(licenseName)) {
			player.sendErrorMessage('Server', 'system', lang(player.lang, 'InvalidLicenseName'), 'system');
			return;
		}

		// Remove the license
		target.removeLicense(licenseName);

		// If he can't see the staff log we'll send him this message
		if (!target.checkPermission('game.staffMessages')) {
			target.sendClientMessage('Server', 'system', lang(target.lang, `TargetMessage`, { player: player.info.username, licenseName }), 'system');
		}

		mp.chat.sendStaffMessageToAll({
			permission: 'game.staffMessages',
			systemId: 'cmdLangs:removelicense',
			messageId: 'Announcement',
			args: () => ({ player: player.info.username, target: target.info.username, licenseName })
		});
	}
});
