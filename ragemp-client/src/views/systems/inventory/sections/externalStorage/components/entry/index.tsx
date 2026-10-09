import React from 'react';

// Components
import ItemThumbnail from '../../../items/components/itemThumbnail';

const Component = (props: UndefinedAny) => {
	if (props.emptySlot === true) {
		return (
			<div
				className="item empty-separate-slot"
				data-type={'empty-separated-slot'}
				data-draggable={'false'}
				data-slot={props.slotNumber}
			>
				<div className="content"></div>
			</div>
		);
	}

	return (
		<React.Fragment>
			<div
				className="item"
				data-type={'separated-item'}
				data-draggable={'true'}
				data-id={`${props.data.id}`}
				data-slot={props.slotNumber}
				id={`separated-item-${props.data.id}`}
			>
				<ItemThumbnail data={props.data} itemMeta={props.itemMeta} />
			</div>
		</React.Fragment>
	);
};

export default Component;
