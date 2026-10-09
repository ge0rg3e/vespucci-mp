import React, { useEffect } from 'react';
import { ComponentState } from '..';

// Dependencies
import { formatNumber } from '@/utils/helpers';

// Components
import { xenonColorsOptions } from './xenonLights.map';
import Controls from '../components/controls';

// Language
import { createLanguagePack, getLanguagePack } from '@vmp/i18n';
const LanguageSystemId = 'tunning:xenonLightsLabels';
import LanguagePack from './xenonLights.language';
import { key } from '@/definitions/keys';
createLanguagePack(LanguageSystemId, LanguagePack);

const Component = () => {
	const { data, dataRef, option, optionRef, setOption } = ComponentState();

	const controlsLang = getLanguagePack('tunning:controlsLabels', window.language);
	const lang = getLanguagePack(LanguageSystemId, window.language);

	const isPurchasable = (isRenderable = false) => {
		// Variables
		const currentValue = isRenderable
			? data.vehicle.modifications.xenonLights
			: dataRef.current.vehicle.modifications.xenonLights;

		const newValue = isRenderable ? option : optionRef.current;
		const currentBalance = isRenderable ? data.balance : dataRef.current.balance;
		const price = isRenderable ? data.prices.xenonLights : dataRef.current.prices.xenonLights;

		if (JSON.stringify(currentValue) === JSON.stringify(newValue)) return false;
		if (currentBalance < price) return false;
		return true;
	};

	const isCurrentNeon = () => {
		const currentValue =
			data.vehicle.modifications.xenonLights !== undefined
				? data.vehicle.modifications.xenonLights
				: -1;
		return option === currentValue ? true : false;
	};

	const getControls = () => {
		const arr = [];

		arr.push({
			label: controlsLang.get('brosweOptions'),
			key: 'A & D'
		});

		arr.push({
			label: controlsLang.get('backToMainMenu'),
			key: <i className="icon large fa-solid fa-delete-left"></i>
		});

		if (option !== -1 && isPurchasable(true)) {
			arr.push({
				label: controlsLang.get('purchase'),
				key: 'Space'
			});
		}

		if (option === -1 && data.vehicle.modifications.xenonLights !== undefined) {
			arr.push({
				label: controlsLang.get('revertToStock'),
				key: 'Space'
			});
		}

		return arr;
	};

	const previewXenonLights = (id: ExpectedAny) => {
		window.rpc.triggerClient(
			'tunning:setVehicleModifications',
			JSON.stringify({ ...dataRef.current.vehicle.modifications, xenonLights: id })
		);
	};

	useEffect(() => {
		previewXenonLights(option);
	}, [option]);

	const onPurchase = async () => {
		if (!isPurchasable()) return false;
		if (optionRef.current === null) return false;

		await window.rpc.triggerServer(
			`tunning:purchase`,
			JSON.stringify({
				type: 'xenonLights',
				payload: {
					value: optionRef.current === -1 ? null : optionRef.current
				}
			})
		);
	};

	const onKeysDown = (e: ExpectedAny) => {
		let newOption = optionRef.current;

		// Is not of interest..
		if (![37, 39, 65, 68].includes(e.keyCode)) return false;

		const arr = [-1];
		for (let i = 0; i < xenonColorsOptions.length - 1; i++) {
			arr.push(i);
		}

		if (key(e, 'ArrowLeft') || key(e, 'A')) {
			if (newOption !== -1) {
				newOption--;
			} else {
				newOption = arr[arr.length - 1];
			}
		}

		if (key(e, 'ArrowRight') || key(e, 'D')) {
			if (newOption !== arr[arr.length - 1]) {
				newOption++;
			} else {
				newOption = arr[0];
			}
		}

		setOption(newOption);
		e.preventDefault();
	};

	useEffect(() => {
		// set up events
		window.rpc.triggerClient('tunning:showCursor', JSON.stringify({ value: true }));
		document.addEventListener('tunning:onPurchase', onPurchase);
		document.addEventListener('keydown', onKeysDown);

		// Set the default Xenon light id..
		const { xenonLights }: ExpectedAny = { ...dataRef.current.vehicle.modifications };
		setOption(xenonLights !== undefined ? xenonLights : -1);

		return () => {
			// Remove these events
			window.rpc.triggerClient('tunning:showCursor', JSON.stringify({ value: false }));
			document.removeEventListener('tunning:onPurchase', onPurchase);
			document.removeEventListener('keydown', onKeysDown);

			// Reset this option to not affect other screens
			const { xenonLights }: ExpectedAny = { ...dataRef.current.vehicle.modifications };
			setOption(xenonLights !== undefined ? xenonLights : -1);
			previewXenonLights(xenonLights !== undefined ? xenonLights : -1);
		};
	}, []);

	// Quick bugfix.
	if (option === null) return null;

	return (
		<React.Fragment>
			<div className="layout-dialog">
				<div className="content">
					<div className="title">{lang.get('title')}</div>
					<div className="prices">
						<div className="entry">
							<div className="label">{lang.get('cost')}</div>
							<div className="value">
								{option === -1 ? '-' : formatNumber(data.prices.xenonLights, true)}
							</div>
						</div>
					</div>
				</div>
				<div className="options">
					<div className="arrow">
						<i className="elm fa-thin fa-arrow-left"></i>
					</div>
					<div className="value">
						{option === -1 ? (
							lang.get('stock')
						) : (
							<React.Fragment>
								{xenonColorsOptions.find((o) => o.value === option)?.label || '-'}
								{isCurrentNeon() && (
									<div className="current">
										<i className="icon fa-solid fa-star"></i>
									</div>
								)}
							</React.Fragment>
						)}{' '}
					</div>
					<div className="arrow">
						<i className="elm fa-thin fa-arrow-right"></i>
					</div>
				</div>
			</div>
			<Controls keys={getControls()} />
		</React.Fragment>
	);
};
export default Component;
