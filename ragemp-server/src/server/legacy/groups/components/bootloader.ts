import { green, yellow } from 'colorette';
import { createGroup } from './functions';

// Groups and their permissions.
import Admins from '../permissions/admins';
import Developers from '../permissions/developers';
import Helpers from '../permissions/helpers';
import Agents from '../permissions/agents';
import Testers from '../permissions/testers';
import Donors from '../permissions/donors';

mp.events.add('gamemodeStarted', () => {
	const GroupsDefined = [...Admins, ...Developers, ...Helpers, ...Agents, ...Testers, ...Donors];
	GroupsDefined.forEach((g) => createGroup(g));
	const uniquePermissions: Array<string> = [];
	GroupsDefined.forEach((g) => {
		g.permissions.forEach((p) => {
			if (uniquePermissions.includes(p)) return;
			uniquePermissions.push(p);
		});
	});

	console.info(`${green('[DONE]')} Loaded ${yellow(`${GroupsDefined.length}`)} groups with ${yellow(`${uniquePermissions.length}`)} permissions available in total.`);
});

mp.events.add('onPlayerLogin', (player) => {
	// This is required cause maybe with time one day we'll delete a group and we don't want them to have junk data in their groups info.
	player.validatePlayerGroups();
});
