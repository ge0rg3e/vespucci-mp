const player = mp.players.local;

// Warning for future reference: This bitch won't catch objects with no collision.

export function getRaycastLookingAtEntity(params: Params) {
	let start = mp.players.local.getBoneCoords(12844, 0, 0, 0);

	// @ts-ignore-next-line
	const res = mp.game.graphics.getScreenActiveResolution(1, 1);

	// @ts-ignore-next-line
	// let end = mp.game.graphics.screen2dToWorld3d(res.x / 2, res.y / 2);
	let end = mp.game.graphics.screen2dToWorld3d([res.x / 2, res.y / 2]);

	if (!end) return null;

	// Get the flags..
	const flags = getFlags(params.flags);

	const target: RaycastResult = mp.raycasting.testPointToPoint(start, end, player, flags)!;

	if (target && target.entity && (params.includeMapObjects ? true : typeof target.entity !== 'number' ? target.entity.handle : false)) {
		return target;
	}

	return null;
}

const getFlags = (flags: Params['flags']) => {
	let arr = [];

	if (flags.vehicles) {
		arr.push(2);
	}

	if (flags.peds) {
		arr.push(4);
		arr.push(8);
	}

	if (flags.objects) {
		arr.push(16);
	}

	return arr;
};

type Params = {
	distance: number;
	includeMapObjects?: boolean;
	flags: {
		vehicles?: boolean;
		peds?: boolean;
		objects?: boolean;
	};
};
