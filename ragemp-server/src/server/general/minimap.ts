mp.commands.addCommand({
	name: 'setminimapoffset',
	args: {
		value: 'float'
	},
	handler: (player, { value }) => {
		player.sendClientMessage(`Server`, 'system', `You set your own minimap offset to ${value}`, 'system');
		player.triggerClientEvent(`minimap:setOffset`, { value });
	}
});
