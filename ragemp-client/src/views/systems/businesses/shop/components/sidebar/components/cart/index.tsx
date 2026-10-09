import React from 'react';

// Components
import Entry from './components/item';
import Payment from './components/payment';
import Header from './components/header';

// Context
import { CartState } from '../../../../contexts/cart';

const Component = () => {
	const { getCartItemsCheckoutList } = CartState();

	const basket = getCartItemsCheckoutList();

	return (
		<React.Fragment>
			<div className="component-cart">
				<Header />
				<div className="component-items">
					<div className="entries">
						{basket.map((entry: ExpectedAny, ix: number) => (
							<Entry data={entry} key={ix} />
						))}
					</div>
				</div>
				<Payment />
			</div>
		</React.Fragment>
	);
};

export default Component;
