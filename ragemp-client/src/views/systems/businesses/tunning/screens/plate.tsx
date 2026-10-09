import React, { useEffect } from 'react';
import { ComponentState } from '..';

// Dependencies
import { formatNumber, useStateRef } from '@/utils/helpers';

// Components
import Controls from '../components/controls';
import { TextField } from '@mui/material';

// Language
import { createLanguagePack, getLanguagePack } from '@vmp/i18n';
const LanguageSystemId = 'tunning:plateLabels';
import LanguagePack from './plate.language';
createLanguagePack(LanguageSystemId, LanguagePack);

// Variables
let plateTimer: ExpectedAny = null;
const regexPlate = new RegExp(`^[a-zA-Z0-9_]{1,8}$`);

const Component = () => {
	const { data, dataRef, setScreen } = ComponentState();
	const [inputValue, setInputValue, inputValueRef] = useStateRef(
		data.vehicle.modifications.plate || ''
	);

	const controlsLang = getLanguagePack('tunning:controlsLabels', window.language);
	const lang = getLanguagePack(LanguageSystemId, window.language);

	const isPurchasablePlate = (newPlate: string, isRefreshable = false) => {
		const oldPlate = !isRefreshable
			? dataRef.current.vehicle.modifications.plate
			: data.vehicle.modifications.plate;
		const currentBalance = isRefreshable ? data.balance : dataRef.current.balance;

		if (currentBalance < data.prices.changePlateText) return false;
		if (!(newPlate.length < 9 && newPlate.length > 0)) return false;
		if (oldPlate === newPlate) return false;
		if (!regexPlate.test(newPlate)) return false;

		return true;
	};

	const getControls = () => {
		const arr = [];

		arr.push({
			label: controlsLang.get('goBack'),
			onClick: () => {
				setScreen(null);
			}
		});

		if (isPurchasablePlate(inputValue, true)) {
			arr.push({
				label: controlsLang.get('purchase'),
				onClick: onPurchase
			});
		}

		return arr;
	};

	const onPurchase = async () => {
		if (!isPurchasablePlate(inputValueRef.current, false)) return false;

		await window.rpc.triggerServer(
			`tunning:purchase`,
			JSON.stringify({
				type: 'plate',
				payload: {
					value: inputValueRef.current
				}
			})
		);
	};

	useEffect(() => {
		// Trigger this
		window.rpc.triggerClient('tunning:showCursor', JSON.stringify({ value: true }));
		window.rpc.triggerClient('tunning:setCamera', JSON.stringify({ name: 'plate' }));

		// Focus onto input..
		const elm = document.getElementById('input');

		if (elm) {
			elm.focus();
		}

		return () => {
			window.rpc.triggerClient('tunning:setCamera', JSON.stringify({ name: 'idle' }));
			window.rpc.triggerClient('tunning:showCursor', JSON.stringify({ value: false }));

			// Reset it..
			previewVehiclePlate(dataRef.current.vehicle.modifications.plate);

			// Kill this timer..
			if (plateTimer !== null) {
				// Clear timeout
				clearTimeout(plateTimer);

				// Reset timer id
				plateTimer = null;
			}
		};
	}, []);

	const previewVehiclePlate = (text: ExpectedAny) => {
		window.rpc.triggerClient(
			'tunning:setVehicleModifications',
			JSON.stringify({
				...dataRef.current.vehicle.modifications,
				plate: text
			})
		);
	};

	const onPlateTextChange = (ev: ExpectedAny) => {
		const val = ev.target.value.substring(0, 8);
		setInputValue(val);

		if (plateTimer !== null) {
			// Clear timeout
			clearTimeout(plateTimer);

			// Reset timer id
			plateTimer = null;
		}

		if (isPurchasablePlate(val, false)) {
			plateTimer = setTimeout(() => {
				// Callback function
				previewVehiclePlate(val);

				// Reset timer id
				plateTimer = null;
			}, 500);
		}
	};

	const isValidPlate = () => {
		const oldPlate = data.vehicle.modifications.plate;

		if (inputValue.length < 1) return true;
		if (oldPlate === inputValue) return true;

		const isPurchasable = isPurchasablePlate(inputValue);
		return isPurchasable ? true : false;
	};

	return (
		<React.Fragment>
			<div className="layout-dialog">
				<div className="content">
					<div className="title">{lang.get('title')}</div>
					<div className="settings plate">
						<TextField
							fullWidth={true}
							id="input"
							variant="standard"
							value={inputValue}
							onChange={onPlateTextChange}
							error={isValidPlate() ? false : true}
							helperText={isValidPlate() ? undefined : lang.get('NotValidPlateText')}
						/>
					</div>
					<div className="prices">
						<div className="entry">
							<div className="label">{lang.get('cost')}</div>
							<div className="value">
								{formatNumber(data.prices.changePlateText, true)}
							</div>
						</div>
					</div>
				</div>
			</div>

			<Controls keys={getControls()} clickable={true} />
		</React.Fragment>
	);
};
export default Component;
