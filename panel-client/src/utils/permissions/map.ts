import { GroupObject } from './types';

//  Groups
import Admins from './groups/admins';
import Developers from './groups/developers';
import Owner from './groups/owner';
import Agents from './groups/agents';
import Helpers from './groups/helpers';

const DefinedGroups = [...Owner, ...Developers, ...Admins, ...Agents, ...Helpers];

const getBundledGroups = () => {
	const CreatedGroups: Array<GroupObject> = [];

	// Iterate them..
	DefinedGroups.forEach((g) => {
		const entry: GroupObject = {
			id: g.id,
			getTitle: g.getTitle,
			permissions: g.permissions
		};

		// If they have something to inherit.
		if (g.inheritance) {
			g.inheritance.forEach((inherit) => {
				const match = DefinedGroups.find((e) => e.id === inherit);
				if (match) {
					match.permissions.forEach((p) => {
						if (!entry.permissions.includes(p)) {
							entry.permissions.push(p);
						}
					});
				}
			});
		}

		CreatedGroups.push(entry);
	});

	return CreatedGroups;
};

export default getBundledGroups;
