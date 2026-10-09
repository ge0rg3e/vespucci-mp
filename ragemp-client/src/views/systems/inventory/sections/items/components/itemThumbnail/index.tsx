import { formatNumber } from '@/utils/helpers';
import { mapClothesPlurals } from '@/views/systems/businesses/clothesManage';
import { ComponentState } from '@/views/systems/inventory';
import React from 'react';
import { InventoryItem } from '../types';
import { getItemImage } from './functions';

const Component = (props: ExpectedAny) => {
	const { getClothingMeta } = ComponentState();

	const getImageProps = (itemData: InventoryItem, itemMeta: ExpectedAny) => {
		const returnObj: ExpectedAny = {};

		const itemImage = getItemImage(itemData);

		returnObj.src = itemImage;

		// If is clothing..
		if (itemData.itemId === 3) {
			const clothing = getClothingMeta(itemData.meta.clothingId);

			// This is stupid, we should add a prop isclothingProp or something.
			if (clothing) {
				// Converting the categories "undershirts" => "undershirt"
				const key = mapClothesPlurals[clothing.type] ? mapClothesPlurals[clothing.type] : clothing.type;

				returnObj.onError = (ev: UndefinedAny) =>
					(ev.target.src = `/assets/images/systems/inventory/clothes/${key}.png`);

				returnObj.onLoad = (ev: UndefinedAny) => {
					ev.target.parentNode.className += ' with-glow';
					ev.target.className += ` loaded`;
				};
			}
		}

		return returnObj;
	};

	return (
		<React.Fragment>
			<div className="content">
				<div className="thumbnail">
					<img
						onLoad={(ev: UndefinedAny) => (ev.target.className += ` loaded`)}
						onContextMenu={(e) => e.preventDefault()}
						onDragStart={(e) => e.preventDefault()}
						className={`image grid-image-size`}
						{...getImageProps(props.data, props.itemMeta)}
					/>
				</div>
				{props.data.quantity > 1 && <div className="quantity">{formatNumber(props.data.quantity)}</div>}
				<div className="hidden-background"></div>
			</div>
		</React.Fragment>
	);
};

export default Component;
