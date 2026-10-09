import Accounts from '@modules/database/game/accounts/repository';

// Create a new Map to store the phone book data.
const data = new Map<number, string>();

/**
   Load phone book data
*/
mp.events.add('gamemodeStarted', async () => {
	const accounts = await Accounts.findAll();

	accounts.forEach(({ id, phoneNumber }) => {
		if (!phoneNumber || phoneNumber === null) return;

		data.set(id, phoneNumber);
	});
});

/**
 * Generates a unique phone number.
 */
export const getPhoneNumberAllocated = () => {
	let phoneNumber: string;
	do {
		phoneNumber = Math.floor(100000 + Math.random() * 900000).toString();
	} while (findAccountIdByPhoneNumber(phoneNumber) !== null);
	return phoneNumber;
};

/**
    Finds an account ID by phone number.
    @param phoneNumber The phone number to search for.
    @returns The account ID associated with the phone number, or null if not found.
*/
export const findAccountIdByPhoneNumber = (phoneNumber: string) => [...data.entries()].find(([_, value]) => value === phoneNumber)?.[0] || null;

/**
    Finds a phone number by account ID.
    @param accountId The account ID to search for.
    @returns The phone number associated with the account ID, or null if not found.
*/
export const findPhoneNumberByAccountId = (accountId: number) => data.get(accountId) || null;

/**
    Adds a phone number to the phone book.
    @param accountId The account ID.
    @param number The phone number to add.
*/
export const addToPhoneBook = (accountId: number, number: string) => data.set(accountId, number);

/**
    Updates a phone number in the phone book.
    @param accountId The account ID.
    @param number The updated phone number.
*/
export const updatePhoneBook = (accountId: number, number: string) => data.set(accountId, number);

/**
    Deletes a phone number from the phone book.
    @param accountId The account ID to delete.
*/
export const deletePhoneBook = (accountId: number) => data.delete(accountId);
