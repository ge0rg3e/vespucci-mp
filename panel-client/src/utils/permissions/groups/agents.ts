import { CreateGroupObject, getTitleProperties } from '../types';

const entries: Array<CreateGroupObject> = [];
export const MAX_AGENT_LEVEL = 3;

entries.push({
	id: `agents:1`,
	getTitle: (opts: getTitleProperties) => formatTitle(`agents:1`, opts),
	permissions: []
});

entries.push({
	id: `agents:2`,
	getTitle: (opts: getTitleProperties) => formatTitle(`agents:2`, opts),
	permissions: [],
	inheritance: ['agents:1']
});

entries.push({
	id: `agents:3`,
	getTitle: (opts: getTitleProperties) => formatTitle(`agents:3`, opts),
	permissions: [],
	inheritance: ['agents:2']
});

const formatTitle = (id: string, opts: getTitleProperties) => {
	const { scope, meta = {} } = opts;
	let labelText = '';
	const level = id.split(':')[1];
	const includeLevel = meta.includeLevel ? true : false;

	switch (scope) {
		case 'chatTitle':
			labelText = includeLevel ? `Agent ${level}` : `Agent`;
			break;
		case 'groupName':
			labelText = includeLevel ? `Agents Lv. ${level}` : 'Agents';
			break;
		case 'singular':
			labelText = includeLevel ? `Agent Lv. ${level}` : `Agent`;
			break;
	}

	return labelText;
};

export default entries;
