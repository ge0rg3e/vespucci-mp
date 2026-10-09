import React from 'react';

// Components
import { Button } from '@mui/material';

// Context
import { CartState } from '@/views/systems/businesses/shop/contexts/cart';

// Dependencies
import { formatNumber, logError } from '@/utils/helpers';

// Language
import { createLanguagePack, getLanguagePack } from '@vmp/i18n';
import LanguagePack from './payment.lang';
import { ComponentState } from '../../../../../';

const LanguageSystemId = 'business:shop:payment';
createLanguagePack(LanguageSystemId, LanguagePack);

const Component = () => {
	const { data } = ComponentState();
	const { cart, getCartTotal, setCart } = CartState();
	const lang = getLanguagePack(LanguageSystemId, window.language);

	const onPurchase = async () => {
		try {
			// Validate that we can buy these items
			const validBasket = await window.rpc.callServer(
				`shop:validateBasket@${data.id}`,
				JSON.stringify({ items: cart })
			);

			// Is not valid basket (aka maybe some item cannot be buyed due to server restrictions)
			if (!validBasket) return false;

			// Buy the basket...
			const response = await window.rpc.callServer(
				`shop:purchaseItems@${data.id}`,
				JSON.stringify({ items: cart })
			);

			// If response is wrong..
			if (!response) throw new Error(`Server-side didn't complete the purchase fully.`);
			// Once the basket is bought we clear out the current basket.
			setCart([]);
		} catch (err) {
			await logError(`shop:OnPurchase`, err);
			return false;
		}
	};

	return (
		<React.Fragment>
			<div className="component-payment">
				<div className="total">
					<div className="label">{lang.get('TotalCost')}</div>
					<div className="value">{formatNumber(getCartTotal().prices.cash, true)}</div>
				</div>
				<div className="callToAction">
					<Button variant="contained" color="primary" onClick={onPurchase}>
						{lang.get('PAY')}
					</Button>
				</div>
			</div>
		</React.Fragment>
	);
};

export default Component;
