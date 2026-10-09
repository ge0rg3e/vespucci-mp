import * as rpc from 'rage-rpc';

type ProgressBar = { identifier: string; seconds: number; label: string };

export const showProgressBar = (args: ProgressBar) => {
	// Extracting arguments
	const { seconds, label } = typeof args === 'string' ? JSON.parse(args) : args;

	// Inform front-end to show it..
	rpc.triggerBrowsers('progressBar:show', JSON.stringify({ seconds, label }));

	return true;
};

export const hideProgressBar = () => {
	rpc.triggerBrowsers('progressBar:hide');
};

rpc.on('showProgressBar', showProgressBar);
rpc.on('hideProgressBar', hideProgressBar);
