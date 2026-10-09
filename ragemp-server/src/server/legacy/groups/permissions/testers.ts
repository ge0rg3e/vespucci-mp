import { CreateGroupObject, getTitleProperties } from '../components/types';

export const MAX_TESTER_LEVEL = 1;

const entries: Array<CreateGroupObject> = [];

entries.push({
	id: `testers:1`,
	getTitle: (opts: getTitleProperties) => formatTitle(`testers:1`, opts),
	permissions: [
		// Commands
		'cmds.testerhelp', // mai adaugam comenzi pe viitor n am idee
		'cmds.testerchat',
		'cmds.clearmychat'
	]
});

const formatTitle = (_: unknown, opts: getTitleProperties) => {
	const { scope } = opts;
	let labelText = '';

	switch (scope) {
		case 'chatTitle':
			labelText = `Tester`;
			break;
		case 'groupName':
			labelText = `Testers`;
			break;
		case 'singular':
			labelText = `Tester`;
			break;
	}
	return labelText;
};

export default entries;
