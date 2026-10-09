import { logError } from '@server/utils/helpers';
import { v4 as uuidv4 } from 'uuid';

export let offers: Array<Offer> = [];

/**
 * A function that will create an offer in the system.
 * @param params
 */

export const createOffer = (payload?: Record<string, ExpectedAny>) => {
	try {
		// Allocate an id.
		const uuid = uuidv4();

		// Add the offer..
		offers.push({
			uuid,
			payload: payload || {},
			createdAt: new Date(),
			status: 'pending'
		});

		return uuid;
	} catch (err) {
		logError(`createOffer`, err, { payload });
		return null;
	}
};

/**
 * This will delete the offer from the system.
 * @param uuid
 */

export const deleteOffer = (uuid: string) => {
	try {
		const index = offers.findIndex((c) => c.uuid === uuid);
		if (index === -1) return false;

		offers.splice(index, 1);

		return true;
	} catch (err) {
		logError(`deleteOffer`, err, { uuid });
		return false;
	}
};

/**
 * This will return you the deal details.
 * @param uuid
 */

export const getOfferByUuid = (uuid: string) => {
	try {
		const index = offers.findIndex((c) => c.uuid === uuid);
		if (index === -1) return null;
		return offers[index];
	} catch (err) {
		logError(`getOfferByUuid`, err, { uuid });
		return null;
	}
};

/**
 * Updates the offer status.
 * @param uuid
 * @param status
 * @returns
 */

export const updateOfferStatus = (uuid: string, status: Offer['status']) => {
	try {
		const index = offers.findIndex((c) => c.uuid === uuid);
		if (index === -1) return false;

		// Update status
		offers[index].status = status;

		return true;
	} catch (err) {
		logError(`updateOfferStatus`, err, { uuid, status });
		return false;
	}
};
