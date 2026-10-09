import { CreateGroupObject, getTitleProperties } from '../types';

const entries: Array<CreateGroupObject> = [];

entries.push({
	id: `admins:1`,
	getTitle: (opts: getTitleProperties) => formatTitle(`admins:1`, opts),
	permissions: []
});

entries.push({
	id: `admins:2`,
	getTitle: (opts: getTitleProperties) => formatTitle(`admins:2`, opts),
	permissions: [],
	inheritance: ['admins:1']
});

entries.push({
	id: `admins:3`,
	getTitle: (opts: getTitleProperties) => formatTitle(`admins:3`, opts),
	permissions: [
		// Profiles
		'profiles.seePrivateInformation'
	],
	inheritance: ['admins:2']
});

entries.push({
	id: `admins:4`,
	getTitle: (opts: getTitleProperties) => formatTitle(`admins:4`, opts),
	permissions: [],
	inheritance: ['admins:3']
});

entries.push({
	id: `admins:5`,
	getTitle: (opts: getTitleProperties) => formatTitle(`admins:5`, opts),
	permissions: [],
	inheritance: ['admins:4']
});

entries.push({
	id: `admins:6`,
	getTitle: (opts: getTitleProperties) => formatTitle(`admins:6`, opts),
	permissions: [],
	inheritance: ['admins:5']
});

entries.push({
	id: `admins:7`,
	getTitle: (opts: getTitleProperties) => formatTitle(`admins:7`, opts),
	permissions: [],
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
