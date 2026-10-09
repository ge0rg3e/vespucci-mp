import { loggedIn } from '@client/natives/interfaces';
import { minimapEnlarged, setMinimapEnlarged } from './functions';

// Keys
const Z_KEY = 0x5a;

let minimap = mp.game.graphics.requestScaleformMovie('minimap');

mp.events.add('render', () => {
	// Hiding hp bar from under minimap.
	mp.game.graphics.pushScaleformMovieFunction(minimap, 'SETUP_HEALTH_ARMOUR');
	mp.game.graphics.pushScaleformMovieFunctionParameterInt(3);
	mp.game.graphics.popScaleformMovieFunctionVoid();
});

mp.keys.bind(Z_KEY, true, () => {
	if (!loggedIn) return;
	if (minimapEnlarged) return;

	setMinimapEnlarged(true);
});

mp.keys.bind(Z_KEY, false, () => {
	if (!loggedIn) return;
	if (!minimapEnlarged) return;

	setMinimapEnlarged(false);
});
