export const setCameraFocusAt = async (position: Vector3) => {
	mp.game.streaming.setFocusPosAndVel(position.x, position.y, position.z, 0, 0, 0);

	// Wait till it's loaded
	mp.game.streaming.newLoadSceneStartSphere(position.x, position.y, position.z, 30, 0);

	while (!mp.game.streaming.isNewLoadSceneLoaded()) {
		await mp.game.waitAsync(0);
	}

	mp.game.streaming.newLoadSceneStop();
};
