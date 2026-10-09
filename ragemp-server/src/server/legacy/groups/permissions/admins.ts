import { CreateGroupObject, getTitleProperties } from '../components/types';

const entries: Array<CreateGroupObject> = [];
export const MAX_ADMIN_LEVEL = 7;

entries.push({
	id: `admins:1`,
	getTitle: (opts: getTitleProperties) => formatTitle(`admins:1`, opts),
	permissions: [
		// Features
		'game.staffMessages',
		// Commands
		'cmds.adminhelp',
		'cmds.adminchat',
		'cmds.goto',
		'cmds.houseid',
		'cmds.abusiness',
		'cmds.gotodealership',
		'cmds.rentid',
		'cmds.gotoxyz',
		'cmds.mark', // includes gotomark, deletemark
		'cmds.mute', // includes mute and umute
		'cmds.mytod',
		'cmds.freeze', // includes freeze and unfreeze
		'cmds.setskin',
		'cmds.mywod',
		'cmds.clearmychat',
		'cmds.wptp',
		'cmds.setdimension',
		'cmds.warp',
		'cmds.removelicense',
		'cmds.givelicense', // includes give and remove license
		'cmds.checkLicense',
		// Vespify
		'phone.vespify.keepVideoInBackground'
	]
});

entries.push({
	id: `admins:2`,
	getTitle: (opts: getTitleProperties) => formatTitle(`admins:2`, opts),
	permissions: [
		// Commands
		'cmds.respawn',
		'cmds.clearchat',
		'cmds.sendto',
		'cmds.fixvehicle',
		'cmds.flipvehicle',
		'cmds.sethealth',
		'cmds.setarmour',
		'cmds.check',
		'cmds.gotolastpos',
		'cmds.sendback',
		'cmds.spectate',
		'cmds.gotoveh',
		'cmds.setbloodalcohol',
		'cmds.sethunger',
		'cmds.setthirst'
	],
	inheritance: ['admins:1']
});

entries.push({
	id: `admins:3`,
	getTitle: (opts: getTitleProperties) => formatTitle(`admins:3`, opts),
	permissions: [
		// Features
		'game.enterAnyHouse',
		'game.tuneAnyVehicle',
		'game.pickPlayerSpeakers',
		// Commands
		'cmds.savepos',
		'cmds.slap',
		'cmds.gethere',
		'cmds.aghost',
		'cmds.rtc',
		'cmds.savecampos',
		'cmds.warn',
		'cmds.unwarn',
		'cmds.getveh',
		'cmds.gotoactor',
		'cmds.setvehfuel'
	],
	inheritance: ['admins:2']
});

entries.push({
	id: `admins:4`,
	getTitle: (opts: getTitleProperties) => formatTitle(`admins:4`, opts),
	permissions: [
		// Commands
		'cmds.kick',
		'cmds.tod',
		'cmds.veh',
		'cmds.fav',
		'cmds.ftc',
		'cmds.fac',
		'cmds.giveweapon',
		'cmds.takeweapons',
		'cmds.ban',
		'cmds.checkveh',
		'cmds.clearclothes'
	],
	inheritance: ['admins:3']
});

entries.push({
	id: `admins:5`,
	getTitle: (opts: getTitleProperties) => formatTitle(`admins:5`, opts),
	permissions: [
		// Commands
		'cmds.serverannounce',
		'cmds.wod',
		'cmds.godmode',
		'cmds.checkinventory',
		'feature.friskHouseInventories',
		'feature.friskVehiclesInventories',
		'cmds.clearitems',
		'cmds.giveitem',
		'cmds.aevent',
		'cmds.givetoall',
		'cmds.createveh'
	],
	inheritance: ['admins:4']
});

entries.push({
	id: `admins:6`,
	getTitle: (opts: getTitleProperties) => formatTitle(`admins:6`, opts),
	permissions: [
		// Features
		'game.connectToServerSpeakers',
		// Commands
		'cmds.setadmin',
		'cmds.sethelper',
		'cmds.setagent',
		'cmds.settester',
		'cmds.setlevel',
		'cmds.setmoney',
		'cmds.takemoney',
		'cmds.givemoney',
		'cmds.setexp',
		'cmds.setpaycheck',
		'cmds.givepaycheck',
		'cmds.whitelistadd',
		'cmds.whitelistremove',
		`feature.useClothesManagement`,
		'cmds.giveclothes'
	],
	inheritance: ['admins:5']
});

entries.push({
	id: `admins:7`,
	getTitle: (opts: getTitleProperties) => formatTitle(`admins:7`, opts),
	permissions: [
		// Commands
		`cmds.groupcheck`,
		'cmds.hinteriors',
		'cmds.createhouse',
		'cmds.createbusiness',
		'cmds.businesstype',
		'cmds.deletebusiness',
		'cmds.reloadbusiness',
		'cmds.creategarage',
		'cmds.deletegarage',
		'cmds.bedit',
		'cmds.hedit',
		'feature.unlockAnyPersonalVehicle',
		'cmds.rac',
		'cmds.savedata',
		'cmds.createdealership',
		'cmds.deletedealership',
		'cmds.updatedealership',
		'cmds.reloaddsstock',
		'feature.manageDealershipStock',
		'feature.updateClothes'
	],
	inheritance: ['admins:6']
});

const formatTitle = (id: string, opts: getTitleProperties) => {
	const { scope, meta = {} } = opts;
	let labelText = '';
	const level = id.split(':')[1];
	const includeLevel = meta.includeLevel ? true : false;

	switch (scope) {
		case 'chatTitle':
			labelText = includeLevel ? `Admin ${level}` : `Admin`;
			break;
		case 'groupName':
			labelText = includeLevel ? `Administrators Lv. ${level}` : 'Administrators';
			break;
		case 'singular':
			labelText = includeLevel ? `Administrator Lv. ${level}` : `Administrator`;
			break;
	}

	return labelText;
};

export default entries;
