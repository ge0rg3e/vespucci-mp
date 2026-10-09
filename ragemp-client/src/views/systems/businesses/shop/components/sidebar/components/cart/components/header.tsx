import React from 'react';

// Context
import { CartState } from '@/views/systems/businesses/shop/contexts/cart';
import { formatNumber } from '@/utils/helpers';

// Language
import { createLanguagePack, getLanguagePack } from '@vmp/i18n';
import LanguagePack from './header.lang';
const LanguageSystemId = 'business:shop:cart:header';
createLanguagePack(LanguageSystemId, LanguagePack);

const Component = () => {
	const { getCartTotal } = CartState();
	const lang = getLanguagePack(LanguageSystemId, window.language);

	return (
		<React.Fragment>
			<div className="component-header">
				<div className="icon">
					<i className="elm fa-regular fa-basket-shopping"></i>
				</div>
				<div className="details">
					<div className="text">{lang.get('text')}</div>
					<div className="description">
						{lang.get('description', {
							amount: formatNumber(getCartTotal().totalQuantity, false)
						})}
					</div>
				</div>
			</div>
		</React.Fragment>
	);
};

export default Component;
