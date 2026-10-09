// commands meant only for local testing.

if (process.env.ENVIRONMENT === 'local') {
	mp.commands.addCommand({
		name: 'loadipl',
		args: {
			name: 'string'
		},
		defineLangs: {
			successMessage: {
				EN: ({ name }) => `You loaded ipl "${name}".`,
				RO: ({ name }) => `Ai dat load la IPL "${name}"`
			}
		},
		handler: (player, { name }, lang) => {
			player.triggerClientEvent(`loadIpls`, { ipls: [name] });
			player.sendAdminMessage('Server', 'system', lang(player.lang, 'successMessage', { name }), 'system');
		}
	});

	mp.commands.addCommand({
		name: 'removeipl',
		args: {
			name: 'string'
		},
		defineLangs: {
			successMessage: {
				EN: ({ name }) => `You removed ipl "${name}".`,
				RO: ({ name }) => `Ai dat removed la IPL "${name}"`
			}
		},
		handler: (player, { name }, lang) => {
			player.triggerClientEvent(`removeIpls`, { ipls: [name] });
			player.sendAdminMessage('Server', 'system', lang(player.lang, 'successMessage', { name }), 'system');
		}
	});

	mp.commands.addCommand({
		name: 'ctt',
		args: {
			name: 'string'
		},
		defineLangs: {
			successMessage: {
				EN: ({ name }) => `You're now seeing timecycle "${name}".`,
				RO: ({ name }) => `Acum vezi timecycle "${name}"`
			}
		},
		handler: (player, { name }, lang) => {
			if (name === 'reset') {
				name = 'normal';
			}

			player.triggerClientEvent(`setTimecycleModifier`, { val: name });
			player.sendAdminMessage('Server', 'system', lang(player.lang, 'successMessage', { name }), 'system');
		}
	});

	mp.commands.addCommand({
		name: 'csse',
		args: {
			name: 'string',
			seconds: 'number',
			looped: 'string'
		},
		defineLangs: {
			successMessage: {
				EN: ({ name, seconds, looped }) => `You're now testing screen effects "${name}", ${seconds} seconds, looped: ${looped}`,
				RO: ({ name, seconds, looped }) => `Acum vezi screen effect "${name}", ${seconds} seconds, looped: ${looped}`
			}
		},
		handler: (player, { name, seconds, looped }, lang) => {
			player.triggerClientEvent(`startScreenEffect`, { val: name, seconds, looped: looped === 'true' ? true : false });
			player.sendAdminMessage('Server', 'system', lang(player.lang, 'successMessage', { name, seconds, looped }), 'system');
		}
	});

	mp.commands.addCommand({
		name: 'test_alerts',
		handler: (player) => {
			['success', 'info', 'warning', 'error'].forEach((type: ExpectedAny) =>
				player.alert({
					type,
					message: 'lorem ipsum solus messagus'
				})
			);
		}
	});

	mp.commands.addCommand({
		name: 'test_progressbar',
		handler: (player) => {
			// Show progress bar..
			player.showProgressBar('Lorem ipsum', 15);
		}
	});

	mp.commands.addCommand({
		name: 'test_toasts',
		handler: (player) => {
			['success', 'info', 'warning', 'error'].forEach((type: ExpectedAny) =>
				player.toast({
					type,
					message: 'lorem ipsum solus messagus'
				})
			);
		}
	});

	mp.commands.addCommand({
		name: 'phone_notifications',
		handler: (player) => {
			Array(5)
				.fill(null)
				.forEach(() => player.sendPhoneNotification('Test notification', 'lorem ipsum solus messagus', 'Dev command'));
		}
	});

	mp.commands.addCommand({
		name: 'weaponcomponent',
		args: {
			weaponComponentId: 'number'
		},
		defineLangs: {},
		handler: (player, { weaponComponentId }) => {
			player.giveItem(27, 1, {
				weaponComponentId: Number(weaponComponentId)
			});
		}
	});
}
