import React, { useEffect, useState } from 'react';
import { ComponentState } from '@/views/systems/inventory';

// Component
import ItemThumbnail from '../itemThumbnail';

const Component = (props: UndefinedAny) => {
	const { refs } = ComponentState();
	const [isItemBeingDragged, setIsItemDragged] = useState(false);

	useEffect(() => {
		// This is a bugfix for when changing tabs.
		if (props.emptySlot === true) return;
		if (refs.current.activeDragId === props.data.id && refs.current.activeDragType === `item`) {
			setIsItemDragged(true);
		}
	}, [refs.current.page, refs.current.activeDragId]);

	if (props.emptySlot === true) {
		return (
			<div
				className="item empty-slot"
 				data-type={'empty-slot'}
				data-draggable={'false'}
				data-slot={props.slotNumber}
				id={`item-${props.slotNumber}`}
			>
				<div className="content"></div>
			</div>
		);
	}

	return (
		<React.Fragment>
			<div
				className={`item ${isItemBeingDragged === true && `being-dragged`}`}
				data-type={'item'}
				data-draggable={'true'}
				draggable={true}
 				data-slot={props.slotNumber}
				data-id={`${props.data.id}`}
				id={`item-${props.data.id}`}
			>
				<ItemThumbnail data={props.data} itemMeta={props.itemMeta} />
			</div>
		</React.Fragment>
	);
};

export default Component;
