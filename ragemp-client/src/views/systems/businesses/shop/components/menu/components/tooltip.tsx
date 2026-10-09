import React from 'react';

import { formatNumber } from '@/utils/helpers';

// Language
import { createLanguagePack, getLanguagePack } from '@vmp/i18n';
import LanguagePack from './tooltip.lang';
const LanguageSystemId = 'business:shop:tooltip';
createLanguagePack(LanguageSystemId, LanguagePack);

const Component = (props: ExpectedAny) => {
	const lang = getLanguagePack(LanguageSystemId, window.language);

	const getPrice = () => props.data.prices.cash;

	const getProperties = () => {
		let properties: ExpectedAny = [];

		// If they have server-side properties
		if (props.details.properties && props.details.properties.length > 0) {
			properties = [...props.details.properties];
		}

		return properties;
	};

	return (
		<React.Fragment>
			<div className="title">{props.details.name}</div>
			<div className="description">
				{props.details.description || `No description. Lazy Developer?`}
			</div>
			<div className="cart-price">
				<div className="label">{lang.get('Price')}</div>
				<div className="value">{formatNumber(getPrice(), true)} </div>
			</div>

			{getProperties().length > 0 && (
				<React.Fragment>
					<div className="divider" />
					<div className="specifications">
						{getProperties().map((specification: FixableAny, index: number) => (
							<div key={index} className="entry">
								<div className="label">{specification.label}</div>
								<div className="value">{specification.value}</div>
							</div>
						))}
					</div>
				</React.Fragment>
			)}
		</React.Fragment>
	);
};
export default Component;
