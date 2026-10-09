import { createRouter } from '@natives/router';

const languages: Array<{ code: languageCodes; label: string }> = [
	{ code: 'RO', label: 'Romanian' },
	{ code: 'EN', label: 'English' }
];

const route = createRouter('languages');

route.set({
	path: '/',
	method: 'GET',
	handler: (_req, res) => res.sendResponse(200, languages)
});

export default route;
