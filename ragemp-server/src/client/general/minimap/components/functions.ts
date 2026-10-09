import { logClientsideError } from '@client/general/errors';
import { interfacesOpened } from '@client/natives/interfaces';
import * as rpc from 'rage-rpc';

// Variables
export let minimapEnlarged = false;

export const loadMinimap = async (offsetMinimap: number | null = null) => {
	try {
		const minimapOffsetRight = offsetMinimap !== null ? offsetMinimap : getMinimapOffset();

		// mp.console.logInfo(`Minimap offset returned: ${JSON.stringify(minimapOffsetRight)}`);

		// @ts-ignore - Player location on minimap (and center?)
		mp.game.ui.setMinimapComponentValues('minimap', 'R', 'T', -0.0133 + minimapOffsetRight, 0.015, 0.15, 0.188888); // this is centered by calculating 0.266 (size of minimap_blur) / 2 :)

		// @ts-ignore - Purple Route
		mp.game.ui.setMinimapComponentValues('minimap_mask', 'R', 'T', 0.0 + minimapOffsetRight, 0, 0.266, 0.237);

		// @ts-ignore - // Mapa in sine (the bg image gen)
		mp.game.ui.setMinimapComponentValues('minimap_blur', 'R', 'T', 0.078 + minimapOffsetRight, -0.01, 0.266, 0.237);

		// BIG MAP

		// @ts-ignore - Player location on minimap (and center?)
		mp.game.ui.setMinimapComponentValues('bigmap', 'C', 'C', -(0.5 - 0.065) + minimapOffsetRight, -0.5, 0.364 * 1.25, 0.460416666 * 1.25);

		// @ts-ignore - Purple Route
		mp.game.ui.setMinimapComponentValues('bigmap_mask', 'C', 'C', -0.5 + minimapOffsetRight, -0.5, 0.262 * 1.25, 0.464 * 1.25);

		// @ts-ignore - // Mapa in sine (the bg image gen)
		mp.game.ui.setMinimapComponentValues('bigmap_blur', 'C', 'C', -0.5 + minimapOffsetRight, -0.5, 0.262 * 1.25, 0.464 * 1.25);

		// Is required (triggers and disables the minimap large)
		mp.game.invoke('0x231C8F89D0539D8F', true, false);
		await mp.game.waitAsync(0);
		mp.game.invoke('0x231C8F89D0539D8F', false, false);
		await mp.game.waitAsync(0);

		// Hide the North on minimap
		var northRadarBlip = mp.game.invoke('0x3F0CF9CB7E589B88');
		mp.game.invoke('0x45FF974EEE1C8734', northRadarBlip, 0);
	} catch (err) {
		logClientsideError(`LOAD_MINIMAP`, err);
	}
};

/**
 * Some weird resolutions are having the minimap on the middle of the screen and for those I need to apply some padding.
 * @param res
 * @returns
 */

export const getMinimapOffset = () => {
	// Get aspect ratio
	const aspectRatio = getAspectRatioFormatted();

	// mp.console.logInfo(`Resolution: ${res} (Ratio: ${JSON.stringify(aspectRatio)})`);

	// 3:2
	if (aspectRatio === 1.5) return 0.158;

	// 4:3
	// Resolutions: 800x600', '1024x768', '1152x864', '1280x960', '1440x1080', '1600x1200', '1920x1440'
	if (aspectRatio === 1.33) return 0.252;

	// 5:3
	// Resolutions: '1280x768'
	if (aspectRatio === 1.67) return 0.062;

	// 5:4
	// Resolutions: 1280x1024
	if (aspectRatio === 1.25) return 0.305;

	// 15:10 (Hybrid)
	// Resolutions: 1600x1024
	if (aspectRatio === 1.56) return 0.118;

	// 16:10
	// Resolutions: '1280x800', '1440x900', '1680x1050', '1920x1200'
	if (aspectRatio === 1.6) return 0.098;

	return 0;
};

export const setMinimapEnlarged = async (value: boolean) => {
	// If we want to open it and we have interfaces opened..
	if (value === true && interfacesOpened.length > 0) return false;

	// Update Value
	minimapEnlarged = value;

	// Apply native
	await mp.game.waitAsync(0);
	mp.game.invoke('0x231C8F89D0539D8F', value, false);

	// Trigger browser
	rpc.triggerBrowsers(`minimap:setMinimapEnlarged`, JSON.stringify({ value }));

	return true;
};

export const getAspectRatioFormatted = () => {
	const aspectRatio = parseFloat(mp.game.graphics.getScreenAspectRatio(false).toFixed(2)); // Get tghe number like : 1.7 (is not 16:9 like an usual screen cause.. ragemp)
	return aspectRatio;
};
