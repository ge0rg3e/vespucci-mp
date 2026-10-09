const PAUSE_MENU_COLOR_RGB = { R: 178, G: 132, B: 211 };
const PAUSE_MENU_TITLE = 'VESPUCCI.MP';

function handleTick() {
	mp.game.audio.startAudioScene('CHARACTER_CHANGE_IN_SKY_SCENE');
	mp.game.audio.startAudioScene('FBI_HEIST_H5_MUTE_AMBIENCE_SCENE'); // Used to stop police sound in town

	mp.game.audio.setAudioFlag('LoadMPData', true);
	mp.game.audio.setAudioFlag('DisableFlightMusic', true);

	mp.game.audio.clearAmbientZoneState('AZ_DISTANT_SASQUATCH', false);
	mp.game.audio.clearAmbientZoneState('AZ_COUNTRYSIDE_PRISON_01_ANNOUNCER_GENERAL', false); // Turn off prison sound
	mp.game.audio.clearAmbientZoneState('AZ_COUNTRYSIDE_PRISON_01_ANNOUNCER_WARNING', false); // Turn off prison sound
	mp.game.audio.clearAmbientZoneState('AZ_COUNTRYSIDE_PRISON_01_ANNOUNCER_ALARM', false); // Turn off prison sound

	mp.game.audio.setAmbientZoneState('', false, false);

	mp.game.invoke('0xF314CF4F0211894E', 143, PAUSE_MENU_COLOR_RGB.R, PAUSE_MENU_COLOR_RGB.G, PAUSE_MENU_COLOR_RGB.B, 0.25);
	mp.game.invoke('0xF314CF4F0211894E', 116, PAUSE_MENU_COLOR_RGB.R, PAUSE_MENU_COLOR_RGB.G, PAUSE_MENU_COLOR_RGB.B, 0.5);

	mp.game.gxt.set('PM_PAUSE_HDR', PAUSE_MENU_TITLE);
}

mp.events.add('render', () => {
	// mp.game.controls.disableControlAction(2, 37, true); // Disable TAB
	mp.game.controls.disableControlAction(2, 19, true); // Disable Character Wheel
});

mp.events.add('playerReady', handleTick);
