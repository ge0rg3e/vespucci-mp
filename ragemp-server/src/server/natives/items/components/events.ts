import moment from 'moment';
import { DroppedItem } from './types';

const expiredDroppedItems = () => {
	const items = mp.items.getAllDroppedItems();

	items.forEach((item: DroppedItem) => {
		if (!item.expiresAt) return;

		const diff = moment(new Date()).diff(new Date(item.expiresAt), 'minutes');

		if (diff >= 0) {
			mp.items.deleteDroppedItemById(item.id);
		}
	});
};

setInterval(expiredDroppedItems, 5 * 60 * 1000);
