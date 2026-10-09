import React, { useEffect, createContext, useContext } from 'react';

// Dependencies
import { useStateRef } from '@/utils/helpers';

// Context
const Context: ExpectedAny = createContext({});
export const CartState: ExpectedAny = () => useContext(Context);

// Parent App Context
import { ComponentState } from '..';
import { getItemShopImage } from '../components/menu/components/item';

const Component = (props: ExpectedAny) => {
	const [cart, setCart, cartRef] = useStateRef([]);
	const { data, getItemById } = ComponentState();
	const [shiftPressed, setShiftPressed, shiftPressedRef] = useStateRef(false);

	// Adds an item to the cart or updates their quantity.
	const addItemToCart = (id: string, quantity: number) => {
		// Check if item is in cart.
		const itemInCart = getItemFromCart(id, true);
		if (itemInCart) return false; // Wrong usage. it should have been used updateItemInCart.

		// Add it..
		setCart((currentState: ExpectedAny) => {
			let newArr = [...currentState];

			newArr.push({
				id,
				quantity
			});

			return newArr;
		});
	};

	// Update the item quantity.
	const updateItemInCart = (id: string, quantity: number) => {
		// Check if item is in cart.
		const itemInCart = getItemFromCart(id, true);
		if (!itemInCart) return false; // Wrong usage. it should have been used addItemToCart.

		// Add it..
		setCart((currentState: ExpectedAny) => {
			let newArr = [...currentState];

			// Get the index
			const index = newArr.findIndex((i: ExpectedAny) => i.id === id);
			if (index == -1) return newArr; // No index.

			// Update..
			newArr[index] = {
				...newArr[index],
				quantity
			};

			// Less than zero must be eliminated
			if (quantity < 1) {
				newArr.splice(index, 1);
			}

			return newArr;
		});
	};

	// Remove item from cart
	const removeItemFromCart = (id: string) => {
		// Check if item is in cart.
		const itemInCart = getItemFromCart(id, true);
		if (!itemInCart) return false; // Wrong usage. it should have been used addItemToCart.

		// Add it..
		setCart((currentState: ExpectedAny) => {
			let newArr = [...currentState];

			// Get the index
			const index = newArr.findIndex((i: ExpectedAny) => i.id === id);
			if (index == -1) return newArr; // No index.

			// Remove....
			newArr.splice(index, 1);

			return newArr;
		});
	};

	// Returns the cart total price and length.
	const getCartTotal = () => {
		let cash = 0;
		let totalQuantity = 0;

		data.items.map((item: ExpectedAny) => {
			// Get item from cart
			const cartItem = getItemFromCart(item.id);
			if (!cartItem) return;

			// Cash price..
			cash += item.data.prices.cash * cartItem.quantity;

			// The total quantity..
			totalQuantity += +cartItem.quantity; // the plus is there to fix a js bug, it was plusing as srtings.
		});

		return {
			// @Reminder: Also defined in the getCartItemscheckoutList. If you change this, change that too.
			prices: {
				cash: cash
			},
			totalQuantity
		};
	};

	// Gets us if this item is in cart
	const getItemFromCart = (id: string, useRef = false) => {
		const source = useRef ? cartRef.current : cart;
		const match = source.find((i: ExpectedAny) => i.id === id);
		return match ? match : null;
	};

	// Returns the cart items for the checkout interface.
	const getCartItemsCheckoutList = () => {
		const checkoutItems: ExpectedAny = [];

		cart.forEach((cart: ExpectedAny) => {
			// Get item data
			const itemData = getItemById(cart.id);
			if (!itemData) return;

			checkoutItems.push({
				id: cart.id,
				name: itemData.details.name,
				quantity: cart.quantity,
				// @Reminder: Also defined in the getCartTotal. If you change this ,change that too.
				// This is used to display the cost for a single item.
				prices: {
					cash: itemData.data.prices.cash
				},
				// Used to know how much it costed in total.
				totalPrices: {
					cash: itemData.data.prices.cash * cart.quantity
				},
				imageObject: getItemShopImage(itemData.type, itemData.data, itemData.details)
			});
		});

		return checkoutItems;
	};

	const onLeftClickEvent = (event: ExpectedAny) => {
		// Attributes
		const type = event.target.getAttribute('data-type');
		const id = event.target.getAttribute('data-id');

		// If is not an item to be clicked on.
		if (type !== 'item') return false;

		// Getting the item
		const item = getItemById(id);
		if (!item) return false; // No item with that id.

		// Check current item is in cart
		const cartItem = getItemFromCart(id, true);
		const quantityUsed = shiftPressedRef.current ? 10 : 1;

		// If the item is in cart already
		if (cartItem) {
			updateItemInCart(id, cartItem.quantity + quantityUsed);
		} else {
			// If not we'll add it.
			addItemToCart(id, quantityUsed);
		}
	};

	const onRightClickEvent = (event: ExpectedAny) => {
		// This disable right click on the broswer (when developing in browser)
		event.preventDefault();

		// Attributes
		const type = event.target.getAttribute('data-type');
		const id = event.target.getAttribute('data-id');

		// If is not an item to be clicked on.
		if (type !== 'item') return false;

		// Check current item is in cart
		const cartItem = getItemFromCart(id, true);
		if (!cartItem) return false; // not in cart.

		// Key trick
		const quantityUsed = shiftPressedRef.current ? 10 : 1;

		if (cartItem.quantity >= quantityUsed + 1) {
			updateItemInCart(id, cartItem.quantity - quantityUsed);
		} else {
			removeItemFromCart(id);
		}
	};

	const onKeyDown = (event: ExpectedAny) => {
		if (event.keyCode === 16) {
			// Shift
			setShiftPressed(true);
		}
	};

	const onKeyUp = (event: ExpectedAny) => {
		if (event.keyCode === 16) {
			// Shift
			setShiftPressed(false);
		}
	};

	useEffect(() => {
		document.addEventListener('click', onLeftClickEvent);
		document.addEventListener('contextmenu', onRightClickEvent);
		document.addEventListener('keyup', onKeyUp);
		document.addEventListener('keydown', onKeyDown);

		return () => {
			document.removeEventListener('click', onLeftClickEvent);
			document.removeEventListener('contextmenu', onRightClickEvent);
			document.removeEventListener('keyup', onKeyUp);
			document.removeEventListener('keydown', onKeyDown);
		};
	}, []);

	const PassedProps = {
		getCartItemsCheckoutList,
		getCartTotal,
		getItemFromCart,
		cart,
		setCart,
		updateItemInCart,
		removeItemFromCart,
		shiftPressed
	};

	return <Context.Provider value={PassedProps}>{props.children}</Context.Provider>;
};

export default Component;
