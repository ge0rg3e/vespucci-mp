import { rentingLocations } from './core';

mp.commands.addCommand({
	name: 'rentid',
	aliases: ['rid', 'gotorent'],
	permission: `cmds.rentid`,
	defineLangs: {
		InvalidId: {
			EN: `Invalid renting location id.`,
			RO: `Id-ul renting location este invalid.`
		},
		TeleportedTo: {
			EN: ({ id }) => `Teleported to the renting location id ${id} `,
			RO: ({ id }) => `Ai fost teleportat la renting location id ${id} `
		}
	},
	args: {
		id: 'number'
	},
	handler: async (player, { id }, lang) => {
		const location = rentingLocations.find((r) => r.id === id);
		if (!location) return player.sendErrorMessage('Server', 'system', lang(player.lang, 'InvalidId'), 'system');
		player.sendAdminMessage('Server', 'system', lang(player.lang, 'TeleportedTo', { id: id }), 'system');
		player.resetInteriorVarsOnTeleport();
		player.position = location.pickupCoords;
		player.dimension = 0;
	}
});
