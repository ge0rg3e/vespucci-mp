import React from 'react';
import { CartState } from '../../../contexts/cart';
import { formatNumber } from '@/utils/helpers';
import { getItemImage } from '@/views/systems/inventory/sections/items/components/itemThumbnail/functions';

const Component = (props: ExpectedAny) => {
	const { getItemFromCart } = CartState();

	// If this is empty..
	if (props.emptySlot === true) {
		return (
			<div className="entry empty-slot" data-type={'empty-slot'} id={`item-${props.slotNumber}`}>
				<div className="content"></div>
			</div>
		);
	}

	const getCartItem = () => {
		const match = getItemFromCart(props.id);
		if (match) return match;
		return null;
	};

	return (
		<React.Fragment>
			<div className={`entry`} data-type={'item'} data-id={`${props.id}`}>
				<div className={`content ${getCartItem() && 'added-to-cart'}`}>
					<div className="price">{formatNumber(props.data.prices.cash, true)}</div>
					<div className="thumbnail">
						<img
							onLoad={(ev: UndefinedAny) => (ev.target.className += ` loaded`)}
							onContextMenu={(e) => e.preventDefault()}
							onDragStart={(e) => e.preventDefault()}
							className={`image grid-image-size`}
							{...getItemShopImage(props.type, props.data, props.details)}
						/>
					</div>

					{/* For later for player shops.. */}
					{/* <div className="quantity">345</div> */}

					{getCartItem() && (
						<React.Fragment>
							<div className="cart">
								<div className="quantity-selected">{getCartItem().quantity}</div>
							</div>
						</React.Fragment>
					)}
				</div>
			</div>
		</React.Fragment>
	);
};

/**
 *
 * @param type The item of the shop item: items or shopItems
 * @param data Data of an item
 * @param details Details of an item
 * @returns the object { src, on Error }
 */

export const getItemShopImage = (type: string, data: ExpectedAny, details: ExpectedAny) => {
	let itemImage = null;

	// If is a game item.
	if (type === 'item') {
		itemImage = getItemImage(data);
	} else {
		itemImage = details.image;
	}

	let returnObj: ExpectedAny = {
		src: itemImage,
		onError: (ev: ExpectedAny) => (ev.target.src = `/assets/images/systems/businesses/shops/noItemImage.png`)
	};

	return returnObj;
};

export default Component;
