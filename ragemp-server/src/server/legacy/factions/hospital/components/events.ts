mp.events.add('gamemodeStarted', () => {
	mp.playerAttachments.register(`bandage`, `prop_ducktape_01`, 60309, new mp.Vector3(0, 0, 0), new mp.Vector3(0, 0, 0));
	mp.playerAttachments.register(`medicKit`, `prop_ld_health_pack`, 60309, new mp.Vector3(0, 0, 0), new mp.Vector3(0, 0, 0));
});
