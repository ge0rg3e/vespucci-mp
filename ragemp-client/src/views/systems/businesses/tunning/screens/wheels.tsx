import { formatNumber, useStateRef } from '@/utils/helpers';
import React, { useEffect } from 'react';
import { ComponentState } from '..';

// Components
import Controls from '../components/controls';

// Language
import { createLanguagePack, getLanguagePack } from '@vmp/i18n';
import LanguagePack from './wheels.language';
import { key } from '@/definitions/keys';
const LanguageSystemId = 'tunning:wheelsLabels';
createLanguagePack(LanguageSystemId, LanguagePack);

const Component = () => {
	const [secondaryOption, setSecondaryOption, secondaryOptionRef] = useStateRef(null);
	const [numberOfWheels, setNumberOfWheels, numberOfWheelsRef] = useStateRef(null);
	const { data, dataRef, option, optionRef } = ComponentState();

	const controlsLang = getLanguagePack('tunning:controlsLabels', window.language);
	const lang = getLanguagePack(LanguageSystemId, window.language);

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

		// Variables needed
		const modifications = { ...data.vehicle.modifications };
		const currentWheelType =
			modifications.wheelType !== undefined ? modifications.wheelType : -1;
		const currentModId = modifications.mods[23] !== undefined ? modifications.mods[23] : -1;

		if (option !== null) {
			if (
				!(currentModId === secondaryOption && currentWheelType === option) &&
				secondaryOption !== -1
			) {
				arr.push({
					label: controlsLang.get('purchase'),
					key: 'Space'
				});
			}
			if (secondaryOption === -1 && currentModId !== -1) {
				arr.push({
					label: controlsLang.get('revertToStock'),
					key: 'Space'
				});
			}
		}

		return arr;
	};

	const previewOption = async (wheelType: number, modId: number) => {
		// @Bugfix: It was setting the data.
		const modifications = JSON.parse(JSON.stringify(data.vehicle.modifications));

		// Apply the change
		modifications.mods[23] = modId;
		modifications.wheelType = wheelType;
		// Preview it..
		window.rpc.triggerClient(
			'tunning:setVehicleModifications',
			JSON.stringify({ ...modifications })
		);
	};

	useEffect(() => {
		if (option !== null && secondaryOption !== null) {
			previewOption(option, secondaryOption);
		}
	}, [option, secondaryOption]);

	const setDefaultWheel = async () => {
		const res = await window.rpc.callClient(
			`tunning:getNumberOfWheelsCompatible`,
			JSON.stringify({
				wheelType: option
			})
		);

		setNumberOfWheels(window.mp.fake ? 30 : res);

		// Set the current secondary option..
		const src = { ...data.vehicle.modifications };
		const modId = src.mods[23];
		const currentWheelType = src.wheelType !== undefined ? src.wheelType : -1;
		const currentMod = modId === undefined || option !== currentWheelType ? -1 : modId;
		setSecondaryOption(currentMod);
	};

	useEffect(() => {
		setSecondaryOption(null); // Temporary..
		if (option !== null) {
			setDefaultWheel();
		} else {
			// Revert the mods back when they switch back..
			window.rpc.triggerClient(
				'tunning:setVehicleModifications',
				JSON.stringify({ ...dataRef.current.vehicle.modifications })
			);
		}
	}, [option]);

	const getPrice = (isRenderable = true) => {
		const prices = isRenderable ? data.prices : dataRef.current.prices;
		const o = isRenderable ? option : optionRef.current;

		const id = getOptionKey(o);
		if (!id) return null;

		return prices.wheels[id] || 0;
	};

	const getOptionKey = (o: number) => {
		// Feel free to make it pretty
		const mapIds: ExpectedAny = {
			'-1': 'stock',
			'0': 'sport',
			'1': 'muscle',
			'2': 'lowrider',
			'3': 'suv',
			'4': 'offroad',
			'5': 'tuner',
			'6': 'bikeWheels',
			'7': 'highEnd',
			'8': 'bennyOriginal',
			'9': 'bennyBespoke',
			'10': 'openWheel',
			'11': 'street'
		};

		const id = mapIds[`${o}`];
		if (!id) return null;

		return id;
	};

	const onPurchase = async () => {
		// No option has been selected yet.
		if (optionRef.current === null || secondaryOptionRef.current === null) return false;

		const modifications = { ...dataRef.current.vehicle.modifications };
		const currentWheelType =
			modifications.wheelType !== undefined ? modifications.wheelType : -1;
		const currentModId = modifications.mods[23] !== undefined ? modifications.mods[23] : -1;

		if (secondaryOptionRef.current !== -1) {
			// Check if they can afford it
			const canAffordIt = dataRef.current.balance > getPrice(false) ? true : false;
			if (!canAffordIt) return false;

			// They already own it.

			if (
				currentModId === secondaryOptionRef.current &&
				currentWheelType === optionRef.current
			)
				return false;
		} else {
			// If is already stock
			if (currentModId === -1) return false;
		}

		await window.rpc.triggerServer(
			`tunning:purchase`,
			JSON.stringify({
				type: 'wheels',
				payload: {
					key: secondaryOptionRef.current === -1 ? null : getOptionKey(optionRef.current),
					wheelType: secondaryOptionRef.current === -1 ? null : optionRef.current,
					modId: secondaryOptionRef.current === -1 ? null : secondaryOptionRef.current
				}
			})
		);
	};

	const onKeysDown = (e: ExpectedAny) => {
		let newSecondaryOption = secondaryOptionRef.current;
		const maxLimit = numberOfWheelsRef.current;
		if (!maxLimit) return false; // Something goes wrong and we don't know the number.
		if (optionRef.current === null) return false; // To avoid mistaking arrows when selecting wheel type from Menu.

		// Is either only A & D , Left , Right Arrows.
		if (![37, 39, 65, 68].includes(e.keyCode)) return false;

		// Vars needed
		const arr = [-1];

		for (let i = 0; i < maxLimit + 1; i++) {
			arr.push(i);
		}

		if (key(e, 'ArrowLeft') || key(e, 'A')) {
			if (newSecondaryOption !== -1) {
				newSecondaryOption--;
			} else {
				newSecondaryOption = arr[arr.length - 1];
			}
		}

		if (key(e, 'ArrowRight') || key(e, 'D')) {
			if (newSecondaryOption !== arr[arr.length - 1]) {
				newSecondaryOption++;
			} else {
				newSecondaryOption = arr[0];
			}
		}

		setSecondaryOption(newSecondaryOption);
		e.preventDefault();
	};

	useEffect(() => {
		// set up the events
		window.rpc.triggerClient('tunning:setCamera', JSON.stringify({ name: `wheels` }));
		document.addEventListener('tunning:onPurchase', onPurchase);
		document.addEventListener('keydown', onKeysDown);

		return () => {
			window.rpc.triggerClient('tunning:setCamera', JSON.stringify({ name: `idle` }));
			document.removeEventListener('tunning:onPurchase', onPurchase);
			document.removeEventListener('keydown', onKeysDown);

			// Revert the mods back..
			window.rpc.triggerClient(
				'tunning:setVehicleModifications',
				JSON.stringify({ ...dataRef.current.vehicle.modifications })
			);
		};
	}, []);

	const isCurrentWheels = () => {
		const modifications = { ...data.vehicle.modifications };

		const currentWheelType =
			modifications.wheelType !== undefined ? modifications.wheelType : -1;
		const currentModId = modifications.mods[23] !== undefined ? modifications.mods[23] : -1;

		return currentModId === secondaryOption && currentWheelType === option ? true : false;
	};

	const interfaceIsReady = numberOfWheels !== null && option !== null;

	return (
		<React.Fragment>
			{interfaceIsReady && (
				<React.Fragment>
					<div className="layout-dialog">
						<div className="content with-options">
							<div className="title">Wheels</div>

							<div className="prices">
								<div className="entry">
									<div className="label">{lang.get('cost')}</div>
									<div className="value">
										{secondaryOption === -1
											? '-'
											: formatNumber(getPrice(true), true)}
									</div>
								</div>
							</div>
						</div>
						<div className="options">
							<div className="arrow">
								<i className="elm fa-thin fa-arrow-left"></i>
							</div>
							<div className="value">
								{secondaryOption === -1 ? (
									'Stock'
								) : (
									<React.Fragment>
										{secondaryOption + 1} {lang.get('outOf')}{' '}
										{numberOfWheels + 1}{' '}
										{isCurrentWheels() && (
											<div className="current">
												<i className="icon fa-solid fa-star"></i>
											</div>
										)}
									</React.Fragment>
								)}
							</div>
							<div className="arrow">
								<i className="elm fa-thin fa-arrow-right"></i>
							</div>
						</div>
					</div>
				</React.Fragment>
			)}
			<Controls keys={getControls()} />
		</React.Fragment>
	);
};
export default Component;
