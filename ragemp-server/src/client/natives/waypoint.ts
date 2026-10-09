import { isGamePauseMenuActive } from '@client/legacy/pauseMenu/components/functions';
import * as rpc from 'rage-rpc';

mp.events.add('playerRemoveWaypoint', () => {
	rpc.triggerServer(`playerRemoveWaypoint`);
});

mp.events.add('playerCreateWaypoint', (position) => {
	const getGroundZ = mp.game.gameplay.getGroundZFor3dCoord(position.x, position.y, position.z, false, false);
	rpc.triggerServer(
		`playerCreateWaypoint`,
		JSON.stringify({
			position: { ...position, z: getGroundZ },
			// This tells us if this waypoint is created by us or synced. (Our server syncs the waypoints between car passengers)
			manuallyCreated: isGamePauseMenuActive()
		})
	);
});

rpc.on(`deleteWaypoint`, () => {
	mp.game.ui.deleteWaypoint();
});

rpc.on(`onWaypointTeleportationFailed`, () => {
	mp.game.audio.playSoundFrontend(-1, `CHECKPOINT_MISSED`, `HUD_MINI_GAME_SOUNDSET`, true);
	mp.game.ui.deleteWaypoint();
});

const REQUEST_ADDITIONAL_COLLISION_AT_COORD = '0xC9156DC11411A9EA';

rpc.register(`GetGroundZForNotRenderedArea`, async (args) => {
	try {
		const { position } = JSON.parse(args);

		let groundZ: ExpectedAny = null;

		for (let i = 0; i < 100; ++i) {
			groundZ = mp.game.gameplay.getGroundZFor3dCoord(position.x, position.y, 1000, false, false);

			if (groundZ) break; // Found it!

			// If not let's go further
			for (let z = 1500; z >= 0; z -= 100) {
				mp.game.streaming.setFocusArea(position.x, position.y, z, 0, 0, 0);
				mp.game.streaming.requestCollisionAtCoord(position.x, position.y, z);
				mp.game.invoke(REQUEST_ADDITIONAL_COLLISION_AT_COORD, position.x, position.y, z);
				mp.game.wait(0);
			}

			groundZ = mp.game.gameplay.getGroundZFor3dCoord(position.x, position.y, 1000, false, false);

			if (groundZ) break; // found it.
		}

		mp.game.streaming.setFocusArea(mp.players.local.position.x, mp.players.local.position.y, mp.players.local.position.z, 0, 0, 0);

		mp.game.streaming.clearFocus();

		return groundZ;
	} catch (err: ExpectedAny) {
		mp.console.logInfo(`Error ${err.message}`);
		return null;
	}
});

rpc.on(`setPlayerWaypoint`, (args) => {
	const { x, y } = JSON.parse(args);
	mp.game.ui.setNewWaypoint(x, y);
});
