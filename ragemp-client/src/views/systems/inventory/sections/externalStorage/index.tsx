import React from 'react';
import { ComponentState, MAX_INVENTORY_SLOTS_PER_PAGE } from '../../index';

// Dependencies
import { generateEmptyArray } from '@/utils/helpers';

// Components
import SeparateItem from './components/entry';
import { SeparatedItem } from './components/entry/types';

const Component = () => {
	const { data, useSeparateInventory, getItemMeta, isDarkEnvironment } = ComponentState();

	const getSlotProps = (slotIndex: number) => {
		const itemData = data.remoteSeparateInventory.items.find(
			(item: SeparatedItem) => item.slotId === slotIndex
		);
		if (itemData) {
			const meta = getItemMeta(itemData.itemId);
			return {
				data: itemData,
				itemMeta: meta
			};
		} else
			return {
				data: null,
				meta: null,
				emptySlot: true
			};
	};

	if (data.remoteSeparateInventory === null || useSeparateInventory === false) return null;

	return (
		<React.Fragment>
			<div className="external-side  two-inventories">
				<div className={`separated-inventory items ${isDarkEnvironment && `night`}`}>
					<div className="inventory-header">
						{' '}
						{data.remoteSeparateInventory.title[window.language]}
					</div>
					<div className="entries grid-items-framework grid-items" id="pickup-entries">
						{generateEmptyArray(MAX_INVENTORY_SLOTS_PER_PAGE).map((_, index) => (
							<SeparateItem slotNumber={index} key={index} {...getSlotProps(index)} />
						))}
					</div>
				</div>
			</div>
		</React.Fragment>
	);
};

export default Component;
