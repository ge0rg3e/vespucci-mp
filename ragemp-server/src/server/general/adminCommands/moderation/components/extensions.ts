import Bans from '@modules/database/game/bans/repository';
import moment from 'moment';

mp.Player.prototype.giveWarn = function () {
	this.info.warns += 1;
	return this.info.warns;
};

mp.Player.prototype.removeWarn = function () {
	this.info.warns -= 1;
	return this.info.warns;
};

mp.Player.prototype.banAccount = function (actioner, reason, time) {
	Bans.recordBan({
		ip: null,
		username: this.info.username,
		rockstarId: this.info.rockstarId,
		actioner,
		reason,
		expiresAt: moment().add(time, `days`).toDate(),
		active: true
	});

	return true;
};

declare global {
	interface PlayerMp {
		giveWarn(): number;
		removeWarn(): number;
		banAccount(actioner: string, reason: string, time: number): boolean;
	}
}

export {};
