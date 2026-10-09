import { formatNumber, useStateRef } from '@/utils/helpers';
import React, { useEffect, useState } from 'react';
import { ComponentState } from '../../..';

// Components
import Controls from '../../../components/controls';
import { getLanguagePack } from '@vmp/i18n';
import { RGBPicker } from '../components';
import { Tabs, Tab } from '@mui/material';

// Variables
export const tabOptions = ['Primary', 'Secondary'];

export const isDifferentColor = (val1: ExpectedAny, val2: ExpectedAny) =>
	JSON.stringify(val1) !== JSON.stringify(val2);

const Component = () => {
	const { data, dataRef } = ComponentState();
	const [colorsInput, setColorsInput, colorsInputRef] = useStateRef(
		dataRef.current.vehicle.modifications.colors.type === 'rgb'
			? [...dataRef.current.vehicle.modifications.colors.values]
			: null
	);
	const [tabIndex, setTabIndex] = useState(0);

	const controlsLang = getLanguagePack('tunning:controlsLabels', window.language);
	const lang = getLanguagePack('tunning:paintLabels', window.language);

	const canBuyColor = (useRenderingData = false) => {
		let colorPurchasable = true;

		// Variables
		const currentColors = useRenderingData
			? data.vehicle.modifications.colors
			: dataRef.current.vehicle.modifications.colors;
		const colorsPicked = useRenderingData ? colorsInput : colorsInputRef.current;
		const currentBalance = useRenderingData ? data.balance : dataRef.current.balance;

		// Low balance
		if (currentBalance < data.prices.colors.normal) return false;

		// If the color we're looking at is rgb and is NOT different from our rgb color..
		if (
			colorsPicked !== null &&
			currentColors.type === 'rgb' &&
			!isDifferentColor(currentColors.values, colorsPicked)
		) {
			colorPurchasable = false;
		}

		if (colorsPicked === null) return false;

		return colorPurchasable;
	};

	const getControls = () => {
		const arr = [];

		arr.push({
			label: controlsLang.get('back'),
			key: <i className="icon large fa-solid fa-delete-left"></i>
		});

		if (canBuyColor(true)) {
			arr.push({
				label: lang.get('purchase'),
				key: 'Space'
			});
		}

		return arr;
	};

	const onPurchase = async () => {
		if (!canBuyColor() || colorsInputRef.current === null) return false;
		await window.rpc.triggerServer(
			`tunning:purchase`,
			JSON.stringify({
				type: 'paint',
				payload: {
					type: 'normal',
					values: colorsInputRef.current
				}
			})
		);
	};

	useEffect(() => {
		window.rpc.triggerClient('tunning:showCursor', JSON.stringify({ value: true }));
		document.addEventListener('tunning:onPurchase', onPurchase);

		return () => {
			window.rpc.triggerClient('tunning:showCursor', JSON.stringify({ value: false }));
			document.removeEventListener('tunning:onPurchase', onPurchase);

			// When they leave this screen we re-sync the color to what it was originally..
			previewVehicleColors(dataRef.current.vehicle.modifications.colors);
		};
	}, []);

	const onColorPickerChanged = (value: ExpectedAny, colorId: number) => {
		setColorsInput((currentState: ExpectedAny) => {
			const valueFormatted = currentState ? [...currentState] : [];

			// If they change color primary and secondary is the same we sync them
			if (
				(colorId === 0 && !isDifferentColor(valueFormatted[0], valueFormatted[1])) ||
				valueFormatted[1] === undefined // or if it was null now not.
			) {
				valueFormatted[1] = value;
			}

			// If it was null and the first color they set up is secondary.
			if (colorId === 1 && valueFormatted[0] === undefined) {
				valueFormatted[0] = value;
			}

			valueFormatted[colorId] = value;

			// Preview the RGB Color..
			previewVehicleColors({
				type: 'rgb',
				values: valueFormatted
			});

			return valueFormatted;
		});
	};

	const previewVehicleColors = (colors: ExpectedAny) => {
		window.rpc.triggerClient(
			'tunning:setVehicleModifications',
			JSON.stringify({
				...dataRef.current.vehicle.modifications,
				colors
			})
		);
	};

	return (
		<React.Fragment>
			<div className="layout-dialog rt">
				<div className="content">
					<div className="title">{lang.get('normal:title')}</div>
					<div className="settings paint normal">
						<Tabs
							className="tabs"
							variant="fullWidth"
							value={tabIndex}
							onChange={(_, val) => setTabIndex(val)}
						>
							{tabOptions.map((tab, ix) => (
								<Tab key={ix} value={ix} label={lang.get(tab)} />
							))}
						</Tabs>
						<div className="rgb-picker">
							<RGBPicker
								value={colorsInput ? colorsInput[tabIndex] : [255, 255, 255]}
								onChange={(color: ExpectedAny) =>
									onColorPickerChanged(color, tabIndex)
								}
							/>
						</div>
					</div>
					<div className="prices">
						<div className="entry">
							<div className="label">{lang.get('cost')}</div>
							<div className="value">
								{formatNumber(data.prices.colors.normal, true)}{' '}
							</div>
						</div>
					</div>
				</div>
			</div>

			<Controls keys={getControls()} />
		</React.Fragment>
	);
};

export default Component;
