import { formatNumber } from '@/utils/helpers';
import React from 'react';
import { DealershipState } from '..';

// Language
import * as i18n from '@vmp/i18n';
import Language from './information.lang';
const languagePackId = `SYSTEM_DEALERSHIP_INFORMATION`;
i18n.createLanguagePack(languagePackId, Language);

const Component = () => {
	const lang = i18n.getLanguagePack(languagePackId, window.language);
	// const lang = i18n.getLanguagePack(languagePackId, 'RO');

	const { getVehicleSelected } = DealershipState();
	const vehicle = getVehicleSelected();

	return (
		<div className="information-box">
			<div className="info-icon">
				<i className="elm fa-solid fa-circle-info"></i>
			</div>
			<div className="model">{vehicle.nativeInfo.displayName}</div>
			<div className="manufacturer">{vehicle.nativeInfo.manufacturerDisplayName}</div>

			{vehicle.quantity > 0 ? (
				<React.Fragment>
					{vehicle.price ? (
						<div className="entry">
							<div className="label price">{lang.get('Price')}:</div>
							<div className="value">{formatNumber(vehicle.price, true)}</div>
						</div>
					) : null}

					{vehicle.bcPrice ? (
						<div className="entry">
							<div className="label">Beach Coins</div>
							<div className="value">{formatNumber(vehicle.bcPrice, false)} BC</div>
						</div>
					) : null}
				</React.Fragment>
			) : (
				<div className="out-of-stock">{lang.get('OutOfStock')}</div>
			)}
		</div>
	);
};

export default Component;
