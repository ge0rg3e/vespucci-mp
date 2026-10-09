import { CreateGroupObject, getTitleProperties } from '../types';

const entries: Array<CreateGroupObject> = [];

entries.push({
	id: `developers`,
	getTitle: (opts: getTitleProperties) => formatTitle(opts),
	permissions: [],
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
