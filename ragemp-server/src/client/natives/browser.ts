import * as rpc from 'rage-rpc';

let cefInstance: UndefinedAny | null = null;
let cefLanguage: 'RO' | 'EN' | undefined = 'EN';

// let cefDomainStored: any = null;

export const cefAboveGameInterface = (bool: boolean) => {
	cefInstance.active = bool;
};

export const getLanguage = () => cefLanguage;

rpc.register('browser:launch', (args: ExpectedAny) => {
	const { cefDomain } = JSON.parse(args);
	cefInstance = mp.browsers.new(cefDomain);

	// cefDomainStored = cefDomain;

	return new Promise((resolve, reject) => {
		mp.events.add('browserDomReady', async () => {
			const { language } = mp.storage.data;

			if (language) {
				rpc.triggerBrowsers('setLanguage', JSON.stringify({ language }));
				cefLanguage = language;
			}

			// @Bugfix: It needs a few miliseconds for the event to set up right.
			await mp.game.waitAsync(300);
			cefInstance.active = true;
			resolve(true);
		});

		mp.events.add('browserLoadingFailed', () => reject('Browser loading failed'));
	});
});

rpc.on('setGameLanguage', (args) => {
	const { language } = JSON.parse(args);

	cefLanguage = language;
	mp.storage.data.language = language;
	mp.storage.flush();

	rpc.triggerBrowsers('setLanguage', JSON.stringify({ language }));
});

rpc.on(`updateLocalStorage`, (args) => {
	const { key, payload } = JSON.parse(args);
	mp.storage.data[key] = payload;
	mp.storage.flush();
});

rpc.register(`getLocalStorage`, (args) => {
	const { id } = JSON.parse(args);

	// In case we ever fetch this but is empty, is better to have it like this.
	if (id === 'playerMeta' && !mp.storage.data[id]) {
		return {}; // an empty object to avoid problems
	}

	return mp.storage.data[id];
});

rpc.on('setBrowserPage', (args) => {
	const { page } = JSON.parse(args);
	rpc.triggerBrowsers('setPage', JSON.stringify({ page }));
});
