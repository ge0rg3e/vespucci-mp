import { getLanguagePack } from '@vmp/i18n';
import './language';
import gameplayMechanicExperience from './definitions';

mp.Player.prototype.getExperienceRequired = function getExperienceRequired() {
	return this.info.level * gameplayMechanicExperience.MIN_EXP_TO_LEVELUP;
};

mp.Player.prototype.takeExperience = function takeExperience(amount) {
	this.info.experience -= amount;
	return this.info.experience;
};

mp.Player.prototype.setExperience = function setExperience(amount) {
	this.info.experience = amount;
	const neededExp = this.getExperienceRequired();
	const currentExp = this.info.experience;
	if (currentExp >= neededExp) {
		const leftExp = currentExp - neededExp;
		this.info.experience = 0;
		this.info.level += 1;
		const lang = getLanguagePack(`experienceChatNotification`, this.info.language);
		this.sendServerMessage('Server', 'system', lang.get('levelAnnouncement'), 'system');
		this.sendServerMessage('Server', 'system', lang.get('experienceRemained', { level: this.info.level, experience: this.info.experience }), 'system');
		if (leftExp > 0) return this.giveExperience(leftExp);
	}

	this.updateVars({
		level: this.info.level
	});
	return this.info.experience;
};

mp.Player.prototype.giveExperience = function giveExperience(amount) {
	this.info.experience += amount;
	const neededExp = this.getExperienceRequired();
	const currentExp = this.info.experience;
	if (currentExp >= neededExp) {
		const leftExp = currentExp - neededExp;
		this.info.experience = 0;
		this.info.level += 1;
		const lang = getLanguagePack(`experienceChatNotification`, this.info.language);
		this.sendServerMessage('Server', 'system', lang.get('levelAnnouncement'), 'system');
		this.sendServerMessage('Server', 'system', lang.get('experienceRemained', { level: this.info.level, experience: this.info.experience }), 'system');
		if (leftExp > 0) return this.giveExperience(leftExp);
	}

	this.updateVars({
		level: this.info.level
	});
};

declare global {
	interface PlayerMp {
		getExperienceRequired(): number;
		takeExperience(amount: number): void;
		setExperience(amount: number): void;
		giveExperience(amount: number): void;
	}
}

export {};
