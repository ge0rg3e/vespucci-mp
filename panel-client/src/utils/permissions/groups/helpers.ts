import { CreateGroupObject, getTitleProperties } from '../types';

const entries: Array<CreateGroupObject> = [];
export const MAX_HELPER_LEVEL = 3;

entries.push({
	id: `helpers:1`,
	getTitle: (opts: getTitleProperties) => formatTitle(`helpers:1`, opts),
	permissions: []
});

entries.push({
	id: `helpers:2`,
	getTitle: (opts: getTitleProperties) => formatTitle(`helpers:2`, opts),
	permissions: [],
	inheritance: ['helpers:1']
});

entries.push({
	id: `helpers:3`,
	getTitle: (opts: getTitleProperties) => formatTitle(`helpers:3`, opts),
	permissions: [],
	inheritance: ['helpers:2']
});

const formatTitle = (id: string, opts: getTitleProperties) => {
	const { scope, meta = {} } = opts;
	let labelText = '';
	const level = id.split(':')[1];
	const includeLevel = meta.includeLevel ? true : false;

	switch (scope) {
		case 'chatTitle':
			labelText = includeLevel ? `Helper ${level}` : `Helper`;
			break;
		case 'groupName':
			labelText = includeLevel ? `Helpers Lv. ${level}` : 'Helpers';
			break;
		case 'singular':
			labelText = includeLevel ? `Helper Lv. ${level}` : `Helper`;
			break;
	}

	return labelText;
};

export default entries;
