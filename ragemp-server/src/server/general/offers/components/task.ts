import { logError } from '@server/utils/helpers';
import { deleteOffer, offers, updateOfferStatus } from './functions';
import moment from 'moment';

let ExpirationTask = async () => {
	try {
		// Iterate
		for (const offer of offers) {
			// Not of interest.
			if (offer.status !== 'pending') continue;

			// If is still hasn't passed 10 minutes.
			if (moment(new Date()).diff(offer.createdAt, 'minutes') < 10) continue;

			// Check their age and if is older than 1 hour we expire it.
			updateOfferStatus(offer.uuid, 'expired');
		}
	} catch (err) {
		await logError(`offers.ExpirationTask`, err);
	}
};

let CleanupTask = async () => {
	try {
		// Iterate
		for (const offer of offers) {
			// We allow them to exist for 30 minutes.
			if (moment(new Date()).diff(offer.createdAt, 'minutes') < 30) continue;

			// Check their age and if is older than 1 hour we expire it.
			deleteOffer(offer.uuid);
		}
	} catch (err) {
		await logError(`offers.ExpirationTask`, err);
	}
};

// Once every minute..
setInterval(ExpirationTask, 1 * 60 * 1000);
setInterval(CleanupTask, 1 * 60 * 1000);
