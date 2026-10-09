import { logError } from '@server/utils/helpers';
import { red } from 'colorette';
import { CreateGroupObject, GroupObject } from './types';

export const Groups: Array<GroupObject> = [];

export const createGroup = async (g: CreateGroupObject) => {
	try {
		const { id, getTitle, meta = {}, inheritance, permissions: permissionsDictated, permissionsInheritedFilteredOut } = g;

		if (Groups.find((x) => x.id === id)) {
			console.error(`${red('[ERROR]')} Group ID "${id}" is already used by another group.`);
			process.exit(1);
		}

		let permissions = [...permissionsDictated];

		if (inheritance) {
			for (let index = 0; index < inheritance.length; index++) {
				const groupId = inheritance[index];
				const match = Groups.find((x) => x.id === groupId);
				if (!match) {
					console.error(`${red('[ERROR]')} Group "${g.id}" failed to inherit group: "${groupId}" - Doesn't exist.`);
					process.exit(1);
				}

				const newPermissions = match.permissions.filter((p) => {
					if (permissionsInheritedFilteredOut?.includes(p)) return false;
					if (permissions.includes(p)) return false;
					return true;
				});

				permissions = [...permissions, ...newPermissions];
			}
		}

		const groupObject = {
			id,
			getTitle,
			permissions,
			meta
		};

		Groups.push(groupObject);
	} catch (err) {
		await logError(`CREATE_GROUP`, err);
	}
};

export const getGroupById = (id: string) => Groups.find((x) => x.id === id);

export const getGroupPermissions = (id: string) => {
	const group = getGroupById(id);
	if (!group) return [];
	return group.permissions;
};

export const checkPermission = (source: Array<string>, permission: string) => {
	if (!source) return false;

	if (source.includes(permission)) {
		return true;
	} else return false;
};
