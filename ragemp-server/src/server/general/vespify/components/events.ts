mp.events.add('gamemodeStarted', () => {
	// Installing the apps
	mp.phone.install({ id: `vespify`, sortNumber: 5, checkAccess: () => true });

	// Give them access to the vespify music app
	mp.phone.install({ id: `vespifyMusic`, sortNumber: 6, checkAccess: () => true });
	return true;
});
