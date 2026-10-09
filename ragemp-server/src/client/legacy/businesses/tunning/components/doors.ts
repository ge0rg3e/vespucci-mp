import * as rpc from 'rage-rpc';

const player = mp.players.local;

const gates: ExpectedAny = [
	{
		id: 15,
		x: -358.355,
		y: -133.871,
		z: 37.754,
		object: 'prop_com_ls_door_01'
	},
	{
		id: 16,
		x: -1141.487,
		y: -2005.628,
		z: 12.18,
		object: 'prop_com_ls_door_01'
	},
	{
		id: 17,
		x: 721.056,
		y: -1087.041,
		z: 21.238,
		object: 'prop_id2_11_gdoor'
	},
	{
		id: 18,
		x: 1177.002,
		y: 2648.765,
		z: 37.796,
		object: 'v_ilev_carmod3door'
	},
	{
		id: 19,
		x: 117.095,
		y: 6622.242,
		z: 31.863,
		object: 'v_ilev_carmod3door'
	},
	{
		id: 20,
		x: -205.988,
		y: -1308.947,
		z: 30.293,
		object: 'lr_prop_supermod_door_01'
	}
];

const switchGate = (model: ExpectedAny, gatePos: ExpectedAny, state: boolean) => {
	const hash = typeof model === 'string' ? mp.game.joaat(model) : model;
	const gateRot = new mp.Vector3(0, 0, state === true ? 100 : 0);
	mp.game.object.doorControl(hash, gatePos.x, gatePos.y, gatePos.z, false, gateRot.x, gateRot.y, gateRot.z);
};

// Creating the colshapes to auto open the gates.
gates.forEach((gate: ExpectedAny, ix: number) => {
	gates[ix].colshape = mp.colshapes.newCircle(gate.x, gate.y, 5);
});

const onColshapeEvent = (shape: ExpectedAny, status: ExpectedAny) => {
	const gateMatch = gates.find((e: ExpectedAny) => e.colshape === shape);
	if (!gateMatch) return false;

	if (player.dimension !== 0) return false; // only in dimension 0.

	// They're near the gate..
	switchGate(gateMatch.object, new mp.Vector3(gateMatch.x, gateMatch.y, gateMatch.z), status);
	return true;
};

// Events for when walking nearby to avoid hitting the vehicle.
mp.events.add('playerEnterColshape', (shape: ExpectedAny) => onColshapeEvent(shape, true));
mp.events.add('playerExitColshape', (shape: ExpectedAny) => onColshapeEvent(shape, false));

rpc.on('tunning:switchStateGarageDoor', (args: string) => {
	const { state } = JSON.parse(args);

	gates.forEach((gate: ExpectedAny) => {
		const gatePos = new mp.Vector3(gate.x, gate.y, gate.z);
		const playerPos = player.position;

		const distance = mp.game.gameplay.getDistanceBetweenCoords(
			playerPos.x,
			playerPos.y,
			playerPos.z,
			gatePos.x,
			gatePos.y,
			gatePos.z,
			true // set to true to measure the distance as a straight line
		);

		// Is not nearby..
		if (distance > 100) return;

		switchGate(gate.object, gatePos, state);
	});
});
