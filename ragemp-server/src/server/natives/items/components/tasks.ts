import moment from 'moment';
import { DroppedItem } from './types';

const CLEAR_ITEMS_EVERY_MINUTES = 30; // Every 30 minutes

const clearItems = () => {
	const items = mp.items.getAllDroppedItems();

	items.forEach((item: DroppedItem) => {
		const diff = moment(new Date()).diff(new Date(item.droppedAt), 'minutes');
		if (diff >= 15) {
			mp.items.deleteDroppedItemById(item.id);
		}
	});
};

setInterval(clearItems, CLEAR_ITEMS_EVERY_MINUTES * 60 * 1000);
