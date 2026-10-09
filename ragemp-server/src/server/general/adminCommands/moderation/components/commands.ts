import { getLanguagePack } from '@vmp/i18n';
import moment from 'moment';

mp.commands.addCommand({
	name: 'clearchat',
	aliases: ['cc'],
	permission: 'cmds.clearchat',
	defineLangs: {
		Message: {
			EN: ({ reason }) => `{F1C410}Chat history has been deleted. Reason: ${reason}`,
			RO: ({ reason }) => `{F1C410}Istoria chat-ului a fost stearsa. Motiv: ${reason}`
		}
	},
	args: {
		reason: 'fullText'
	},
	handler: (player, { reason }) => {
		mp.players.forEachLoggedIn((entity: PlayerMp) => entity.clearChat());

		mp.chat.sendChatMessageToAll({
			channel: 'system',
			sender: () => player.info.username,
			type: (target) => mp.chat.getMessageType('system', target.lang),
			content: (target) => {
				// Get lang
				const lang = getLanguagePack('cmdLangs:clearchat', target.lang);

				return {
					type: 'text',
					data: `${lang.get(`Message`, {
						player: player.info.username,
						reason
					})}`
				};
			}
		});

		player.createAmplitudeEvent('Cleared the chat', { reason });
	}
});

mp.commands.addCommand({
	name: 'clearmychat',
	aliases: ['cmc'],
	permission: 'cmds.clearmychat',
	defineLangs: {
		Message: {
			EN: () => `{F1C410}You have cleared your own chat history.`,
			RO: () => `{F1C410}Ti-ai sters istoria chat-ului din joc.`
		}
	},
	handler: (player, _, lang) => {
		player.clearChat();
		player.sendAdminMessage('Server', 'system', lang(player.lang, `Message`), 'system');
		player.createAmplitudeEvent('Cleared his chat');
	}
});

mp.commands.addCommand({
	name: 'kick',
	permission: 'cmds.kick',
	defineLangs: {
		Announcement: {
			EN: ({ player, target, reason }) => `${target} has been kicked from the game by ${player}. Reason: ${reason}`,
			RO: ({ player, target, reason }) => `${target} a primit kick din joc de la ${player}. Motiv: ${reason}`
		},
		Message: {
			EN: ({ admin, reason }) => `You have been kicked from the game.{BRD}Kicked by: ${admin}{BR}Reason: ${reason}`,
			RO: ({ admin, reason }) => `Ai primit kick din joc.{BRD}Administratorul care ti-a dat kick: ${admin}{BR}Motiv: ${reason}`
		},
		ErrorMessage: {
			EN: () => "You can't use this command on yourself.",
			RO: () => 'Nu poti folosii aceasta comanda pe tine.'
		}
	},
	args: {
		target: 'player',
		reason: 'fullText'
	},
	handler: (player, { target, reason }, lang) => {
		if (target === player) return player.sendErrorMessage('Server', 'system', lang(player.lang, `ErrorMessage`), 'system');

		mp.chat.sendStaffMessageToAll({
			systemId: 'cmdLangs:kick',
			permission: 'game.staffMessages',
			messageId: 'Announcement',
			args: () => ({
				target: target.info.username,
				player: player.info.username,
				reason
			})
		});

		player.createAmplitudeEvent('Kicked player', { target: target.info.username, reason });
		target.createAmplitudeEvent('Kicked by staff', { actioner: player.info.username, reason });

		target.kickDelayed('Kicked', lang(target.lang, 'Message', { admin: player.info.username, reason }), 50);
	}
});

mp.commands.addCommand({
	name: 'mute',
	permission: 'cmds.mute',
	defineLangs: {
		Message: {
			EN: ({ player, target, minutes, reason }) => `${player} muted ${target} for ${minutes} minutes. Reason: ${reason}`,
			RO: ({ player, target, minutes, reason }) => `${player} i-a dat mute lui ${target} pentru ${minutes} minute. Motiv: ${reason}`
		},
		MuteExpiredMessage: {
			EN: () => `You're no longer muted. You can speak again.`,
			RO: () => `Nu mai ai mute. Poti vorbii din nou.`
		},
		NotAllowedMessage: {
			EN: ({ minutes }) => `You are not allowed to talk. You're muted for ${minutes} more minutes.`,
			RO: ({ minutes }) => `Nu ai voie să vorbești. Ai mute pentru încă ${minutes} minute.`
		},
		errorMessage: {
			EN: () => "You can't use this command on yourself.",
			RO: () => 'Nu poti folosii aceasta comanda pe tine.'
		}
	},
	args: {
		target: 'player',
		minutes: 'number',
		reason: 'fullText'
	},
	handler: (player, { target, minutes, reason }, lang) => {
		if (target === player) return player.sendErrorMessage('Server', 'system', lang(player.lang, `errorMessage`), 'system');

		mp.chat.sendStaffMessageToAll({
			systemId: 'cmdLangs:mute',
			messageId: 'Message',
			permission: 'cmds.mute',
			args: () => ({
				target: target.info.username,
				player: player.info.username,
				minutes,
				reason
			})
		});

		if (target.checkPermission('cmds.mute') === false) {
			target.sendStaffMessage(
				lang(target.lang, `Message`, {
					target: target.info.username,
					player: player.info.username,
					minutes,
					reason
				})
			);
		}

		player.createAmplitudeEvent('Muted player', { target: target.info.username, minutes, reason });
		target.createAmplitudeEvent('Muted', { actioner: player.info.username, minutes, reason });

		target.saveInfo({ muteMinutes: minutes });
	}
});

mp.commands.addCommand({
	name: 'unmute',
	permission: 'cmds.mute',
	defineLangs: {
		Message: {
			EN: ({ player, target, reason }) => `${player} unmuted ${target}. Reason: ${reason}`,
			RO: ({ player, target, reason }) => `${player} i-a scos mute lui ${target}. Motiv: ${reason}`
		},
		ErrorMessage: {
			EN: ({ target }) => `${target} is not muted.`,
			RO: ({ target }) => `${target} nu are mute.`
		}
	},
	args: {
		target: 'player',
		reason: `fullText`
	},
	handler: (player, { target, reason }, lang) => {
		if (target.info.muteMinutes < 1) return player.sendErrorMessage('Server', 'system', lang(player.lang, `ErrorMessage`, { target: target.info.username }), 'system');

		mp.chat.sendStaffMessageToAll({
			systemId: 'cmdLangs:unmute',
			messageId: 'Message',
			permission: 'cmds.mute',
			args: () => ({
				target: target.info.username,
				player: player.info.username,
				reason
			})
		});

		if (target.checkPermission('cmds.mute') === false) {
			target.sendStaffMessage(
				lang(target.lang, `Message`, {
					target: target.info.username,
					player: player.info.username,
					reason
				})
			);
		}

		player.createAmplitudeEvent('Unmuted player', { target: target.info.username, reason });
		target.createAmplitudeEvent('Unmuted', { actioner: player.info.username, reason });

		target.saveInfo({ muteMinutes: 0 });
	}
});

mp.commands.addCommand({
	name: 'slap',
	permission: 'cmds.slap',
	defineLangs: {
		Announcement: {
			EN: ({ admin, target, power }) => `${admin} slapped ${target} with power x${power}.`,
			RO: ({ admin, target, power }) => `${admin} i-a dat slap lui ${target} cu puterea x${power}.`
		},
		InvalidMessage: {
			EN: () => 'The value is not a valid number.',
			RO: () => 'Valoarea nu este un numar valid.'
		}
	},
	args: {
		target: 'player',
		power: 'number'
	},
	handler: (player, { target, power }, lang) => {
		if (power < 1 || power > 100) return player.sendErrorMessage('Server', 'system', lang(player.lang, `InvalidMessage`), 'system');

		mp.chat.sendStaffMessageToAll({
			systemId: 'cmdLangs:slap',
			permission: 'cmds.slap',
			messageId: 'Announcement',
			args: () => ({
				admin: player.info.username,
				target: target.info.username,
				power
			})
		});

		if (target.vehicle) {
			target.vehicle.setPositionPatched(new mp.Vector3({ ...target.vehicle.position, z: target.vehicle.position.z + power }));
		} else {
			target.position = new mp.Vector3({ ...target.position, z: target.position.z + power });
		}
		target.createAmplitudeEvent('Slapped', { actioner: player.info.username, power });
		player.createAmplitudeEvent('Slapped player', { target: target.info.username, power });
	}
});

mp.commands.addCommand({
	name: 'warn',
	permission: 'cmds.warn',
	defineLangs: {
		Message: {
			EN: ({ admin, reason }) => `${admin} gave you a warn for ${reason}.`,
			RO: ({ admin, reason }) => `${admin} ti-a dat un avertisment pentru ${reason}.`
		},
		ReasonLengthError: {
			EN: `Your reason is too long, maximum characters permitted is 128.`,
			RO: `Motiv-ul este prea lung, numărul maxim de caractere este de 128.`
		},
		Announcement: {
			EN: ({ admin, target, reason }) => `${admin} gave ${target} a warn for ${reason}`,
			RO: ({ admin, target, reason }) => `${admin} i-a dat lui ${target} un avertisment pentru ${reason}`
		},
		BanHeading: {
			EN: `You're banned`,
			RO: `Ai fost banned`
		},
		BanMessage: {
			EN: () => `You've been banned for a month because you've reached the maximum of 3 warns in total.`,
			RO: () => `Ai primit ban pentru o lună întreagă pentru că ai atins maximul de 3 puncte de warns în total.`
		},
		invalidTarget: {
			EN: () => "You can't use this command on yourself.",
			RO: () => 'Nu poti folosii aceasta comanda pe tine.'
		},
		errorMessage: {
			EN: () => "You can't warn an admin.",
			RO: () => 'Nu poti da warn unui admin.'
		}
	},
	args: {
		target: 'player',
		reason: 'fullText'
	},
	handler: (player, { target, reason }, lang) => {
		if (target === player) return player.sendErrorMessage('Server', 'system', lang(player.lang, `invalidTarget`), 'system');

		if (target.getAdminLevel() >= 1) return player.sendErrorMessage('Server', 'system', lang(player.lang, `errorMessage`), 'system');

		if (reason.length > 128) return player.sendErrorMessage('Server', 'system', lang(player.lang, 'ReasonLengthError'), 'system');

		mp.chat.sendStaffMessageToAll({
			systemId: 'cmdLangs:warn',
			messageId: 'Announcement',
			permission: 'cmds.warn',
			args: () => ({
				admin: player.info.username,
				target: target.info.username,
				reason
			})
		});

		if (target.checkPermission('cmds.warn') === false) {
			target.sendStaffMessage(
				lang(target.lang, 'Message', {
					admin: player.info.username,
					reason
				})
			);
		}

		const currentExpireDate = target.info.warnsExpireAt ? moment(target.info.warnsExpireAt) : moment();
		target.info.warnsExpireAt = currentExpireDate.add(7, 'months').toDate();
		const actualWarns = target.info.warns;
		target.giveWarn();
		target.saveInfo({ warns: target.info.warns, warnsExpireAt: currentExpireDate.toDate() });

		player.createAmplitudeEvent('Warned player', { target: target.info.username, reason, warnsExpireAt: currentExpireDate, actualWarns });
		target.createAmplitudeEvent('Warned', { actioner: target.info.username, reason, warnsExpireAt: currentExpireDate, actualWarns });

		// Ban
		if (target.info.warns === 3) {
			target.banAccount(player.info.username, 'Warn 3/3', 30);

			target.kickDelayed(lang(target.lang, 'BanHeading'), lang(target.lang, 'BanMessage'), 50);

			target.createAmplitudeEvent('Banned player', { actioner: player.info.username, reason: 'Warn 3/3', time: `30 days`, from: 'game' });
		}
	}
});

mp.commands.addCommand({
	name: 'unwarn',
	permission: 'cmds.unwarn',
	defineLangs: {
		Message: {
			EN: ({ admin }) => `${admin} removed a warning point from your account.`,
			RO: ({ admin }) => `${admin} ti-a sters un punct de avertisment de pe cont.`
		},
		Announcement: {
			EN: ({ admin, target }) => `${admin} removed a warn from ${target}.`,
			RO: ({ admin, target }) => `${admin} a șters un punct de avertisment lui ${target}`
		},
		ReasonLengthError: {
			EN: `Your reason is too long, maximum characters permitted is 128.`,
			RO: `Motiv-ul este prea lung, numărul maxim de caractere este de 128.`
		},
		NoWarnsError: {
			EN: ({ target }) => `Player ${target} has no warns`,
			RO: ({ target }) => `Jucătorul ${target} nu are puncte de avertisment.`
		}
	},
	args: {
		target: 'player',
		reason: 'fullText'
	},
	handler: (player, { target, reason }, lang) => {
		if (target.info.warns === 0) return player.sendErrorMessage('Server', 'system', lang(player.lang, 'NoWarnsError', { target: target.info.username }), 'system');
		if (reason.length > 128) return player.sendErrorMessage('Server', 'system', lang(player.lang, 'ReasonLengthError'), 'system');

		mp.chat.sendStaffMessageToAll({
			systemId: 'cmdLangs:unwarn',
			messageId: 'Announcement',
			permission: 'cmds.unwarn',
			args: () => ({
				admin: player.info.username,
				target: target.info.username
			})
		});

		if (target.checkPermission('cmds.unwarn') === false) {
			target.sendStaffMessage(
				lang(target.lang, 'Message', {
					admin: player.info.username,
					target: target.info.username
				})
			);
		}

		target.removeWarn();

		let removedExpireWarn: ExpectedAny = moment(target.info.warnsExpireAt).add(-7, 'months');
		if (removedExpireWarn.diff(moment()).toString().includes('-')) {
			removedExpireWarn = null;
		}
		target.saveInfo({ warns: target.info.warns, warnsExpireAt: removedExpireWarn });
		player.createAmplitudeEvent('Removed warn', { target: target.info.username, newRemoveExpireWarn: removedExpireWarn ? removedExpireWarn : 'no time', reason });
		target.createAmplitudeEvent('Warn removed', { actioner: target.info.username, newRemoveExpireWarn: removedExpireWarn ? removedExpireWarn : 'no time', reason });
	}
});

mp.commands.addCommand({
	name: 'ban',
	permission: 'cmds.ban',
	defineLangs: {
		Announcement: {
			EN: ({ admin, target, time, reason }) => `${admin} banned ${target} for ${time} days, reason: ${reason}.`,
			RO: ({ admin, target, time, reason }) => `${admin} l-a banat pe ${target} pentru ${time} zile, motiv: ${reason}.`
		},
		Heading: {
			EN: `You're banned`,
			RO: `Ai fost banned`
		},
		Message: {
			EN: ({ admin, time, reason }) => `You were banned by ${admin} for ${time} days. {BR} Reason: ${reason}`,
			RO: ({ admin, time, reason }) => `Ai fost banat de catre admin-ul ${admin} pentru ${time} zile. {BR} Motiv: ${reason}.`
		}
	},
	args: {
		target: 'player',
		time: 'number',
		reason: 'fullText'
	},
	handler: (player, { target, time, reason }, lang) => {
		mp.chat.sendStaffMessageToAll({
			systemId: 'cmdLangs:ban',
			messageId: 'Announcement',
			permission: 'game.staffMessages',
			args: () => ({
				admin: player.info.username,
				target: target.info.username,
				time,
				reason
			})
		});

		target.banAccount(player.info.username, reason, time);

		target.kickDelayed(lang(target.lang, 'Heading'), lang(target.lang, 'Message', { admin: player.info.username, time, reason }), 50);

		player.createAmplitudeEvent(`Banned player`, { target: target.info.username, reason, time: `${time} days`, from: 'game' });
		target.createAmplitudeEvent('Banned', { actioner: player.info.username, reason, time: `${time} days`, from: 'game' });
	}
});

mp.commands.addCommand({
	name: 'spectate',
	aliases: ['spec'],
	permission: 'cmds.spectate',
	defineLangs: {
		Announcement: {
			EN: ({ admin, target }) => `${admin} started spectating ${target}`,
			RO: ({ admin, target }) => `${admin} a inceput sa ii dea spectate lui ${target}`
		},
		TargetError: {
			EN: `You can't use this command on yourself`,
			RO: `Nu poți folosi aceasta comandă pe tine insuți.`
		},
		TargetIsInSpectateMode: {
			EN: ({ target }) => `Player ${target} is in spectate mode.`,
			RO: ({ target }) => `Jucătorul ${target} este in mod spectate.`
		},
		VehicleError: {
			EN: `You can't use this command while you driving.`,
			RO: `Nu poti folosi aceasta comanda in timp ce conduci.`
		},
		GhostmodeTarget: {
			EN: `You can't use this command while your target is in ghostmode.`,
			RO: `Nu poti folosi aceasta comanda cand jucatorul este in ghostmode.`
		}
	},
	args: {
		target: 'player'
	},
	handler: (player, { target }, lang) => {
		if (target === player) return player.sendErrorMessage('Server', 'system', lang(player.lang, 'TargetError'), 'system');
		if (target.vars.spectating) return player.sendErrorMessage('Server', 'system', lang(player.lang, 'TargetIsInSpectateMode', { target: target.info.username }), 'system');
		if (player.vehicle) return player.sendErrorMessage('Server', 'system', lang(player.lang, 'VehicleError'), 'system');
		if (target.vars.isInGhostmode) return player.sendErrorMessage('Server', 'system', lang(player.lang, 'GhostmodeTarget'), 'system');

		mp.chat.sendStaffMessageToAll({
			systemId: 'cmdLangs:spectate',
			messageId: 'Announcement',
			permission: 'cmds.spectate',
			args: () => ({
				target: target.info.username,
				admin: player.info.username
			})
		});

		player.updateVars({
			spectating: target.info.username,
			godmode: true
		});

		player.triggerClientEvent('setGodmode', { toggle: true });

		player.resetInteriorVarsOnTeleport();
		player.alpha = 0;
		player.vars.lastRecoverablePosition = new mp.Vector3(player.position);
		player.position = new mp.Vector3(target.position);
		player.triggerClientEvent('spectatePlayer', { type: true, targetId: target.id });

		player.createAmplitudeEvent('Spectated player', { target: target.info.username });
		target.createAmplitudeEvent('Spectated', { actioner: player.info.username });
	}
});

mp.commands.addCommand({
	name: 'spectateoff',
	aliases: ['specoff', 'unspec'],
	permission: 'cmds.spectate',
	defineLangs: {
		NoSpectate: {
			EN: `You are not a spectator of any player`,
			RO: `Nu eşti spectator pe nici un jucător.`
		}
	},
	handler: (player, _, lang) => {
		if (!player.vars.spectating) return player.sendErrorMessage('Server', 'system', lang(player.lang, 'NoSpectate'), 'system');

		player.updateVars({
			spectating: null,
			godmode: false
		});

		player.triggerClientEvent('setGodmode', { toggle: false });

		player.alpha = 255;
		player.triggerClientEvent('spectatePlayer', { type: false, targetId: null });
		player.position = new mp.Vector3(player.vars.lastRecoverablePosition);

		player.createAmplitudeEvent('Spectate mode off');
	}
});
