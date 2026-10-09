import { conditionalClassNames, generateEmptyArray } from '@/utils/helpers';
import React from 'react';
import { ComponentState, MAX_INVENTORY_SLOTS_PER_PAGE } from '../..';

// Components

import Item from './components/entry';

const Component = () => {
	const { data, lang, page, getItemFromSlot, isMainFunctionality, getItemMeta, isNightInGame } =
		ComponentState();

	const getItemProps = (page: number, slot: number) => {
		const res = getItemFromSlot(page, slot);
		if (res) {
			const meta = getItemMeta(res.itemId);
			return {
				data: res,
				itemMeta: meta
			};
		} else {
			return {
				data: null,
				meta: null,
				emptySlot: true
			};
		}
	};

	return (
		<React.Fragment>
			<div
				className={conditionalClassNames(`items`, [
					{
						class: `night`,
						if: isNightInGame
					}
				])}
			>
				{!isMainFunctionality && (
					<div className="inventory-header">{lang.get('Inventory')}</div>
				)}
				<div className="entries grid-items-framework grid-items" id="storage-entries">
					{generateEmptyArray(MAX_INVENTORY_SLOTS_PER_PAGE).map((_, index) => (
						<Item key={index} slotNumber={index} {...getItemProps(page, index)} />
					))}
				</div>
				{data.remotePages[page].available === false && (
					<div className="page-locked">
						<div className="heading">{lang.get('InventoryPageLockedHeading')}</div>
						<div className="explanation">{lang.get('InventoryPageLockedContent')}</div>
					</div>
				)}
			</div>
		</React.Fragment>
	);
};
export default Component;
