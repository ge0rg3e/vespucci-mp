import { setControlsDisabled, setCursorVisible } from '@client/general/cursor';
import { stopAudio } from '@client/natives/audio/components/functions';
import * as rpc from 'rage-rpc';

const player = mp.players.local;

rpc.on('authentication:start', () => {
	// Set the page..
	rpc.trigger(`setBrowserPage`, JSON.stringify({ page: `/authenticate` }));

	// The remember me..
	if (mp.storage.data['playerMeta']) {
		const { rememberMeCredentials } = mp.storage.data['playerMeta'];

		if (rememberMeCredentials) {
			rpc.triggerBrowsers('onRememberMeInitiated', JSON.stringify({ rememberMeCredentials }));
		}
	}
});

rpc.on('authentication:finish', async () => {
	// Hiding the cursor..
	setCursorVisible(`authentication`, false);
	setControlsDisabled(`authentication`, false);

	mp.game.cam.doScreenFadeOut(400);
	await mp.game.waitAsync(1200);

	// Stop the music
	stopAudio(`welcomeMusic`);

	// Clear the game focus from the "setCameraFocusAt"
	mp.game.streaming.clearFocus();

	// Removing these effects
	player.freezePosition(false);
	player.setInvincible(false);
	player.setVisible(true, true);

	// Huds..
	mp.game.ui.displayHud(true);
	mp.game.ui.displayRadar(true);

	// Re-setting timecycle..
	mp.game.graphics.setTimecycleModifier('default');

	// Final fade to show after player is spawned
	await mp.game.waitAsync(800);
	mp.game.cam.doScreenFadeIn(300);

	// Required to remove the camera
	mp.game.cam.destroyAllCams(true); // Cleanup
	mp.game.cam.renderScriptCams(false, false, 0, true, false, 0);

	// Interfaces
	rpc.triggerBrowsers('hideGameHud', JSON.stringify({ boolean: false }));
	rpc.trigger('onAuthCompleted');
});
