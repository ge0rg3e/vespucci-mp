import React from 'react';
import { CartState } from '../../contexts/cart';

// Components
import SelectionGuidance from './components/selectionGuidance';
import Cart from './components/cart';

const Component = () => {
	const { cart } = CartState();

	return (
		<div className="layout-sidebar">{cart.length > 0 ? <Cart /> : <SelectionGuidance />}</div>
	);
};

export default Component;
