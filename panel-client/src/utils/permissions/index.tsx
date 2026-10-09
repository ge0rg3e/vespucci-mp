// Types
import { GroupObject } from './types';
import { Account } from '../context.types';

// Dependencies
import getBundleGroups from './map';

export const getGroupById = (id: string) => getBundleGroups().find((g: GroupObject) => g.id === id) || null;
export const checkGroupPermission = (group: GroupObject, permission: string) => (group.permissions.includes(permission) ? true : false);
export const checkAccountPermission = (account: Account, permission: string) => {
	// If there is no account return false
	if (!account) return false;

	const userGroups = [...getBundleGroups()].filter((g: GroupObject) => account.groups.split(',').includes(g.id));

	// Have a merged array of permissions..
	const permissions = userGroups.map((e) => e.permissions).reduce((prev, current) => [...prev, ...current], []);

	return permissions.includes(permission) ? true : false;
};
