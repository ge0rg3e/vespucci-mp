import React, { useEffect } from 'react';
import { ComponentState } from '..';

// Dependencies
import { formatNumber, useStateRef } from '@/utils/helpers';

// Components
import { RGBPicker } from './paint/components';
import Controls from '../components/controls';

// Language
import { createLanguagePack, getLanguagePack } from '@vmp/i18n';
const LanguageSystemId = 'tunning:tireSmokeLabels';
import LanguagePack from './tireSmoke.language';
createLanguagePack(LanguageSystemId, LanguagePack);

const Component = () => {
	const { data, dataRef } = ComponentState();
	const [color, setColor, colorRef] = useStateRef(
		{ ...data.vehicle.modifications }.tireSmoke || null
	);

	const controlsLang = getLanguagePack('tunning:controlsLabels', window.language);
	const lang = getLanguagePack(LanguageSystemId, window.language);

	const isPurchasableTireSmoke = (isRenderable = false) => {
		// Variables
		const currentTireSmoke = isRenderable
			? data.vehicle.modifications.tireSmoke
			: dataRef.current.vehicle.modifications.tireSmoke;

		const newTireSmoke = isRenderable ? color : colorRef.current;
		const currentBalance = isRenderable ? data.balance : dataRef.current.balance;
		const smokePrice = isRenderable ? data.prices.tireSmoke : dataRef.current.prices.tireSmoke;

		if (JSON.stringify(currentTireSmoke) === JSON.stringify(newTireSmoke)) return false;
		if (currentBalance < smokePrice) return false;
		return true;
	};

	const onTireRemoved = async () => {
		if (!dataRef.current.vehicle.modifications.tireSmoke) return false;

		await window.rpc.triggerServer(
			`tunning:purchase`,
			JSON.stringify({
				type: 'tireSmoke',
				payload: {
					value: null // To remove.
				}
			})
		);
	};

	const getControls = () => {
		const arr = [];

		arr.push({
			label: controlsLang.get('goBack'),
			key: <i className="icon large fa-solid fa-delete-left"></i>
		});

		if (isPurchasableTireSmoke(true)) {
			arr.push({
				label: controlsLang.get('purchase'),
				key: 'Space'
			});
		}

		if (data.vehicle.modifications.tireSmoke) {
			arr.push({
				label: controlsLang.get('revertToStock'),
				key: 'R'
			});
		}

		return arr;
	};

	const onPurchase = async () => {
		if (!isPurchasableTireSmoke()) return false;
		await window.rpc.triggerServer(
			`tunning:purchase`,
			JSON.stringify({
				type: 'tireSmoke',
				payload: {
					value: colorRef.current
				}
			})
		);
	};

	useEffect(() => {
		// set up events
		window.rpc.triggerClient('tunning:showCursor', JSON.stringify({ value: true }));
		document.addEventListener('tunning:onRemove', onTireRemoved);
		document.addEventListener('tunning:onPurchase', onPurchase);

		return () => {
			// set up events
			window.rpc.triggerClient('tunning:showCursor', JSON.stringify({ value: false }));
			document.removeEventListener('tunning:onRemove', onTireRemoved);
			document.removeEventListener('tunning:onPurchase', onPurchase);

			// Reset smokes..
			previewVehicleSmoke(dataRef.current.vehicle.modifications.tireSmoke);
		};
	}, []);

	const onColorPickerChanged = (value: ExpectedAny) => {
		setColor(value);

		// Preview the smokes.
		previewVehicleSmoke(value);
	};

	const previewVehicleSmoke = (colors: ExpectedAny) => {
		window.rpc.triggerClient(
			'tunning:setVehicleModifications',
			JSON.stringify({
				...dataRef.current.vehicle.modifications,
				tireSmoke: colors ? colors : null
			})
		);
	};

	return (
		<React.Fragment>
			<div className="layout-dialog rt">
				<div className="content">
					<div className="title">{lang.get('title')}</div>
					<div className="settings border spacing">
						<div className="rgb-picker">
							<RGBPicker
								value={color || [255, 255, 255]}
								onChange={(color: ExpectedAny) => onColorPickerChanged(color)}
							/>
						</div>
					</div>
					<div className="prices">
						<div className="entry">
							<div className="label">{lang.get('cost')}</div>
							<div className="value">{formatNumber(data.prices.tireSmoke, true)}</div>
						</div>
					</div>
				</div>
			</div>
			<Controls keys={getControls()} />
		</React.Fragment>
	);
};
export default Component;
