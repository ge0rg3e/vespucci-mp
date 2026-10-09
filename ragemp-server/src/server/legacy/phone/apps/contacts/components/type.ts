import { ContactsAttributes } from '@modules/database/game/contacts/model/types';

declare global {
	interface PhoneContact extends ContactsAttributes {
		id: number;
	}

	interface PlayerVariables {
		phoneContacts: Array<PhoneContact>;
	}
}
export {};
