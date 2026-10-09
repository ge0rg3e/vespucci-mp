import { getNativeWeapon } from '@server/natives/weapons/components/core';

mp.commands.addCommand({
	name: 'giveweapon',
	aliases: ['gw'],
	permission: 'cmds.giveweapon',
	defineLangs: {
		Announcement: {
			EN: ({ admin, target, weapon, bullets }) => `${admin} gave ${target} a ${weapon} with ${bullets} bullets.`,
			RO: ({ admin, target, weapon, bullets }) => `${admin} i-a dat un ${weapon} lui ${target} cu ${bullets} gloante.`
		},
		TargetMessage: {
			EN: ({ admin }) => `You received a gun from  ${admin}.`,
			RO: ({ admin }) => `Ai primit o arma de la ${admin}.`
		},
		InvalidWeaponId: {
			EN: ({ model }) => `${model} is not a valid weapon id.`,
			RO: ({ model }) => `${model} nu este un id de arma valid.`
		},
		InvalidAmmo: {
			EN: 'The maximum number of bullets you can give must be a number between 1 and 1000.',
			RO: 'Numarul maxim de gloante pe care le poti da trebuie sa fie un numar intre 1 si 1000.'
		},
		NoAvailableWeaponSlot: {
			EN: `This player doesn't have any available weapon slots in his inventory.`,
			RO: 'Acest jucător nu are slot-uri de armă libere în Inventar.'
		}
	},
	args: {
		target: 'player',
		weaponId: 'number',
		ammo: 'number'
	},
	handler: (player, { target, weaponId, ammo }, lang) => {
		const weapon = getNativeWeapon({ id: weaponId });
		if (!weapon) return player.sendErrorMessage('Server', 'system', lang(player.lang, 'InvalidWeaponId', { weaponId }), 'system');

		if (ammo > 1000 || ammo < 1) return player.sendErrorMessage('Server', 'system', lang(player.lang, `InvalidAmmo`), 'system');

		mp.chat.sendStaffMessageToAll({
			systemId: 'cmdLangs:giveweapon',
			permission: 'cmds.giveweapon',
			messageId: 'Announcement',
			args: () => ({ admin: player.info.username, target: target.info.username, weapon: weapon.displayName, bullets: ammo })
		});

		if (target.checkPermission('cmds.giveweapon') === false) {
			target.sendAdminMessage('Server', 'staff', lang(target.lang, 'TargetMessage', { admin: player.info.username }), 'system');
		}

		// Get free weapon slot
		const weaponSlot = target.getAvailableWeaponSlot();

		// If weapon slot is not available
		if (!weaponSlot) return player.sendErrorMessage('Server', 'system', lang(player.lang, 'NoAvailableWeaponSlot'), 'system');

		//Set the weapon on the player.
		target.setWeapon(
			weapon.id,
			weaponSlot,
			{
				ammo: ammo
			},
			{ forceInHand: true }
		);

		target.createAmplitudeEvent('Received weapon', { target: target.info.username, weapon: weapon.displayName, bullets: ammo });
		player.createAmplitudeEvent('Gave weapon', { actioner: player.info.username, weapon: weapon.displayName, bullets: ammo });

		return true;
	}
});

mp.commands.addCommand({
	name: 'takeweapons',
	permission: 'cmds.takeweapons',
	defineLangs: {
		Announcement: {
			EN: ({ admin, target }) => `${admin} took all of ${target}'s weapons.`,
			RO: ({ admin, target }) => `${admin} i-a luat toate armele lui ${target}.`
		},
		TargetMessage: {
			EN: ({ admin }) => `You received a gun from ${admin}.`,
			RO: ({ admin }) => `Ai primit o arma de la ${admin}.`
		}
	},
	args: {
		target: 'player'
	},
	handler: (player, { target }, lang) => {
		mp.chat.sendStaffMessageToAll({
			systemId: 'cmdLangs:takeweapons',
			messageId: 'Announcement',
			permission: 'cmds.giveweapon',
			args: () => ({ admin: player.info.username, target: target.info.username })
		});

		if (target.checkPermission('cmds.giveweapon') === false) {
			target.sendAdminMessage('Server', 'staff', lang(target.lang, 'TargetMessage', { admin: player.info.username }), 'system');
		}

		target.removeWeapons();

		target.createAmplitudeEvent('Guns removed', { actioner: player.info.username });
		player.createAmplitudeEvent('Removed guns of player', { target: target.info.username });
	}
});

// For testing duh
mp.commands.addCommand({
	name: 'testweapons',
	handler: (player, lang) => {
		if (!player.getAdminLevel()) return false;

		// Remove any weapons first.
		player.removeWeapons();

		const freeSlot = player.getAvailableWeaponSlot();
		if (!freeSlot) return false;

		// Give him a pistol with components.
		player.setWeapon(
			20,
			1,
			{
				ammo: 250,
				tint: 22, // db id 3
				components: [43, 55, 61] // components ids from db.
			},
			{ forceInHand: true }
		);

		player.setWeapon(10, 2, {
			ammo: 1,
			tint: 0,
			components: [18] // components ids from db.
		});

		player.setWeapon(62, 3, {
			ammo: 250,
			tint: 499,
			components: [370, 371, 372, 376] // components ids from db.
		});

		player.sendServerMessage('Server', 'general', 'Check your inventory now.', 'local');
	}
});
