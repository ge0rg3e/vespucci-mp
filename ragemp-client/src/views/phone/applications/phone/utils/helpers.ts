export const groupContactsAlphabetically = (contacts: Array<PhoneContact>) => {
	// The array to hold them
	let categories: Array<{ letter: string; entries: Array<PhoneContact> }> = [];

	contacts.forEach((contact) => {
		// The first letter of the name
		const firstLetter = contact.name[0].toString().toUpperCase() || 'A';

		// The index for the category
		const catIndex = categories.findIndex((c) => c.letter === firstLetter);

		// If there is no index..
		if (catIndex === -1) {
			categories.push({
				letter: firstLetter,
				entries: [contact]
			});
		} else {
			// If is we just push another one.
			categories[catIndex].entries.push(contact);
		}
	});

	// Sort categories by letter alphabetically
	categories = categories.sort((a, b) => a.letter.localeCompare(b.letter));

	// Sort entries within each category alphabetically by contact name
	categories.forEach((category) => {
		category.entries = category.entries.sort((a, b) => a.name.localeCompare(b.name));
	});

	// We return the categories mapped..
	return categories;
};

export const alphabet = [
	'A',
	'B',
	'C',
	'D',
	'E',
	'F',
	'G',
	'H',
	'I',
	'J',
	'K',
	'L',
	'M',
	'N',
	'O',
	'P',
	'Q',
	'R',
	'S',
	'T',
	'U',
	'V',
	'W',
	'X',
	'Y',
	'Z'
];

export const getNavigationFooterItems = () => {
	const arr = [
		{
			label: 'Recents',
			icon: `fa-solid fa-clock-seven`,
			payload: {
				subRoute: 'recentCalls'
			}
		},
		{
			label: 'Contacts',
			icon: `fa-solid fa-circle-user`,
			payload: {
				subRoute: 'listContacts'
			}
		},
		{
			label: 'Keypad',
			icon: `fa-solid fa-grid`,
			payload: {
				subRoute: 'dialNumber'
			}
		}
	];

	return arr;
};
