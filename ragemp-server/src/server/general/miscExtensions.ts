import { createAmplitudeEvent as baseCreateAmplitudeEvent, formatUsernameAmplitude, logError } from '@server/utils/helpers';
import * as rpc from 'rage-rpc';

mp.Player.prototype.invokeClientEvent = function invokeClientEvent(procedureName, args) {
	return rpc.callClient(this, procedureName, JSON.stringify(args));
};

mp.Player.prototype.invokeBrowserEvent = function invokeBrowserEvent(procedureName, args) {
	return rpc.callBrowsers(this, procedureName, JSON.stringify(args));
};

mp.Player.prototype.triggerClientEvent = function triggerClientEvent(procedureName, args) {
	rpc.triggerClient(this, procedureName, JSON.stringify(args));
};

mp.Player.prototype.logBrowser = function triggerClientEvent(title, payload) {
	this.triggerBrowserEvent('logBrowser', { title, payload });
};

mp.Player.prototype.triggerBrowserEvent = function triggerBrowserEvent(procedureName, args) {
	rpc.triggerBrowsers(this, procedureName, JSON.stringify(args));
};

mp.Player.prototype.createAmplitudeEvent = async function createAmplitudeEvent(eventName, eventProperties = {}) {
	if (!this.vars || (this.vars && this.vars.loggedIn !== true)) return;
	try {
		// await baseCreateAmplitudeEvent(
		// 	formatUsernameAmplitude(this.info.username),
		// 	this.rgscId,
		// 	eventName,
		// 	{
		// 		...eventProperties,
		// 		client_version: this.cef_version
		// 	},
		// 	{
		// 		email: this.info.email,
		// 		rockstarId: this.rgscId
		// 	},
		// 	{
		// 		...this.client_location
		// 	}
		// );

		// Log the logs
		if (process.env.ENVIRONMENT === 'local') {
			console.info(`[${this.info.username}] - amplitude event: "${eventName}"`, eventProperties || {});
		}
	} catch (err) {
		await logError(`Failed to log amplitude event`, err);
	}
};

mp.Player.prototype.addClientsideVariables = function (keys) {
	// Get the input
	let entries = typeof keys === 'string' ? [keys] : keys; // We can pass string but also an array of keys.

	// Get the current array of keys
	let arr = this.vars._keys || [];

	// Add new keys
	arr = [...arr, ...entries];

	// Update variable
	this.vars._keys = arr;

	// Send the keys to client-side so the system knows what keys to parse
	this.setVariable(`@playerVars`, arr);
};

mp.Player.prototype.updateVars = function updateVars(variables) {
	// Updating the state
	this.vars = { ...this.vars, ...variables };

	// Getting the array that dictates what variables must be available on client-side
	const keys = this.vars._keys;

	// Creating individual player variables for each one of those keys
	keys.forEach((key) => {
		this.setVariable(`@playerVars.${key}`, this.vars[key]);
	});
};

mp.Player.prototype.updateMeta = function updateMeta(variables) {
	this.meta = { ...this.meta, ...variables };
	this.triggerClientEvent(`updateLocalStorage`, { key: `playerMeta`, payload: this.meta });
};

mp.Player.prototype.deleteMeta = function deleteMeta(key) {
	const newMeta: ExpectedAny = { ...this.meta };
	delete newMeta[key];
	this.meta = newMeta;
	this.triggerClientEvent(`updateLocalStorage`, { key: `playerMeta`, payload: newMeta });
};

mp.Player.prototype.updateDiscordStatus = function updateDiscordStatus(actionText: string) {
	this.triggerClientEvent(`updateDiscordStatus`, { actionText });
};

mp.Player.prototype.resetInteriorVarsOnTeleport = function () {
	if (this.vars.garageEntered) {
		this.triggerClientEvent('setUnableToDoDamage', { bool: false });
	}

	this.updateVars({
		garageEntered: null,
		houseEntered: null
	});
};

mp.Player.prototype.startLoadingScreen = async function () {
	await this.triggerBrowserEvent('alerts:setVisibility', { boolean: false });
	await this.invokeClientEvent(`setLoadingScreen`, { boolean: true });
	this.updateVars({
		loadingScreenActive: true
	});
};

mp.Player.prototype.stopLoadingScreen = async function () {
	await this.triggerBrowserEvent('alerts:setVisibility', { boolean: true });
	await this.invokeClientEvent(`setLoadingScreen`, { boolean: false });
	this.updateVars({
		loadingScreenActive: false
	});
};

mp.Player.prototype.freeze = function (props) {
	this.triggerClientEvent('setFreeze', props);
};

mp.events.add('loadPlayerDefaults', (player) => {
	player.updateVars({
		loadingScreenActive: false
	});
});

declare global {
	interface PlayerVariables {
		_keys: Array<keyof PlayerVariables>;
	}

	interface PlayerMp {
		addClientsideVariables(keys: keyof PlayerVariables | Array<keyof PlayerVariables>): void;
		updateVars(variables: Partial<PlayerVariables>): void;

		updateMeta(variables: Partial<PlayerMeta>): void;
		deleteMeta(key: string): void;
		resetInteriorVarsOnTeleport(): void;

		invokeClientEvent(procedureName: string, args?: object): void;
		invokeBrowserEvent(procedureName: string, args?: object): void;
		triggerClientEvent(procedureName: string, args?: object): void;
		triggerBrowserEvent(procedureName: string, args?: object): void;

		updateDiscordStatus(actionText: string): void;
		logBrowser(title: string, payload: Record<string, ExpectedAny>): void;

		createAmplitudeEvent(eventName: string, eventProperties?: Record<string, ExpectedAny>): void;
		log(log: string, type?: 'error' | 'info'): void;

		startLoadingScreen(): void;
		stopLoadingScreen(): void;

		freeze(props: { systemId: string; toggle: boolean }): void;
	}

	interface PlayerVariables {
		loadingScreenActive: boolean;
	}
}
