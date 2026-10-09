// Dependencies

import './components/callbacks';
import './components/langs';

mp.events.add('gamemodeStarted', () => {
	// This app will not be installed in a live environment.
	if (process.env.ENVIRONNMENT === 'production') return false;

	// Installing the app..
	mp.phone.install({
		id: `testerToolkit`,
		sortNumber: 0,
		checkAccess: () => true
	});

	return true;
});
