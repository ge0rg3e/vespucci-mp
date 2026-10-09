import * as rpc from 'rage-rpc';

rpc.on(`onPhoneAddApplication`, (args) => {
	const { appId } = JSON.parse(args);
	rpc.triggerBrowsers('onPhoneAddApplication', JSON.stringify({ appId }));
});

rpc.on(`onPhoneRemoveApplication`, (args) => {
	const { appId } = JSON.parse(args);
	rpc.triggerBrowsers('onPhoneRemoveApplication', JSON.stringify({ appId }));
});

rpc.on(`createPhoneNotification`, (args) => {
	const { title, message, source, onClickOpenAppId } = JSON.parse(args);
	rpc.triggerBrowsers('createPhoneNotification', JSON.stringify({ title, message, source, onClickOpenAppId }));
});
