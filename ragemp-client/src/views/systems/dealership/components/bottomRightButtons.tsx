import React, { useState, useEffect } from 'react';
import { DealershipState } from '..';

// Components
import { Button } from '@mui/material';

// Language
import * as i18n from '@vmp/i18n';
import Language from './bottomRightButtons.lang';
const languagePackId = `SYSTEM_DEALERSHIP_RIGHT_BUTTONS`;
i18n.createLanguagePack(languagePackId, Language);

const Component = () => {
	const lang = i18n.getLanguagePack(languagePackId, window.language);
	// const lang = i18n.getLanguagePack(languagePackId, 'RO');
	const { getVehicleSelected, colors } = DealershipState();
	const [chooseBuyOptions, setChooseBuyOptions] = useState(false);

	const vehicle = getVehicleSelected();

	useEffect(() => {
		setChooseBuyOptions(false);
	}, [vehicle]);

	const pressedbuy = () => {
		// If the vehicle can be bougth with either currencies
		if (vehicle.price > 0 && vehicle.bcPrice > 0) {
			setChooseBuyOptions(true);
			return false;
		}

		window.rpc.triggerServer(
			`purchaseVehicleDealership`,
			JSON.stringify({
				stockId: vehicle.id,
				purchaseMethod: vehicle.bcPrice === 0 ? 'cash' : 'coins',
				cost: vehicle.bcPrice === 0 ? vehicle.price : vehicle.bcPrice,
				colors
			})
		);
	};

	const selectBuyMethod = (method: number) => {
		window.rpc.triggerServer(
			`purchaseVehicleDealership`,
			JSON.stringify({
				stockId: vehicle.id,
				purchaseMethod: method === 1 ? 'cash' : 'coins',
				cost: method === 1 ? vehicle.price : vehicle.bcPrice,
				colors
			})
		);
	};

	const requestTestDrive = () => {
		window.rpc.triggerServer(
			`testDriveDealership`,
			JSON.stringify({
				stockId: vehicle.id,
				colors
			})
		);
	};

	return (
		<React.Fragment>
			<div className="system-bottom-right">
				<div className="content">
					{chooseBuyOptions === false ? (
						<React.Fragment>
							<div className="heading">{lang.get('HaveDecidedHeading')}</div>
							<div className="buttons-placement">
								<Button
									variant="outlined"
									color="secondary"
									className="test-drive-button"
									onClick={requestTestDrive}
								>
									Test Drive
								</Button>
								<Button
									disabled={vehicle.quantity < 1}
									className="buy-button"
									variant="contained"
									color="primary"
									onClick={pressedbuy}
								>
									{lang.get('BuyVehicle')}
								</Button>
							</div>
						</React.Fragment>
					) : (
						<React.Fragment>
							<div className="heading">{lang.get('PaymentHeading')}</div>
							<div
								className="cancel-option"
								onClick={() => setChooseBuyOptions(false)}
							>
								<i className="icon fa-solid fa-circle-xmark"></i>
							</div>
							<div className="buttons-placement">
								<Button
									variant="outlined"
									color="primary"
									onClick={() => selectBuyMethod(2)}
								>
									Beach Coins
								</Button>
								<Button
									variant="contained"
									color="primary"
									onClick={() => selectBuyMethod(1)}
								>
									Cash
								</Button>
							</div>
						</React.Fragment>
					)}
				</div>
			</div>
		</React.Fragment>
	);
};

export default Component;
