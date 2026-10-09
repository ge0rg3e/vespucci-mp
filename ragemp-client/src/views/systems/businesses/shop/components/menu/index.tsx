import React, { useEffect, useState } from 'react';

// Components
import Item from './components/item';
import Tooltip from '@/components/itemTooltip';
import TooltipComponent from './components/tooltip';

//  Context
import { ComponentState } from '../..';
import { useStateRef } from '@/utils/helpers';

// Variables
let animationTimer: ExpectedAny = null;

const Component = () => {
	const { data, getItemById } = ComponentState();
	const [_, setAnimationFinished, animationFinishedRef] = useStateRef(false);

	const getNumberOfItemSlots = () => {
		const itemsPerRow = 6;
		const rows = 6;

		// @This should be responsive. so is not 7 rows when is resolution small.
		const defaultColumns = rows * itemsPerRow;

		return defaultColumns;
	};

	const getItemProps = (slot: number) => {
		// Find the item data..
		const res = data.items[slot];

		// If item data is found we return it.
		if (res) return res;

		// If not let's default to this..
		return {
			data: null,
			emptySlot: true
		};
	};

	useEffect(() => {
		// @Bugfix: We need to wait 1 sec until container slides in from the left to avoid tooltip position being loaded wrong.
		animationTimer = setTimeout(() => {
			// Callback
			setAnimationFinished(true);

			// Reset timer id
			animationTimer = null;
		}, 800);

		return () => {
			if (animationTimer !== null) {
				// Clear timeout
				clearTimeout(animationTimer);

				// Reset timer id
				animationTimer = null;
			}
		};
	}, []);

	return (
		<div className="layout-menu">
			<div className="items">
				<div className="container" id="items-container">
					<div className="entries grid">
						{Array.from({ length: getNumberOfItemSlots() }).map((_, index) => (
							<Item key={index} slotNumber={index} {...getItemProps(index)} />
						))}
					</div>
				</div>
			</div>
			<Tooltip
				containerElementId="items-container"
				getItemById={getItemById}
				itemTypes={['item']}
				tooltipClassName={`item-tooltip`}
				renderTooltip={(data) => <TooltipComponent {...data} />}
				isDisabled={() => (animationFinishedRef.current === false ? true : false)}
			/>
		</div>
	);
};

export default Component;
