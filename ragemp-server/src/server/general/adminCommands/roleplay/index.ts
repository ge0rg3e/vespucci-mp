import { MAX_ECONOMY_VALUE } from '@server/general/paycheck';
import { formatNumber } from '@server/utils/helpers';

mp.commands.addCommand({
	name: 'givemoney',
	permission: 'cmds.givemoney',
	defineLangs: {
		Announcement: {
			EN: ({ admin, target, value }) => `${admin} gave ${formatNumber(value, true)} to ${target}.`,
			RO: ({ admin, target, value }) => `${admin} i-a dat ${formatNumber(value, true)} lui ${target}.`
		},
		InvalidValue: {
			EN: () => 'The value is not a valid number.',
			RO: () => 'Valoarea nu este un numar valid.'
		}
	},
	args: {
		target: 'player',
		value: 'number'
	},
	handler: (player, { target, value }, lang) => {
		if (value < 1 || value >= MAX_ECONOMY_VALUE || target.info.money + value >= MAX_ECONOMY_VALUE) return player.sendErrorMessage('Server', 'system', lang(player.lang, 'InvalidValue'), 'system');
		const langArgs = {
			admin: player.info.username,
			target: target.info.username,
			value
		};

		mp.chat.sendStaffMessageToAll({
			systemId: 'cmdLangs:givemoney',
			messageId: 'Announcement',
			permission: 'cmds.givemoney',
			args: () => ({ ...langArgs })
		});

		if (target.checkPermission('cmds.givemoney') === false) {
			target.sendStaffMessage(lang(target.lang, 'Announcement', { ...langArgs }));
		}

		player.createAmplitudeEvent(`Changed money as staff`, {
			target: target.info.username,
			newBalance: formatNumber(target.info.money + value),
			oldBalance: formatNumber(target.info.money),
			action: 'giveMoney'
		});

		target.createAmplitudeEvent(`Money changed by staff`, {
			actioner: player.info.username,
			newBalance: formatNumber(target.info.money + value),
			oldBalance: formatNumber(target.info.money),
			action: 'giveMoney'
		});

		player.logAction({
			name: 'cmd_givemoney:gaveMoney',
			type: 'staff',
			variables: {
				value: formatNumber(value)
			},
			meta: {
				newBalance: formatNumber(target.info.money + value),
				oldBalance: formatNumber(target.info.money)
			}
		});

		target.giveMoney(value);
		target.saveInfo({ money: target.info.money });
	}
});

mp.commands.addCommand({
	name: 'takemoney',
	permission: 'cmds.takemoney',
	defineLangs: {
		Announcement: {
			EN: ({ admin, target, value }) => `${admin} took ${formatNumber(value, true)} from ${target}.`,
			RO: ({ admin, target, value }) => `${admin} i-a luat ${formatNumber(value, true)} de la ${target}.`
		},
		LowBalance: {
			EN: ({ target, value }) => `${target} does not have ${formatNumber(value, true)} in his money balance. Please try a smaller value number.`,
			RO: ({ target, value }) => `${target} nu are disponibilă suma de ${formatNumber(value, true)}. Te rog încearcă un value mai mic.`
		},
		errorMessage: {
			EN: () => 'The value is not a valid number.',
			RO: () => 'Valoarea nu este un numar valid.'
		}
	},
	args: {
		target: 'player',
		value: 'number'
	},
	handler: (player, { target, value }, lang) => {
		const langArgs = {
			admin: player.info.username,
			target: target.info.username,
			value
		};

		if (value < 1) return player.sendErrorMessage('Server', 'system', lang(player.lang, 'errorMessage'), 'system');
		if (value > target.info.money) return player.sendErrorMessage('Server', 'system', lang(player.lang, 'LowBalance', { ...langArgs }), 'system');

		if (target.checkPermission('cmds.takemoney') === false) {
			target.sendStaffMessage(lang(target.lang, 'Announcement', { ...langArgs }));
		}

		mp.chat.sendStaffMessageToAll({
			systemId: 'cmdLangs:takemoney',
			messageId: 'Announcement',
			permission: 'cmds.takemoney',
			args: () => ({ ...langArgs })
		});

		player.createAmplitudeEvent(`Changed money as staff`, {
			target: target.info.username,
			newBalance: formatNumber(target.info.money - value),
			oldBalance: formatNumber(target.info.money),
			action: 'takeMoney'
		});
		target.createAmplitudeEvent(`Money changed by staff`, {
			actioner: player.info.username,
			newBalance: formatNumber(target.info.money - value),
			oldBalance: formatNumber(target.info.money),
			action: 'takeMoney'
		});

		target.takeMoney(value);
		target.saveInfo({ money: target.info.money });
	}
});

mp.commands.addCommand({
	name: 'setmoney',
	permission: 'cmds.setmoney',
	defineLangs: {
		Announcement: {
			EN: ({ admin, target, value }) => `${admin} set ${target}'s money balance to ${formatNumber(value, true)}.`,
			RO: ({ admin, target, value }) => `${admin} i-a setat money la ${formatNumber(value, true)} pentru ${target}.`
		},
		InvalidValue: {
			EN: () => 'The value is not a valid number.',
			RO: () => 'Valoarea nu este un numar valid.'
		}
	},
	args: {
		target: 'player',
		value: 'number'
	},
	handler: (player, { target, value }, lang) => {
		if (value < 0 || value > MAX_ECONOMY_VALUE) return player.sendErrorMessage('Server', 'system', lang(player.lang, 'InvalidValue'), 'system');

		const langArgs = {
			admin: player.info.username,
			target: target.info.username,
			value
		};

		mp.chat.sendStaffMessageToAll({
			systemId: 'cmdLangs:setmoney',
			messageId: 'Announcement',
			permission: 'cmds.setmoney',
			args: () => ({ ...langArgs })
		});

		if (target.checkPermission('cmds.setmoney') === false) {
			target.sendStaffMessage(lang(target.lang, 'Announcement', { ...langArgs }));
		}

		player.createAmplitudeEvent(`Changed money as staff`, {
			target: target.info.username,
			newBalance: formatNumber(value),
			oldBalance: formatNumber(target.info.money),
			action: 'setMoney'
		});
		target.createAmplitudeEvent(`Money changed by staff`, {
			actioner: player.info.username,
			newBalance: formatNumber(value),
			oldBalance: formatNumber(target.info.money),
			action: 'setMoney'
		});

		target.setMoney(value);
		target.saveInfo({ money: target.info.money });
	}
});

mp.commands.addCommand({
	name: 'givepaycheck',
	permission: 'cmds.givepaycheck',
	defineLangs: {
		Announcement: {
			EN: ({ admin, target, value }) => `${admin} gave paycheck ${formatNumber(value, true)} to ${target}.`,
			RO: ({ admin, target, value }) => `${admin} i-a dat un paycheck de ${formatNumber(value, true)} lui ${target}.`
		},
		InvalidValue: {
			EN: () => 'The value is not a valid number.',
			RO: () => 'Valoarea nu este un numar valid.'
		}
	},
	args: {
		target: 'player',
		value: 'number'
	},
	handler: (player, { target, value }, lang) => {
		if (value < 1 || value > 1000 || target.info.paycheck + value >= MAX_ECONOMY_VALUE) return player.sendErrorMessage('Server', 'system', lang(player.lang, 'InvalidValue'), 'system');

		const langArgs = {
			admin: player.info.username,
			target: target.info.username,
			value
		};

		mp.chat.sendStaffMessageToAll({
			systemId: 'cmdLangs:givepaycheck',
			messageId: 'Announcement',
			permission: 'cmds.givepaycheck',
			args: () => ({ ...langArgs })
		});

		if (target.checkPermission('cmds.givepaycheck') === false) {
			target.sendStaffMessage(lang(target.lang, 'Announcement', { ...langArgs }));
		}

		player.createAmplitudeEvent(`Changed paycheck as staff`, {
			target: target.info.username,
			newBalance: formatNumber(target.info.money + value),
			oldBalance: formatNumber(target.info.money),
			action: 'givePaycheck'
		});
		target.createAmplitudeEvent(`Paycheck changed by staff`, {
			actioner: player.info.username,
			newBalance: formatNumber(target.info.money + value),
			oldBalance: formatNumber(target.info.money),
			action: 'givePaycheck'
		});
		target.givePaycheck(value);
		target.saveInfo({ paycheck: target.info.paycheck });

		return false;
	}
});

mp.commands.addCommand({
	name: 'setpaycheck',
	permission: 'cmds.setpaycheck',
	defineLangs: {
		Announcement: {
			EN: ({ admin, target, value }) => `${admin} set ${target}'s paycheck balance to ${formatNumber(value, true)}.`,
			RO: ({ admin, target, value }) => `${admin} i-a setat paycheck la ${formatNumber(value, true)} pentru ${target}.`
		},
		InvalidValue: {
			EN: () => 'The value is not a valid number.',
			RO: () => 'Valoarea nu este un numar valid.'
		}
	},
	args: {
		target: 'player',
		value: 'number'
	},
	handler: (player, { target, value }, lang) => {
		if (value < 1 || value > 1000 || target.info.paycheck + value >= MAX_ECONOMY_VALUE) return player.sendErrorMessage('Server', 'system', lang(player.lang, 'InvalidValue'), 'system');

		const langArgs = {
			admin: player.info.username,
			target: target.info.username,
			value
		};

		mp.chat.sendStaffMessageToAll({
			systemId: 'cmdLangs:setpaycheck',
			messageId: 'Announcement',
			permission: 'cmds.setpaycheck',
			args: () => ({ ...langArgs })
		});

		if (target.checkPermission('cmds.setpaycheck') === false) {
			target.sendStaffMessage(lang(target.lang, 'Announcement', { ...langArgs }));
		}

		player.createAmplitudeEvent(`Changed paycheck as staff`, {
			target: target.info.username,
			newBalance: formatNumber(value),
			oldBalance: formatNumber(target.info.money),
			action: 'setPaycheck'
		});
		target.createAmplitudeEvent(`Paycheck changed by staff`, {
			actioner: player.info.username,
			newBalance: formatNumber(value),
			oldBalance: formatNumber(target.info.money),
			action: 'setPaycheck'
		});

		target.setPaycheck(value);
		target.saveInfo({ paycheck: target.info.paycheck });
	}
});

mp.commands.addCommand({
	name: 'setlevel',
	permission: 'cmds.setlevel',
	defineLangs: {
		Announcement: {
			EN: ({ admin, target, value }) => `${admin} set ${target}'s level to ${value}.`,
			RO: ({ admin, target, value }) => `${admin} i-a setat level ${value} lui ${target}.`
		},
		errorMessage: {
			EN: () => 'The value is not a valid number.',
			RO: () => 'Valoarea nu este un numar valid.'
		}
	},
	args: {
		target: 'player',
		value: 'number'
	},
	handler: (player, { target, value }, lang) => {
		const langArgs = {
			admin: player.info.username,
			target: target.info.username,
			value
		};

		if (value < 1 || value > 1000) return player.sendErrorMessage('Server', 'system', lang(player.lang, `errorMessage`), 'system');

		mp.chat.sendStaffMessageToAll({
			systemId: 'cmdLangs:setlevel',
			messageId: 'Announcement',
			permission: 'cmds.setlevel',
			args: () => ({ ...langArgs })
		});

		if (target.checkPermission('cmds.setlevel') === false) {
			target.sendStaffMessage(lang(target.lang, 'Announcement', { ...langArgs }));
		}

		player.createAmplitudeEvent(`Changed level as staff`, { target: target.info.username, newLevel: value, oldLevel: target.info.level, action: 'setLevel' });
		target.createAmplitudeEvent(`Money changed by staff`, { actioner: player.info.username, newLevel: value, oldLevel: target.info.level, action: 'setLevel' });
		target.saveInfo({ level: value });
		player.updateVars({
			level: value
		});
	}
});

mp.commands.addCommand({
	name: 'setexp',
	permission: 'cmds.setexp',
	defineLangs: {
		Announcement: {
			EN: ({ admin, value, target }) => `${admin} set ${target} experience to ${formatNumber(value)}.`,
			RO: ({ admin, value, target }) => `${admin} i-a setat experienta lui ${target} in ${formatNumber(value)} .`
		},
		errorMessage: {
			EN: () => 'The value is not a valid number.',
			RO: () => 'Valoarea nu este un numar valid.'
		}
	},
	args: {
		target: 'player',
		value: 'number'
	},
	handler: (player, { target, value }, lang) => {
		if (value > 999999) return player.sendErrorMessage('Server', 'system', lang(player.lang, `errorMessage`), 'system');

		const langArgs = {
			admin: player.info.username,
			target: target.info.username,
			value
		};
		mp.chat.sendStaffMessageToAll({
			systemId: 'cmdLangs:setexp',
			messageId: 'Announcement',
			permission: 'cmds.setexp',
			args: () => ({ ...langArgs })
		});

		if (target.checkPermission('cmds.setexp') === false) {
			target.sendStaffMessage(lang(target.lang, 'Announcement', { ...langArgs }));
		}

		target.setExperience(value);

		target.saveInfo({ experience: target.info.experience, level: target.info.level });

		target.createAmplitudeEvent('Changed experience by staff', { actioner: player.info.username });
		player.createAmplitudeEvent('Changed experience by staff', { target: target.info.username });
	}
});
