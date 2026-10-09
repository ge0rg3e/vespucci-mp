// Simeon dealership
import { getActorData } from '@client/utils/helpers';

mp.game.streaming.removeIpl('fakeint');
mp.game.streaming.requestIpl('shr_int');
mp.game.streaming.requestIpl('v_carshowroom');
mp.game.interior.enableInteriorProp(mp.game.interior.getInteriorAtCoordsWithType(-38.62, -1099.01, 27.31, 'v_carshowroom'), 'csr_beforeMission');
mp.game.interior.enableInteriorProp(mp.game.interior.getInteriorAtCoordsWithType(-38.62, -1099.01, 27.31, 'v_carshowroom'), 'shutter_closed');
mp.game.object.doorControl(1417577297, -37.33113, -1108.873, 26.7198, false, 0, 0, 0); // Park Doors (Right)
mp.game.object.doorControl(2059227086, -39.13366, -1108.218, 26.7198, false, 0, 0, 0); // Park Doors(Left)
mp.game.object.doorControl(1417577297, -60.54582, -1094.749, 26.88872, false, 0, 0, 0); // Main Doors (Right)
mp.game.object.doorControl(2059227086, -59.89302, -1092.952, 26.88362, false, 0, 0, 0); // Main Doors (Left)

mp.events.add('entityStreamIn', (entity: PedMp) => {
	if (entity.type !== 'ped') return;
	const data = getActorData(entity.remoteId);
	if (!data) return;
	if (data.identifier !== 'DealershipPromoModel') return;

	entity.taskStartScenarioInPlace('WORLD_HUMAN_PROSTITUTE_HIGH_CLASS', -1, false);
});

const env: ExpectedAny = `__ENVIRONMENT__`; // wil be overwritten by rollup config.

const vehicleData = [
	{
		model: env === 'local' ? 'sugoi' : 'rs62',
		position: new mp.Vector3(-37.911, -1098.888, 25.998),
		heading: 121.1331787109375
	},
	{
		model: env === 'local' ? 'surano' : 'bmwg07',
		position: new mp.Vector3(-45.561, -1099.977, 25.853),
		heading: 44.69061279296875
	},
	{
		model: env === 'local' ? 'sultan' : 'dawn',
		position: new mp.Vector3(-43.858, -1094.333, 25.684),
		heading: 116.9122314453125
	}
];

vehicleData.forEach((data) => {
	const vehicle = mp.vehicles.new(mp.game.joaat(data.model), data.position, {
		dimension: 0,
		color: [
			[160, 33, 27],
			[160, 33, 27]
		],
		locked: true,
		heading: data.heading
	});

	vehicle.freezePosition(true);
	vehicle.setInvincible(true);
});
