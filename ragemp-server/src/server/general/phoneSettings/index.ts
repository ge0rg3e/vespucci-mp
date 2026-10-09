import './components/callback';

mp.events.add('gamemodeStarted', () => {
	// Installing the app..
	mp.phone.install({
		id: `settings`,
		sortNumber: 4,
		checkAccess: () => true
	});

	return true;
});
