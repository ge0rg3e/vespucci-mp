import * as rpc from 'rage-rpc';

// Dependencies
import { setControlsDisabled, setCursorVisible } from '@client/general/cursor';
import { setInterfaceIsOpened } from '@client/natives/interfaces';
import { logClientsideError } from '@client/general/errors';

// Variable to store the active conversation ID, initialized as null
export let activeConversation: string | null = null;

rpc.on('conversation@show', (args) => {
	try {
		// Parsing the JSON string received in the 'args' parameter
		const { id } = JSON.parse(args);

		// Triggering a browser event to set the page to '/conversation'
		rpc.trigger('setBrowserPage', JSON.stringify({ page: '/conversation' }));

		// Triggering browser events to set the conversation data
		rpc.triggerBrowsers('conversation.setData', args);

		// Update interfaces & game controls
		setInterfaceIsOpened('conversation', true);
		setCursorVisible('conversation', true);
		setControlsDisabled('conversation', true);

		// Updating the active conversation ID with the parsed ID
		activeConversation = id;
	} catch (err) {
		logClientsideError(`conversation@show`, err);
	}
});

rpc.on('conversation@hide', async () => {
	try {
		// Triggering a browser event to set the page to '/'
		rpc.trigger('setBrowserPage', JSON.stringify({ page: '/' }));

		// Update interfaces & game controls
		setInterfaceIsOpened('conversation', false);
		setCursorVisible('conversation', false);
		setControlsDisabled('conversation', false);

		// Inform the server that the conversation has been closed
		rpc.triggerServer('onConversationClosed', JSON.stringify({ id: activeConversation }));

		// Resetting the active conversation ID to null
		activeConversation = null;
	} catch (err) {
		await logClientsideError(`converastion@hide`, err);
	}
});
