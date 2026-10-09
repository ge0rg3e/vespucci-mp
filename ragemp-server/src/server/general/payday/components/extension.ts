import moment from 'moment';
import { getLanguagePack } from '@vmp/i18n';

mp.Player.prototype.checkWarnExpires = async function () {
	const warnChecker = moment(this.info.warnsExpireAt).diff(new Date(), 'minutes').toString().includes('-');

	if (warnChecker) {
		const lang = getLanguagePack(`gamePayday`, this.info.language);

		this.sendServerMessage(lang.get('warnExpired'));
		this.createAmplitudeEvent(`Expired warns`);
		this.saveInfo({ warnsExpireAt: null });

		return true;
	}

	return false;
};

declare global {
	interface PlayerMp {
		checkWarnExpires(): Promise<boolean>;
	}
}

export {};
