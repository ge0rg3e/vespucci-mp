import { MAX_ADMIN_LEVEL } from '../permissions/admins';
import { MAX_HELPER_LEVEL } from '../permissions/helpers';
import { MAX_AGENT_LEVEL } from '../permissions/agents';
import { checkPermission, getGroupById, Groups } from './functions';
import { getTitleProperties, GroupObject } from './types';
import { MAX_TESTER_LEVEL } from '../permissions/testers';

mp.Player.prototype.getGroups = function () {
	if (this.info.groups.split(',').length < 1) return [];
	const groups: Array<GroupObject> = [];
	const groupIds = this.info.groups.split(',');
	groupIds.forEach((g: string) => {
		const match: GroupObject = getGroupById(g)!;
		if (match) {
			groups.push(match);
		}
	});
	return groups;
};

mp.Player.prototype.checkPermission = function (name) {
	const groups = this.getGroups();
	if (!groups) return false;
	let allPermissions: Array<string> = [];

	groups.forEach((g: GroupObject) => {
		allPermissions = [...allPermissions, ...g.permissions];
	});

	const granted = checkPermission(allPermissions, name);
	return granted;
};

mp.Player.prototype.addToGroup = function (groupId, primaryGroup: boolean) {
	if (!Groups.find((g: GroupObject) => g.id === groupId)) return false; // invalid group
	const groups = this.info.groups.split(',');
	if (primaryGroup === true) {
		groups.splice(0, 0, groupId);
	} else {
		groups.push(groupId);
	}

	const importanceMap: ExpectedAny = { developers: 999, admins: 777, vip: 555 };

	this.info.groups = groups
		.sort((a, b) => {
			const aLabel = a.split(':')[0];
			const bLabel = b.split(':')[0];
			const aIndex = importanceMap[aLabel] || 0;
			const bIndex = importanceMap[bLabel] || 0;
			return bIndex - aIndex;
		})
		.join(',');

	this.updateVars({
		groups: this.info.groups
	});

	// Update this to cef..
	this.triggerBrowserEvent(`account:update`, {
		groups: this.info.groups,
		adminLevel: this.getAdminLevel(),
		helperLevel: this.getHelperLevel()
	});

	return true;
};

mp.Player.prototype.getPrimaryGroupTitle = function (opts) {
	if (this.info.groups.length < 1) return '';
	//let title: string = this.getGroups()[0].getTitle(opts);
	const group = this.getGroups()[0];
	const title = group.getTitle(opts);
	return title;
};

mp.Player.prototype.removeFromGroup = function (groupId) {
	if (!Groups.find((g: GroupObject) => g.id === groupId)) return false; // invalid group
	const groups = this.info.groups.split(',');
	const index = groups.findIndex((g: string) => g === groupId);
	if (index === -1) return false; // failed to find index.
	groups.splice(index, 1);
	this.info.groups = groups.join(',');

	this.updateVars({
		groups: this.info.groups
	});

	// Update this to cef..
	this.triggerBrowserEvent(`account:update`, {
		groups: this.info.groups,
		adminLevel: this.getAdminLevel(),
		helperLevel: this.getHelperLevel()
	});

	return true;
};

mp.Player.prototype.validatePlayerGroups = function () {
	const validGroups = this.info.groups.split(',').filter((g: string) => Groups.find((x: GroupObject) => x.id === g));

	if (this.info.groups !== validGroups.join(',')) {
		this.createAmplitudeEvent(`Invalid groups detected`, {
			oldGroups: this.info.groups,
			newGroups: validGroups.join(',')
		});
		this.info.groups = validGroups.join(',');
		this.saveInfo({ groups: this.info.groups });
	}
};

mp.Player.prototype.isDeveloper = function () {
	return this.info.groups.includes('developer') ? true : false;
};

mp.Player.prototype.isTester = function () {
	return this.info.groups.includes('testers') ? true : false;
};

mp.Player.prototype.getTesterLevel = function () {
	if (this.info.groups.includes('developers')) return MAX_TESTER_LEVEL;
	if (!this.info.groups.includes('testers')) return 0;
	const group = this.info.groups.split(',').find((x: string) => x.includes(`testers`))!;
	return parseInt(group.split(':')[1]);
};

mp.Player.prototype.getAdminLevel = function () {
	if (this.info.groups.includes('developers')) return MAX_ADMIN_LEVEL;
	if (!this.info.groups.includes('admins')) return 0;
	const adminGroup = this.info.groups.split(',').find((x: string) => x.includes(`admins`))!;
	return parseInt(adminGroup.split(':')[1]);
};

mp.Player.prototype.getHelperLevel = function () {
	if (this.info.groups.includes('developers')) return MAX_HELPER_LEVEL;
	if (!this.info.groups.includes('helpers')) return 0;
	const helperGroup = this.info.groups.split(',').find((x: string) => x.includes(`helpers`))!;
	return parseInt(helperGroup.split(':')[1]);
};

mp.Player.prototype.getAgentLevel = function () {
	if (this.info.groups.includes('developers')) return MAX_AGENT_LEVEL;
	if (!this.info.groups.includes('agents')) return 0;
	const agentGroup = this.info.groups.split(',').find((x: string) => x.includes(`agents`))!;
	return parseInt(agentGroup.split(':')[1]);
};

declare global {
	interface PlayerMp {
		getGroups(): Array<GroupObject>;
		checkPermission(name: string): boolean;
		isTester(): boolean;
		isDeveloper(): boolean;
		addToGroup(groupId: string, primaryGroup: boolean): void;
		removeFromGroup(groupId: string): void;
		validatePlayerGroups(): void;
		getPrimaryGroupTitle(opts: getTitleProperties): string;
		getAdminLevel(): number;
		getHelperLevel(): number;
		getAgentLevel(): number;
		getTesterLevel(): number;
	}
}

export {};
