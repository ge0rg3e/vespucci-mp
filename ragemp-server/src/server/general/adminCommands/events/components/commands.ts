import { getVehicleNativeInfo } from '@server/natives/vehicles/components/core';
import { getNativeWeapon } from '@server/natives/weapons/components/core';
import { getLanguagePack } from '@vmp/i18n';

let eventTeleportation = {
	pos: new mp.Vector3(0, 0, 0),
	enabled: false
};

mp.events.add('loadPlayerDefaults', (player) => {
	player.updateVars({
		eventMuted: false
	});
});

mp.commands.addCommand({
	name: 'serverannounce',
	aliases: ['sa'],
	permission: 'cmds.serverannounce',
	args: {
		text: 'fullText'
	},
	defineLangs: {
		Message: {
			EN: ({ text }) => `{fd9644}(( ${text} ))`,
			RO: ({ text }) => `{fd9644}(( ${text} ))`
		}
	},
	handler: (player, { text }) => {
		mp.chat.sendChatMessageToAll({
			channel: 'general',
			sender: () => {
				const rank = player.getPrimaryGroupTitle({ scope: 'singular', meta: { includeLevel: true } });
				return `${rank} ${player.info.username}`;
			},
			type: (target) => mp.chat.getMessageType('global', target.lang),
			content: (target) => {
				// Get lang
				const lang = getLanguagePack('cmdLangs:serverannounce', target.lang);

				return {
					type: 'text',
					data: lang.get(`Message`, { text })
				};
			}
		});

		player.createAmplitudeEvent('Used server announce', { text });
	}
});

const validAeEventNames = ['mute', 'unmute', 'freeze', 'unfreeze', 'tpallhere', 'jointp', 'giveweapon', 'veh', 'health', 'armour', 'freeze', 'unfreeze', 'countdown'];

mp.commands.addCommand({
	name: `aevent`,
	aliases: ['ae'],
	permission: 'cmds.aevent',
	args: {
		eventName: 'string',
		weaponId: 'number',
		ammo: 'number',
		vehicleModel: 'string',
		value: 'number',
		range: 'number'
	},
	argsRequired: {
		weaponId: ([eventName]) => eventName === 'giveweapon',
		ammo: ([eventName]) => eventName === 'giveweapon',
		vehicleModel: ([eventName]) => eventName === 'veh',
		value: ([eventName]) => [`health`, `armour`, 'countdown'].includes(eventName),
		range: ([eventName]) => validAeEventNames.includes(eventName) && ![`tpallhere`, `jointp`].includes(eventName),
		SyntaxExampleMessage: ([eventName]) => validAeEventNames.includes(eventName) // Asta e ceva nou. E un hack around. CA sa fac acel syntax example message mai jos sa apara DOAR cand nu au scris primul arg.
	},
	defineLangs: {
		SyntaxExampleMessage: {
			EN: `Valid event names: ${validAeEventNames.join(', ')}`,
			RO: `Evenimente valide: ${validAeEventNames.join(', ')}`
		},

		JoinTp: {
			EN: ({ admin, toggle }) => `${admin} ${toggle ? 'stopped join teleport' : 'started join teleport for the event.'}`,
			RO: ({ admin, toggle }) => `${admin} a ${toggle ? 'oprit join teleport' : 'pornit join teleport pentru eveniment.'}`
		},

		TpAllHere: {
			EN: ({ admin }) => `You were teleported by admin ${admin} to the event.`,
			RO: ({ admin }) => `Ai fost teleportat de adminul ${admin} la event.`
		},

		InvalidWeapon: {
			EN: ({ model }) => `${model} is not a valid weapon model.`,
			RO: ({ model }) => `${model} nu este un model de arma valid.`
		},

		InvalidAmmo: {
			EN: 'The maximum number of bullets you can give must be a number between 1 and 250.',
			RO: 'Numarul maxim de gloante pe care le poti da trebuie sa fie un numar intre 1 si 250.'
		},

		InvalidVehicle: {
			EN: ({ model }) => `${model} is not a valid vehicle model.`,
			RO: ({ model }) => `${model} nu este un model de masina valid.`
		},
		ReceivedCountdown: {
			EN: ({ admin, value }) => `${admin} started a countdown of ${value} seconds for everyone.`,
			RO: ({ admin, value }) => `${admin} a inceput o numărătoare inversă de ${value} secunde pentru toți.`
		},
		ReceivedMute: {
			EN: ({ admin, toggle }) => `You received ${toggle ? 'mute' : 'unmute'} from ${admin} ${!toggle ? '' : 'during the event'}.`,
			RO: ({ admin, toggle }) => `Ai primit ${toggle ? 'mute' : 'unmute'} de la ${admin} ${!toggle ? '' : 'pe durata evenimentului'}.`
		},

		ReceivedFreeze: {
			EN: ({ admin, toggle }) => `You received ${toggle ? 'freeze' : 'unfreeze'} from ${admin} during the event.`,
			RO: ({ admin, toggle }) => `Ai primit ${toggle ? 'freeze' : 'unfreeze'} de la ${admin} pe durata evenimentului.`
		},

		ReceivedHealth: {
			EN: ({ admin, value }) => `You received ${value} health from ${admin}.`,
			RO: ({ admin, value }) => `Ai primit ${value} health de la ${admin}.`
		},

		ReceivedArmour: {
			EN: ({ admin, value }) => `You received ${value} armour from ${admin}.`,
			RO: ({ admin, value }) => `Ai primit ${value} armura de la ${admin}.`
		},

		ReceivedGodmode: {
			EN: ({ admin, toggle }) => (toggle ? `You received godmode from ${admin}.` : `${admin} took your godmode out.`),
			RO: ({ admin, toggle }) => (toggle ? `Ai primit godmode de la ${admin}.` : `${admin} ti-a scos godmodeul.`)
		},

		ReceivedVehicle: {
			EN: ({ admin, model }) => `You received a vehicle ${model} from ${admin}.`,
			RO: ({ admin, model }) => `Ai primit un vehicul ${model} de la ${admin}.`
		},

		ReceivedWeapon: {
			EN: ({ admin, model, bullets }) => `You received a weapon ${model} with ${bullets} bullets from ${admin}.`,
			RO: ({ admin, model, bullets }) => `Ai primit o arma ${model} cu ${bullets} gloante de la ${admin}.`
		}
	},
	handler: (player, { eventName, ...otherArgs }, lang) => {
		if (!validAeEventNames.includes(eventName)) return player.sendErrorMessage('Server', 'system', lang(player.lang, `SyntaxExampleMessage`), 'system');

		if (eventName === 'tpallhere') {
			mp.players.forEachLoggedIn((entity: PlayerMp) => {
				if (entity.dimension !== player.dimension) return;

				entity.updateVars({
					houseEntered: null,
					garageEntered: null
				});

				entity.position = player.position;
				entity.dimension = player.dimension;

				entity.sendAdminMessage('Server', 'system', lang(entity.lang, `TpAllHere`, { admin: player.info.username }), 'system');

				return true;
			});

			return true;
		}

		if (eventName === 'jointp') {
			mp.chat.sendStaffMessageToAll({
				systemId: 'cmdLangs:aevent',
				messageId: 'JoinTp',
				permission: 'cmds.aevent',
				args: () => ({ admin: player.info.username, toggle: eventTeleportation.enabled })
			});

			eventTeleportation = { pos: eventTeleportation.enabled ? new mp.Vector3(0, 0, 0) : player.position, enabled: !eventTeleportation.enabled };

			return true;
		}

		if (eventName === 'mute') {
			mp.players.forEachLoggedInRange(player.position, otherArgs.range, (entity: PlayerMp) => {
				if (entity.dimension !== player.dimension) return;

				entity.updateVars({
					eventMuted: true
				});

				entity.sendAdminMessage('Server', 'system', lang(entity.lang, `ReceivedMute`, { admin: player.info.username, toggle: true }), 'system');
			});

			return true;
		}

		if (eventName === 'unmute') {
			mp.players.forEachLoggedInRange(player.position, otherArgs.range, (entity: PlayerMp) => {
				if (entity.dimension !== player.dimension) return;

				entity.updateVars({
					eventMuted: false
				});

				entity.sendAdminMessage('Server', 'system', lang(entity.lang, `ReceivedMute`, { admin: player.info.username, toggle: false }), 'system');
			});

			return true;
		}

		if (eventName === 'giveweapon') {
			const weapon = getNativeWeapon({ id: otherArgs.weaponId });

			if (!weapon) return player.sendErrorMessage('Server', 'system', lang(player.lang, `InvalidWeapon`, { model: otherArgs.weapon }), 'system');
			if (otherArgs.ammo > 250 || otherArgs.ammo < 1) return player.sendErrorMessage('Server', 'system', lang(player.lang, `InvalidAmmo`), 'system');

			mp.players.forEachLoggedInRange(player.position, otherArgs.range, (entity: PlayerMp) => {
				if (entity.dimension !== player.dimension) return;

				// Do they have free weapon slots?
				const availableSlot = entity.getAvailableWeaponSlot();
				if (!availableSlot) return; // They don't have an available slot.

				// Give weapon
				entity.setWeapon(
					weapon.id,
					availableSlot,
					{
						ammo: otherArgs.ammo,
						meta: {
							// This weapon will be deleted when the player removes it.
							destroyOnRemove: true
						}
					},
					{
						forceInHand: true
					}
				);

				entity.sendAdminMessage('Server', 'system', lang(entity.lang, `ReceivedWeapon`, { admin: player.info.username, model: weapon.displayName, bullets: otherArgs.ammo }), 'system');
			});

			return true;
		}

		if (eventName === 'veh') {
			const vehicleModel = getVehicleNativeInfo({ model: otherArgs.vehicleModel, displayName: otherArgs.vehicleModel });
			if (vehicleModel === null) return player.sendErrorMessage('Server', 'system', lang(player.lang, `InvalidVehicle`, { model: otherArgs.vehicleModel }), 'system');

			mp.players.forEachLoggedInRange(player.position, otherArgs.range, (entity: PlayerMp) => {
				if (entity.dimension !== player.dimension) return;

				const veh = mp.vehicles.createVehicle(
					vehicleModel.model,
					vehicleModel.hash,
					entity.position,
					{},
					{
						temporary: true,
						fuel: vehicleModel.carTank
					}
				);

				entity.putIntoVehicle(veh, 0);
				entity.sendAdminMessage(
					'Server',
					'system',
					lang(entity.lang, `ReceivedVehicle`, { admin: player.info.username, model: vehicleModel.model, displayName: vehicleModel.displayName }),
					'system'
				);
			});

			return true;
		}

		if (eventName === 'health') {
			mp.players.forEachLoggedInRange(player.position, otherArgs.range, (entity: PlayerMp) => {
				if (entity.dimension !== player.dimension) return;

				entity.health = otherArgs.value;

				entity.sendAdminMessage('Server', 'system', lang(entity.lang, `ReceivedHealth`, { admin: player.info.username, value: otherArgs.value }), 'system');
			});

			return true;
		}

		if (eventName === 'armour') {
			mp.players.forEachLoggedInRange(player.position, otherArgs.range, (entity: PlayerMp) => {
				if (entity.dimension !== player.dimension) return;

				entity.armour = otherArgs.value;

				entity.sendAdminMessage('Server', 'system', lang(entity.lang, `ReceivedArmour`, { admin: player.info.username, value: otherArgs.value }), 'system');
			});

			return true;
		}

		if (eventName === 'freeze') {
			mp.players.forEachLoggedInRange(player.position, otherArgs.range, (entity: PlayerMp) => {
				if (entity.dimension !== player.dimension) return;

				entity.freeze({ systemId: 'cmdLangs:aevent', toggle: true });

				entity.sendAdminMessage('Server', 'system', lang(entity.lang, `ReceivedFreeze`, { admin: player.info.username, toggle: true }), 'system');
			});

			return true;
		}

		if (eventName === 'unfreeze') {
			mp.players.forEachLoggedInRange(player.position, otherArgs.range, (entity: PlayerMp) => {
				if (entity.dimension !== player.dimension) return;

				entity.freeze({ systemId: 'cmdLangs:aevent', toggle: false });

				entity.sendAdminMessage('Server', 'system', lang(entity.lang, `ReceivedFreeze`, { admin: player.info.username, toggle: false }), 'system');
			});

			return true;
		}

		if (eventName === 'countdown') {
			mp.players.forEachLoggedInRange(player.position, otherArgs.range, (entity: PlayerMp) => {
				if (entity.dimension !== player.dimension) return;
				entity.sendAdminMessage('Server', 'system', lang(entity.lang, `ReceivedCountdown`, { admin: player.info.username, value: otherArgs.value }), 'system');
				entity.triggerClientEvent('showCountdownTimer', { number: otherArgs.value });
			});

			return true;
		}
	}
});

mp.commands.addCommand({
	name: 'gotoevent',

	defineLangs: {
		eventUnavailable: {
			EN: 'There are no active events.',
			RO: 'Nu există niciun event activ.'
		}
	},
	handler: (player, _, lang) => {
		if (!eventTeleportation.enabled) return player.sendErrorMessage('Server', 'system', lang(player.lang, `eventUnavailable`), 'system');

		player.resetInteriorVarsOnTeleport();
		player.position = eventTeleportation.pos;
	}
});

const validGtaValues = ['cash', 'payday', 'experience'];

mp.commands.addCommand({
	name: `givetoall`,
	aliases: 'gta',
	permission: 'cmds.givetoall',
	args: {
		valueName: 'string',
		value: 'number'
	},
	argsRequired: {
		value: ([valueName]) => [`cash`, `experience`].includes(valueName)
	},
	defineLangs: {
		SyntaxExampleMessage: {
			EN: `Values: ${validGtaValues.join(', ')}`,
			RO: `Valori: ${validGtaValues.join(', ')}`
		},

		GiveCash: {
			EN: ({ admin, value }) => `${admin} gave $${value} to everyone online on the server.`,
			RO: ({ admin, value }) => `${admin} a dat $${value} la toti jucatorii online.`
		},

		GivePayDay: {
			EN: ({ admin }) => `${admin} has given to everyone on this server their payday.`,
			RO: ({ admin }) => `${admin} a dat la toti jucatorii online un payday.`
		},

		GiveExperience: {
			EN: ({ admin, value }) => `${admin} gave ${value} experience to everyone online on the server.`,
			RO: ({ admin, value }) => `${admin} a dat ${value} experienta la toti jucatorii online.`
		}
	},
	handler: (player, { valueName, value }, lang) => {
		if (!validGtaValues.includes(valueName)) return player.sendErrorMessage('Server', 'system', lang(player.lang, `SyntaxExampleMessage`), 'system');

		mp.players.forEachLoggedIn((entity: PlayerMp) => {
			if (valueName === 'cash') {
				entity.giveMoney(value);

				entity.sendAdminMessage('Server', 'system', lang(entity.lang, `GiveCash`, { admin: player.info.username, value }), 'system');
			}

			if (valueName === 'payday') {
				mp.events.call('Payday', entity);

				entity.sendAdminMessage('Server', 'system', lang(entity.lang, `GivePayDay`, { admin: player.info.username }), 'system');
			}

			if (valueName === 'experience') {
				entity.giveExperience(value);

				entity.sendAdminMessage('Server', 'system', lang(entity.lang, `GiveExperience`, { admin: player.info.username, value }), 'system');
			}
		});
	}
});

declare global {
	interface PlayerVariables {
		eventMuted: boolean;
	}
}

export {};
