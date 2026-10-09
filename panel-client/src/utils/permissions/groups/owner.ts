import { CreateGroupObject, getTitleProperties } from '../types';

const entries: Array<CreateGroupObject> = [];

entries.push({
	id: `owner`,
	getTitle: (opts: getTitleProperties) => formatTitle(opts),
	permissions: [],
	inheritance: ['developers']
});

const formatTitle = (opts: getTitleProperties) => {
	const { scope } = opts;
	let labelText = '';

	switch (scope) {
		case 'chatTitle':
			labelText = `Server Owner`;
			break;
		case 'groupName':
			labelText = 'Server Owner';
			break;
		case 'singular':
			labelText = `Server Owner`;
			break;
	}

	return labelText;
};

export default entries;
