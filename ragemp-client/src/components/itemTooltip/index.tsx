import React, { useEffect, useState } from 'react';

// Dependencies
import { useStateRef } from '@/utils/helpers';
import { ComponentProps } from './types';

const Component = (props: ComponentProps) => {
	const [itemData, setItemData, itemDataRef] = useStateRef(null);
	const [style, setStyle] = useState<ExpectedAny>({
		left: 0,
		top: 0,
		visibility: 'hidden'
	});

	const getTooltipData = (type: string, id: string) => {
		// If the item type is not of interest.
		if (!isItemTypeOfInterest(type)) return undefined;

		// Get the item by id and all his data.
		const item = props.getItemById(id);

		return item;
	};

	const isItemTypeOfInterest = (type: string) => {
		// Defining what data-type attributes can have a tooltip.
		const allowedTypes = props.itemTypes;

		// When the mouse moves over an item that has an "data-type" of interest..
		if (allowedTypes.includes(type)) return true;

		return false;
	};

	const hideTooltip = () => {
		setItemData(null);
		setStyle({ left: 0, top: 0, visibility: 'hidden' });
	};

	const updateTooltipPosition = async (coords: { x: number; y: number }) => {
		// Extract the mouse coords from the parameters (if passed) if not use variables.
		const { x, y } = coords;

		// Get element -The tooltip itself that we render down in this component.
		const tooltipElement = document.getElementsByClassName('component-item-tooltip')[0];

		// Get element - The container to know the limits boundaries of the container of the items.
		const container = document.getElementById(props.containerElementId);

		// Get element - The slot we're hovering.
		const slot: UndefinedAny = document.elementFromPoint(x, y);

		// If the tooltip or the container is not rendered because of an error.
		if (!tooltipElement || !container) return false;

		// Get the elements position and size relative to the viewport of their screen.
		const toltipBoundaries = tooltipElement.getBoundingClientRect();
		const containerBoundaries = container.getBoundingClientRect();
		const itemSlotBoundaries = slot.getBoundingClientRect();

		// Variables to make these calculations..
		const tooltipElementHeight = toltipBoundaries.height;

		let top = 0;
		let left = x - 130;

		// If the tooltip height (/w contents) is enough to display under the mouse
		if (y + tooltipElementHeight + 50 > containerBoundaries.bottom) {
			top = itemSlotBoundaries.top - tooltipElementHeight - 5;
		} else {
			//  We display the tooltip above the mouse..
			top = y + 50;
		}

		setStyle({
			left: left,
			top: top,
			visibility: 'unset'
		});
	};

	const onMouseMove = (event: ExpectedAny) => {
		const { clientX, clientY } = event;

		// Is disabled for now..
		if (props.isDisabled !== undefined && props.isDisabled()) return false;

		// Get what element our mouse is over
		const element: UndefinedAny = document.elementFromPoint(clientX, clientY);

		// None to check.
		if (!element) return false;

		// Extract the element's attribute data-type.
		const type = element.getAttribute('data-type');

		// When the mouse moves over an item that has an "data-type" of interest..
		if (isItemTypeOfInterest(type)) {
			// Extract the id
			const id = element.getAttribute('data-id');

			// We update the position of the tooltip div (absolute)
			updateTooltipPosition({ x: clientX, y: clientY });

			// If we're already hovering this id it means the data is already accurate.
			if (itemDataRef.current !== null && itemDataRef.current.id === id) return false;

			// We extract the tooltip data..
			const fetchData: FixableAny = getTooltipData(type, id);

			// There's no tooltip data. Error?
			if (fetchData === undefined) return false;

			// Update the tooltip data visaully.
			setItemData({ ...fetchData });

			return false;
		}

		// When they moved the mouse  away from an item of interest.
		if (!isItemTypeOfInterest(type) && itemDataRef.current !== null) {
			// Hide away the tooltip div and reset everything.
			hideTooltip();
		}
	};

	useEffect(() => {
		document.addEventListener('mousemove', onMouseMove);
		document.addEventListener(`itemTooltip:hide`, hideTooltip);

		// If they want to call an event on mount.
		if (props.onMounted) {
			props.onMounted();
		}

		return () => {
			document.removeEventListener('mousemove', onMouseMove);
			document.removeEventListener(`itemTooltip:hide`, hideTooltip);
		};
		// eslint-disable-next-line
	}, []);

	// If there's no tooltip data to show..

	if (itemData === null || (props.isDisabled !== undefined && props.isDisabled())) return null;

	return (
		<React.Fragment>
			<div
				className={`component-item-tooltip ${props.tooltipClassName || ''}`}
				style={{ ...style }}
			>
				{props.renderTooltip(itemData)}
			</div>
		</React.Fragment>
	);
};

export default Component;
