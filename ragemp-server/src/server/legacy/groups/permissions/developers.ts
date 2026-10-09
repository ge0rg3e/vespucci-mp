import { CreateGroupObject, getTitleProperties } from '../components/types';

const entries: Array<CreateGroupObject> = [];

entries.push({
	id: `developers`,
	getTitle: (opts: getTitleProperties) => formatTitle(opts),
	permissions: [
		// Features
		`adminCmds.makeAdminLv7`,
		// Commands
		`cmds.groupscheck`,
		`cmds.groupremove`,
		`cmds.groupadd`,
		'cmds.deletehouse',
		`cmds.permcheck`,
		`cmds.dhelp`,
		`cmds.giveitem`,
		`cmds.reloadclothes`,
		'cmds.reloadRadioStations',
		`feature.createClothes`,
		`feature.deleteClothes`
	],
	inheritance: ['admins:7']
});

const formatTitle = (opts: getTitleProperties) => {
	const { scope } = opts;
	let labelText = '';

	switch (scope) {
		case 'chatTitle':
			labelText = `Developer`;
			break;
		case 'groupName':
			labelText = 'Developers';
			break;
		case 'singular':
			labelText = `Developer`;
			break;
	}

	return labelText;
};

export default entries;
