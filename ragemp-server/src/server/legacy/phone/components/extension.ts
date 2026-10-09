import { logError } from '@server/utils/helpers';

mp.Player.prototype.sendPhoneNotification = async function (title, message, source, onClickOpenAppId) {
	if (!this.hasPhone()) return await logError('SENT_PHONE_NOTIFICATION_WITHOUT_PHONE', null, { player: this.info.username });

	this.triggerClientEvent(`createPhoneNotification`, { title, message, source, onClickOpenAppId });
};

mp.Player.prototype.showPhoneAlert = async function (title, message) {
	if (!this.hasPhone()) return await logError('SENT_PHONE_ALERT_WITHOUT_PHONE', null, { player: this.info.username });

	this.triggerBrowserEvent(`triggerAlertConfirmation`, { title, message });
};

mp.Player.prototype.notifyAboutAppAccess = function (appName, onClickOpenAppId) {
	const lang: 'EN' | 'RO' = this.info.language;

	const title: ExpectedAny = {
		RO: 'Aplicație nouă',
		EN: 'New application'
	};

	const content: ExpectedAny = {
		EN: `You now have access to this application.`,
		RO: `Acum ai access la această aplicație.`
	};

	this.sendPhoneNotification(title[lang], content[lang], appName[lang], onClickOpenAppId);
};

mp.Player.prototype.openPhoneApplication = function (id, payload = {}) {
	this.triggerBrowserEvent(`openPhoneApp`, { id, payload });
};

mp.Player.prototype.isPhoneApplicationOpened = async function () {
	const app: ExpectedAny = await this.getPhoneApplicationRunning();
	if (['home', 'lockscreen'].includes(app)) return false;
	return true;
};

mp.Player.prototype.getPhoneApplicationRunning = async function () {
	try {
		// Means RPC won't be there.
		if (!this.vars || !this.vars.loggedIn) return null;
		const id: string = await this.invokeClientEvent(`phone.getAppRunning`)!;
		return id;
	} catch (err) {
		await logError(`getPhoneAppRunning`, err);
		return null;
	}
};

mp.Player.prototype.closePhoneApplication = function () {
	this.triggerBrowserEvent(`closePhoneApp`);
};

mp.Player.prototype.hasPhone = function () {
	return this.getInventoryItemMatch({ itemId: 7 }) ? true : false;
};

declare global {
	interface PlayerMp {
		showPhoneAlert(title: string, message: string): void;
		sendPhoneNotification(title: string, message: string, source: string, onClickOpenAppId?: string): void;
		notifyAboutAppAccess(appName: { EN: string; RO: string }, onClickOpenAppId?: string): void;
		openPhoneApplication(id: string, payload?: Record<string, ExpectedAny>): void;
		closePhoneApplication(): void;
		isPhoneApplicationOpened(): Promise<boolean>;
		getPhoneApplicationRunning(): Promise<string | null>;
		hasPhone(): boolean;
	}
}

export {};
