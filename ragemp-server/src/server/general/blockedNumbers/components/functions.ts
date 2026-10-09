import { logError } from '@server/utils/helpers';

// Database
import BlockedNumbersDb from '@modules/database/game/blockedNumbers/repository';
import { Attributes } from '@modules/database/game/blockedNumbers/model/types';

let blockedNumbers: Array<Attributes> = [];

export const loadOnStartup = async () => {
	try {
		const data = await BlockedNumbersDb.findAll();
		blockedNumbers = data.map((x: ExpectedAny) => x.dataValues);
	} catch (err) {
		await logError(`blockedNumbers.loadOnStartup`, err);
	}
};

export const registerBlockedNumber = async (creatorId: number, phoneNumber: string) => {
	try {
		const newNumber = { creatorId, number: phoneNumber, createdAt: new Date() };
		const { id } = await BlockedNumbersDb.create(newNumber);
		blockedNumbers.push({ id, ...newNumber });

		return true;
	} catch (error) {
		await logError('registerBlockedNumber', error, { creatorId, phoneNumber });
		return false;
	}
};

export const removeBlockedNumber = async (phoneNumber: string) => {
	try {
		const find = blockedNumbers.find(({ number }) => number === phoneNumber);
		if (!find) return false;

		blockedNumbers = blockedNumbers.filter((number) => number.id !== find.id);
		await BlockedNumbersDb.destroy({ where: { creatorId: find.creatorId, number: phoneNumber } });

		return true;
	} catch (error) {
		await logError('deleteBlockedNumber', error, { phoneNumber });
		return false;
	}
};

export const isNumberBlocked = (creatorId: number, phoneNumber: string) => (blockedNumbers.find((number) => number.creatorId === creatorId && number.number === phoneNumber) ? true : false);

export const getBlockedNumbers = () => blockedNumbers;

export const getBlockedNumbersByCreator = (id: number) => blockedNumbers.filter((number) => number.creatorId === id);
