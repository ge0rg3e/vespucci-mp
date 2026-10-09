import React, { useEffect, useState } from 'react';

// Dependencies
import { formatNumber } from '@/utils/helpers';
import { ButtonBase, TextField } from '@mui/material';

// Context
import { CartState } from '../../../../../contexts/cart';

const Component = (props: ExpectedAny) => {
	const { removeItemFromCart, updateItemInCart, shiftPressed } = CartState();
	const [quantity, setQuantity] = useState(props.data.quantity || 1);

	const onQuantityChanged = (id: string, value: ExpectedAny) => {
		// A limit to how many they can write to not break the UI..
		if (value.length > '999999999'.length) return false;

		// Update visually
		setQuantity(value);

		// Format the new value..
		let newValue = parseInt(value);

		// They didn't type anyt    hing.
		if (isNaN(newValue)) return false;

		if (newValue < 1) {
			removeItemFromCart(id);
		}

		updateItemInCart(id, value);
	};

	const increaseQuantity = () => {
		const stackSize = shiftPressed ? 10 : 1;
		updateItemInCart(props.data.id, +props.data.quantity + stackSize);
	};

	const decreaseQuantiy = () => {
		const stackSize = shiftPressed ? 10 : 1;
		updateItemInCart(props.data.id, +props.data.quantity - stackSize);
	};
	// When the user updates the main list by clicking this must be kept up-to-date.
	useEffect(() => {
		setQuantity(props.data.quantity);
	}, [props.data.quantity]);

	return (
		<React.Fragment>
			<div className="entry">
				<div className="thumbnail">
					<img
						onLoad={(ev: UndefinedAny) => (ev.target.className += ` loaded`)}
						onContextMenu={(e) => e.preventDefault()}
						onDragStart={(e) => e.preventDefault()}
						className={`image grid-image-size`}
						{...props.data.imageObject}
					/>
				</div>
				<div className="details">
					<div className="name">{props.data.name}</div>
					<div className="totalCost">
						{formatNumber(props.data.totalPrices.cash, true)}
					</div>
				</div>
				<div className="quantity-controller">
					<ButtonBase className="btn left-button" onClick={decreaseQuantiy}>
						<i className="icon fa-solid fa-minus"></i>
					</ButtonBase>
					<TextField
						value={quantity}
						className="input"
						type="number"
						placeholder="Quantity"
						onChange={(ev) => onQuantityChanged(props.data.id, ev.target.value)}
						variant="standard"
						fullWidth={true}
					/>
					<ButtonBase className="btn right-button" onClick={increaseQuantity}>
						<i className="icon fa-solid fa-plus"></i>
					</ButtonBase>
				</div>
			</div>
		</React.Fragment>
	);
};

export default Component;
