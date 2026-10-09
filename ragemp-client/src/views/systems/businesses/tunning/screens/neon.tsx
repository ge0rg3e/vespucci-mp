import React, { useEffect } from 'react';
import { ComponentState } from '..';

// Dependencies
import { formatNumber, useStateRef } from '@/utils/helpers';

// Components
import { RGBPicker } from './paint/components';
import Controls from '../components/controls';

// Language
import { createLanguagePack, getLanguagePack } from '@vmp/i18n';
const LanguageSystemId = 'tunning:neonLabels';
import LanguagePack from './plate.language';
createLanguagePack(LanguageSystemId, LanguagePack);

const Component = () => {
	const { data, dataRef } = ComponentState();
	const [color, setColor, colorRef] = useStateRef({ ...data.vehicle.modifications }.neon || null);

	const controlsLang = getLanguagePack('tunning:controlsLabels', window.language);
	const lang = getLanguagePack('tunning:neonLabels', window.language);

	const isPurchasableNeons = (isRenderable = false) => {
		// Variables
		const currentNeon = isRenderable
			? data.vehicle.modifications.neon
			: dataRef.current.vehicle.modifications.neon;

		const newNeon = isRenderable ? color : colorRef.current;
		const currentBalance = isRenderable ? data.balance : dataRef.current.balance;
		const neonPrice = isRenderable ? data.prices.neon : dataRef.current.prices.neon;

		if (JSON.stringify(currentNeon) === JSON.stringify(newNeon)) return false;
		if (currentBalance < neonPrice) return false;
		return true;
	};

	const onNeonsRemoved = async () => {
		if (!dataRef.current.vehicle.modifications.neon) return false;

		await window.rpc.triggerServer(
			`tunning:purchase`,
			JSON.stringify({
				type: 'neon',
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

		if (isPurchasableNeons(true)) {
			arr.push({
				label: controlsLang.get('purchase'),
				key: 'Space'
			});
		}

		if (data.vehicle.modifications.neon) {
			arr.push({
				label: controlsLang.get('removeNeons'),
				key: 'R'
			});
		}

		return arr;
	};

	const onPurchase = async () => {
		if (!isPurchasableNeons()) return false;
		await window.rpc.triggerServer(
			`tunning:purchase`,
			JSON.stringify({
				type: 'neon',
				payload: {
					value: colorRef.current
				}
			})
		);
	};

	useEffect(() => {
		// Trigger this
		window.rpc.triggerClient('tunning:setCamera', JSON.stringify({ name: 'neons' }));
		window.rpc.triggerClient('tunning:showCursor', JSON.stringify({ value: true }));

		// set up events
		document.addEventListener('tunning:onPurchase', onPurchase);
		document.addEventListener('tunning:onRemove', onNeonsRemoved);

		return () => {
			window.rpc.triggerClient('tunning:setCamera', JSON.stringify({ name: 'idle' }));
			window.rpc.triggerClient('tunning:showCursor', JSON.stringify({ value: false }));

			// set up events
			document.removeEventListener('tunning:onPurchase', onPurchase);
			document.removeEventListener('tunning:onRemove', onNeonsRemoved);

			// Reset neons..
			previewVehicleNeon(dataRef.current.vehicle.modifications.neon);
		};
	}, []);

	const onColorPickerChanged = (value: ExpectedAny) => {
		setColor(value);

		// Preview the neons.
		previewVehicleNeon(value);
	};

	const previewVehicleNeon = (colors: ExpectedAny) => {
		window.rpc.triggerClient(
			'tunning:setVehicleModifications',
			JSON.stringify({
				...dataRef.current.vehicle.modifications,
				neon: colors
			})
		);
	};

	return (
		<React.Fragment>
			<div className="layout-dialog rt">
				<div className="content">
					<div className="title">Neon</div>
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
							<div className="value">{formatNumber(data.prices.neon, true)}</div>
						</div>
					</div>
				</div>
			</div>
			<Controls keys={getControls()} />
		</React.Fragment>
	);
};
export default Component;
