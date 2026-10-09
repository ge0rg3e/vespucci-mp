mp.items.create({
	id: 1,
	name: {
		EN: `Easter egg`,
		RO: `Ouă de paște`
	},
	description: {
		EN: `Just an event item.`,
		RO: `Doar un simplu item de eveniment.`
	},
	callbacks: {
		use: (player, { data }) => {
			player.reduceItem(data.id, 1);
			player.toast({ type: 'success', message: `Used an easter egg` });
		}
	}
});
