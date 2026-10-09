import * as rpc from 'rage-rpc';

type interactionButton = { identifier: string; button: string; label: string };

export let currentInteractionButton: ExpectedAny = null;

export const showInteractionButton = (args: interactionButton) => {
	// Extracting arguments
	const { identifier, button, label } = typeof args === 'string' ? JSON.parse(args) : args;

	// Inform front-end to show it..
	rpc.triggerBrowsers('showInteractionButton', JSON.stringify({ identifier, button, label }));

	// Save it
	currentInteractionButton = { identifier, button, label };
	return true;
};

export const hideInteractionButton = () => {
	rpc.triggerBrowsers('hideInteractionButton');
	currentInteractionButton = null;
};

rpc.on('showInteractionButton', showInteractionButton);
rpc.on('hideInteractionButton', hideInteractionButton);
