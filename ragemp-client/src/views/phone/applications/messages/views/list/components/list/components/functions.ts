export const toSmallString = (str: string) => str.toString().toLowerCase().trim();

export const getNumberFromDisplayName = (contacts: Array<PhoneContact>, displayName: string) => {
	const matchContact = contacts.find((c: ExpectedAny) =>
		// Does it contain parts of string?
		toSmallString(c.name).includes(toSmallString(displayName))
	);

	return matchContact ? matchContact.number : null;
};
