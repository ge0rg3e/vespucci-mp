import React from 'react';

// Components
import ItemThumbnail from '../../../items/components/itemThumbnail';

// @Todo: Sa re-gandesc asta + external storage si sa le combin cumva intr-un singur component.

const Component = (props: UndefinedAny) => {
	// if is Empty..
	if (props.emptySlot === true) {
		return (
			<div
				className="item empty-dropped-slot empty-slot"
				data-type={'empty-dropped-slot'}
				data-draggable={'false'}
			>
				<div className="content"></div>
			</div>
		);
	}

	return (
		<React.Fragment>
			<div
				className="item"
				data-type={'dropped-item'}
				data-draggable={'true'}
				data-id={`${props.data.id}`}
				id={`dropped-item-${props.data.id}`}
			>
				<ItemThumbnail data={props.data} itemMeta={props.itemMeta} />
			</div>
		</React.Fragment>
	);
};

export default Component;
