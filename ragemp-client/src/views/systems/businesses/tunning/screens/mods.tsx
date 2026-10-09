import { formatNumber, getIncreasedPriceByLevelAndPercentage } from '@/utils/helpers';
import { ComponentState } from '../index';
import React, { useEffect } from 'react';

// Components
import Controls from '../components/controls';

// Language
import { createLanguagePack, getLanguagePack } from '@vmp/i18n';
const LanguageSystemId = 'tunning:modsLabels';
import LanguagePack from './mods.language';
import { key } from '@/definitions/keys';
createLanguagePack(LanguageSystemId, LanguagePack);

const Component = () => {
	const { data, dataRef, option, optionRef, setOption, screen, screenRef, getCurrentMod } =
		ComponentState();

	const controlsLang = getLanguagePack('tunning:controlsLabels', window.language);
	const lang = getLanguagePack(LanguageSystemId, window.language);

	const previewModOption = () => {
		// Change it..
		const modType = data.mods.ids[screen.payload.id];
		const modId = option !== null ? option : -1;
		const mods = { ...(data.vehicle.modifications.mods || {}) };

		// Apply the change
		mods[modType] = modId;

		// Preview it..
		window.rpc.triggerClient(
			'tunning:setVehicleModifications',
			JSON.stringify({
				...data.vehicle.modifications,
				mods
			})
		);
	};

	useEffect(() => {
		if (option === null) return;
		previewModOption();
	}, [option]);

	const isThisCurrentMod = (isRendered = true) => {
		const optionVal = isRendered ? option : optionRef.current;
		const screenVal = isRendered ? screen : screenRef.current;
		return (
			optionVal !== null &&
			getCurrentMod(screenVal.payload.id, isRendered ? false : true) === optionVal
		);
	};

	const getPrice = (isRendered = true) => {
		const prices = isRendered ? data.prices : dataRef.current.prices;
		const s = isRendered ? screen : screenRef.current;
		const o = isRendered ? option : optionRef.current;

		const modKey = s.payload.id;

		// Get the price
		let price = prices.mods[modKey];
		if (!price || o === -1) return null;

		// Formatting the price if it should multiply...
		if (prices.multiplyingFactors[modKey]) {
			price = getIncreasedPriceByLevelAndPercentage(
				prices.mods[modKey],
				prices.multiplyingFactors[modKey],
				o + 1
			);
		}

		return price;
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

		// Variables
		const canAffordIt = data.balance > getPrice(true) ? true : false;
		const currentMod = getCurrentMod(screen.payload.id, false);

		if (option !== null && option !== -1 && !isThisCurrentMod() && canAffordIt) {
			arr.push({
				label: controlsLang.get('purchase'),
				key: 'Space'
			});
		}

		if (option !== null && option == -1 && currentMod !== undefined) {
			arr.push({
				label: controlsLang.get('revertToStock'),
				key: 'Space'
			});
		}

		if (option !== null && screen.payload.id === 'horn') {
			arr.push({
				label: controlsLang.get('honk'),
				key: 'E'
			});
		}

		return arr;
	};

	const onPurchase = async () => {
		// No option has been selected yet.
		if (optionRef.current === null) return false;

		if (optionRef.current !== -1) {
			// Check if they can afford it
			const canAffordIt = dataRef.current.balance > getPrice(false) ? true : false;
			if (!canAffordIt) return false;

			// They already own it.
			if (isThisCurrentMod(false)) return false;
		} else {
			// If is already stock
			const currentMod = getCurrentMod(screenRef.current.payload.id, true);
			if (currentMod === undefined) return false;
		}

		await window.rpc.triggerServer(
			`tunning:purchase`,
			JSON.stringify({
				type: 'mods',
				payload: {
					modKey: screenRef.current.payload.id,
					modType: dataRef.current.mods.ids[screenRef.current.payload.id],
					modId: optionRef.current === -1 ? null : optionRef.current
				}
			})
		);
	};

	const setDefaultOption = () => {
		const modIds = data.mods.ids;
		const currentMod = data.vehicle.modifications.mods[modIds[screen.payload.id]];
		setOption(currentMod !== undefined ? currentMod : -1);
	};

	const onKeysDown = (e: ExpectedAny) => {
		const maxLimit = dataRef.current.mods.compatible[screenRef.current.payload.id] - 1; // mods are counted from zero, not 1.
		let newOption = optionRef.current;

		// Is either only A & D , Left , Right Arrows.
		if (![37, 39, 65, 68].includes(e.keyCode)) return false;

		const arr = [-1];
		for (let i = 0; i < maxLimit + 1; i++) {
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
		document.addEventListener('tunning:onPurchase', onPurchase);
		window.rpc.triggerClient(
			'tunning:setCamera',
			JSON.stringify({ name: `mods:${screen.payload.id}` })
		);

		document.addEventListener('keydown', onKeysDown);

		// Allow honking..
		if (screen.payload.id === 'horn') {
			window.rpc.triggerClient('tunning:allowHorn', JSON.stringify({ value: true }));
		}

		// Set the default option
		setDefaultOption();

		return () => {
			// set up events
			window.rpc.triggerClient('tunning:setCamera', JSON.stringify({ name: 'idle' }));
			window.rpc.triggerClient('tunning:allowHorn', JSON.stringify({ value: false }));

			document.removeEventListener('tunning:onPurchase', onPurchase);
			document.removeEventListener('keydown', onKeysDown);

			// Reset tunning..
			window.rpc.triggerClient(
				'tunning:setVehicleModifications',
				JSON.stringify({
					...dataRef.current.vehicle.modifications
				})
			);

			// Reset this option to not affect other screens
			setOption(null);
		};
	}, []);

	const getModOptionText = () => {
		let str =
			option !== -1
				? `${option + 1} ${lang.get('outOf')} ${data.mods.compatible[screen.payload.id]}`
				: lang.get('stock');

		if (screen.payload.id === 'brakes') {
			switch (option) {
				case -1:
					str = `Standard`;
					break;
				case 0:
					str = `Street`;
					break;
				case 1:
					str = `Sport`;
					break;
				case 2:
					str = `Race`;
					break;
			}
		}

		if (screen.payload.id === 'engine') {
			switch (option) {
				case -1:
					str = `Standard`;
					break;
				case 0:
					str = `EMS-Improvement 1`;
					break;
				case 1:
					str = `EMS-Improvement 2`;
					break;
				case 2:
					str = `EMS-Improvement 3`;
					break;
				case 3:
					str = `EMS-Improvement 4`;
					break;
			}
		}

		if (screen.payload.id === 'transmission') {
			switch (option) {
				case -1:
					str = `Standard`;
					break;
				case 0:
					str = `Street`;
					break;
				case 1:
					str = `Sport`;
					break;
				case 2:
					str = `Race`;
					break;
			}
		}

		if (screen.payload.id === 'suspension') {
			switch (option) {
				case -1:
					str = `Standard`;
					break;
				case 0:
					str = `Lower`;
					break;
				case 1:
					str = `Street`;
					break;
				case 2:
					str = `Sport`;
					break;
				case 3:
					str = `Race`;
					break;
			}
		}

		if (screen.payload.id === 'armor') {
			switch (option) {
				case -1:
					str = `No armor`;
					break;
				case 0:
					str = `20% Armour`;
					break;
				case 1:
					str = `40% Armour`;
					break;
				case 2:
					str = `60% Armour`;
					break;
				case 3:
					str = `80% Armour`;
					break;
				case 4:
					str = `100% Armour`;
					break;
			}
		}

		if (screen.payload.id === 'boost') {
			switch (option) {
				case -1:
					str = `None`;
					break;
				case 0:
					str = `20% Nitrous`;
					break;
				case 1:
					str = `60% Nitrous`;
					break;
				case 2:
					str = `100% Nitrous`;
					break;
				case 3:
					str = `Ram Boost`;
					break;
			}
		}

		return str;
	};

	if (option === null || screen === null) return null;

	return (
		<React.Fragment>
			<div className="layout-dialog">
				<div className="content with-options">
					<div className="title">{lang.get(screen.payload.id)}</div>
					<div className="prices">
						<div className="entry">
							<div className="label">{lang.get('const')}</div>
							<div className="value">
								{option == -1 ? '-' : formatNumber(getPrice(true), true)}
							</div>
						</div>
					</div>
				</div>
				<div className="options">
					<div className="arrow">
						<i className="elm fa-thin fa-arrow-left"></i>
					</div>
					<div className="value">
						{getModOptionText()}
						{option !== -1 && isThisCurrentMod() && (
							<div className="current">
								<i className="icon fa-solid fa-star"></i>
							</div>
						)}
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
