import React, { useState, useEffect } from 'react';
import { ComponentState } from '../../../index';

// Dependencies
import { formatNumber, useStateRef } from '@/utils/helpers';
import { isDifferentColor, tabOptions } from './normal';

// Components
import Controls from '../../../components/controls';
import { getLanguagePack } from '@vmp/i18n';
import { Tabs, Tab } from '@mui/material';

const Component = (props: ExpectedAny) => {
	const [colorsInput, setColorsInput, colorsInputRef] = useStateRef(null);
	const { data, dataRef, optionRef } = ComponentState();
	const [tabIndex, setTabIndex] = useState(0);

	const controlsLang = getLanguagePack('tunning:controlsLabels', window.language);
	const lang = getLanguagePack('tunning:paintLabels', window.language);

	const canBuyColor = (useRenderingData = false) => {
		let colorPurchasable = true;

		// Variables
		const currentBalance = useRenderingData ? data.balance : dataRef.current.balance;
		const colorsPicked = useRenderingData ? colorsInput : colorsInputRef.current;
		const currentColors = useRenderingData
			? data.vehicle.modifications.colors
			: dataRef.current.vehicle.modifications.colors;

		// Low balance
		if (currentBalance < data.prices.colors[props.type]) return false;

		// If he has selected something but is literally same thing.
		if (
			colorsPicked &&
			currentColors.type === 'normal' &&
			!isDifferentColor(currentColors.values, colorsPicked)
		) {
			colorPurchasable = false;
		}

		// Has not selected any color yet.
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
				label: controlsLang.get('purchase'),
				key: 'Space'
			});
		}

		return arr;
	};

	useEffect(() => {
		// set up events
		document.addEventListener('tunning:onPurchase', onPurchase);
		window.rpc.triggerClient('tunning:showCursor', JSON.stringify({ value: true }));

		// Set the default colors value..
		setDefaultColors();

		return () => {
			// Remove events..
			document.removeEventListener('tunning:onPurchase', onPurchase);
			window.rpc.triggerClient('tunning:showCursor', JSON.stringify({ value: false }));

			// When they leave this screen we re-sync the color to what it was originally..
			previewVehicleColors(dataRef.current.vehicle.modifications.colors);
		};
	}, []);

	const selectColor = (value: ExpectedAny, colorId: number) => {
		setColorsInput((currentState: ExpectedAny) => {
			const newState = currentState ? [...currentState] : [];

			// If they change color primary and secondary is the same we sync them

			if (
				(colorId === 0 && !isDifferentColor(newState[0], newState[1])) ||
				newState === undefined
			) {
				newState[1] = value;
			}

			// If it was null and the first color they set up is secondary.
			if (colorId === 1 && newState[0] === undefined) {
				newState[0] = value;
			}

			newState[colorId] = value;

			// Preview the Normal Color..
			previewVehicleColors({
				type: 'normal',
				values: newState
			});

			return newState;
		});
	};

	const getColorsListing = () => {
		const arr = data.colors.filter((c: ExpectedAny) => c.type === props.type);

		// Variables
		const currentColors = dataRef.current.vehicle.modifications.colors;

		if (currentColors.type === 'normal') {
			const match = data.colors.find(
				(c: ExpectedAny) => c.id === currentColors.values[tabIndex]
			);

			// If my current color is not part of this color type.

			if (arr[0].type !== match.type) {
				arr.splice(0, 0, {
					...match,
					differentType: true
				});
			}
		}

		return arr;
	};

	const setDefaultColors = () => {
		// Variables
		const currentColors = dataRef.current.vehicle.modifications.colors;

		// If they current color is RGB we don't pre-selected anything.
		if (currentColors.type === 'rgb') {
			setColorsInput(null);
			return false;
		}

		setColorsInput([...currentColors.values]);
		scrollToColor(currentColors.values[0], true);
	};

	const scrollToColor = (colorId: ExpectedAny, instant = false) => {
		const container = document.getElementById('scrollContainer');
		if (!container) return false;

		const elm = document.getElementById(`color-${colorId}`);
		if (!elm) return false;

		elm.scrollIntoView({
			block: 'center',
			inline: 'center', // center da scroll doar cand s-a ajusn la limita, start e cand pe index 0 e primul scroll
			behavior: instant ? 'auto' : 'smooth'
		});
	};

	const onPurchase = async () => {
		if (!canBuyColor() || colorsInputRef.current === null) return false;

		await window.rpc.triggerServer(
			`tunning:purchase`,
			JSON.stringify({
				type: 'paint',
				payload: {
					type: optionRef.current,
					values: colorsInputRef.current
				}
			})
		);
	};

	const onTabChanged = (_: ExpectedAny, val: ExpectedAny) => {
		setTabIndex(val);
	};

	useEffect(() => {
		// When the tab changes we scroll again
		if (colorsInput !== null) {
			scrollToColor(colorsInput[tabIndex], true);
		}
	}, [tabIndex]);

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
					<div className="title">
						{lang.get('special:title', { type: lang.get(props.type) })}
					</div>
					<div className="settings paint special">
						<Tabs
							className="tabs"
							variant="fullWidth"
							value={tabIndex}
							onChange={onTabChanged}
						>
							{tabOptions.map((tab, ix) => (
								<Tab key={ix} value={ix} label={lang.get(tab)} />
							))}
						</Tabs>
						<div className="entries" id="scrollContainer">
							{getColorsListing().map((entry: ExpectedAny, ix: number) => (
								<div
									id={`color-${entry.id}`}
									className={`entry ${
										colorsInput &&
										colorsInput[tabIndex] === entry.id &&
										'selected'
									}`}
									key={ix}
									onClick={() => selectColor(entry.id, tabIndex)}
								>
									<div
										className="color"
										style={{
											backgroundColor: `${entry.hex}`
										}}
									></div>
									<div className="details">
										<div className="label">{entry.label}</div>
										{entry.differentType && (
											<div className="differentType">
												Current color of different type
											</div>
										)}
									</div>
								</div>
							))}
						</div>
					</div>
					<div className="prices variant-v2">
						<div className="entry">
							<div className="label">{lang.get('cost')}</div>
							<div className="value">
								{formatNumber(data.prices.colors[props.type], true)}{' '}
							</div>
						</div>
						<div className="entry">
							<div className="label">{lang.get('itemRequired')}</div>
							<div className="value">
								{lang.get('voucherFor')} {lang.get(props.type)}
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
