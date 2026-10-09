import { CreateGroupObject, getTitleProperties } from '../components/types';

export const MAX_TESTER_LEVEL = 1;

const entries: Array<CreateGroupObject> = [];

entries.push({
	id: `donors:1`,
	getTitle: (opts: getTitleProperties) => formatTitle(`donors:1`, opts),
	permissions: [
		// Phone Apps
		'phone.vespify.keepVideoInBackground'
	]
});

// Cand facem chat, sa facem sa putem dezactiva chat-ul la premiumchat din setari joc.

const formatTitle = (_: unknown, opts: getTitleProperties) => {
	const { scope } = opts;
	let labelText = '';

	switch (scope) {
		case 'chatTitle':
			labelText = `Donor`;
			break;
		case 'groupName':
			labelText = `Donor`;
			break;
		case 'singular':
			labelText = `Donor`;
			break;
	}
	return labelText;
};

export default entries;
