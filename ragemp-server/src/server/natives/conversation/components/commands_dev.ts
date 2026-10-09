import * as rpc from 'rage-rpc';

// commands meant only for local testing.

if (process.env.ENVIRONMENT !== 'production') {
	mp.commands.addCommand({
		name: 'conversation_monologue',
		handler: (player) => {
			player.showConversation({
				type: 'monologue',
				id: 'test_conversation_monologue',
				heading: 'Generated Monologue',
				contents: [
					'Hello, this is a generated monologue for your test conversation.',
					'I hope it serves the purpose of testing the monologue functionality.',
					'Feel free to modify and use it as needed for your application.',
					'Testing different scenarios and interactions is crucial for a smooth user experience.',
					'If you have any specific requirements, feel free to let me know!'
				]
			});
		}
	});

	mp.commands.addCommand({
		name: 'conversation_interactive',
		handler: (player) => {
			player.showConversation({
				type: 'interactive',
				id: 'test_conversation_interactive',
				heading: 'Test Conversation',
				contents: ['Would you like to explore the fascinating world of Grand Theft Auto V?'],
				options: [
					{
						id: 'yes',
						text: 'Yes'
					},
					{
						id: 'no',
						text: 'No'
					}
				]
			});
		}
	});

	rpc.on('onConversationFinish', async (args, { player }: rpc.ProcedureInfo) => {
		if (!player) return;
		const { id } = JSON.parse(args);
		if (id !== 'test_conversation_monologue') return;
		player.sendClientMessage('Server', 'staff', `Monologue response: done`, 'system');
	});

	rpc.on('onConversationInteraction', async (args, { player }: rpc.ProcedureInfo) => {
		if (!player) return;
		const { id, option } = JSON.parse(args);
		if (id !== 'test_conversation_interactive') return;
		player.sendClientMessage('Server', 'staff', `Interaction response: ID=${option.id} TEXT=${option.text}`, 'system');
	});
}
