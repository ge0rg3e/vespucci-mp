import React, { useEffect, useRef, useState } from 'react';

// Context
import { ComponentState } from '..';
import { AudioService } from '@/services/audio';

// Components
import KeyboardMenu from '@/components/keyboardMenu';

// Screens that have sub-categories..
const catWithSubCategories = ['paint', 'wheels'];

// Language
import { createLanguagePack, getLanguagePack } from '@vmp/i18n';
const LanguageSystemId = 'tunning:menuLabels';
import LanguagePack from './menu.language';
createLanguagePack(LanguageSystemId, LanguagePack);

const Component = () => {
	const { data, setScreen, screen, option, setOption } = ComponentState();
	const { playAudio } = AudioService();

	const [selectedMenuIndex, setSelectedMenuIndex] = useState(0);

	const controlsLang = getLanguagePack('tunning:controlsLabels', window.language);
	const modsLang = getLanguagePack('tunning:modsLabels', window.language);
	const menuLang = getLanguagePack('tunning:menuLabels', window.language);

	// Variables
	const mainMenuOptionLast = useRef(0);

	const getMenuListing = () => {
		const arr: ExpectedAny = [];

		// If they entered a mod menu..
		if (screen && screen.type === 'paint') {
			arr.push({
				id: 'normal',
				icon: 'paint_option.png',
				label: 'Normal'
			});

			arr.push({
				id: 'special:metallic',
				icon: 'paint_option.png',
				label: 'Metallic'
			});

			arr.push({
				id: 'special:matte',
				icon: 'paint_option.png',
				label: 'Matte'
			});

			arr.push({
				id: 'special:premium',
				icon: 'paint_option.png',
				label: 'Premium'
			});
		} else if (screen && screen.type === 'wheels' && data.vehicle.info.class === 'motorcycle') {
			arr.push({
				id: 6,
				icon: 'wheels.png',
				label: 'Bike Wheels'
			});
		} else if (screen && screen.type === 'wheels' && data.vehicle.info.class !== 'motorcycle') {
			arr.push({
				id: -1,
				icon: 'wheels.png',
				label: 'Stock'
			});

			arr.push({
				id: 0,
				icon: 'wheels.png',
				label: 'Sport'
			});

			arr.push({
				id: 1,
				icon: 'wheels.png',
				label: 'Muscle'
			});

			arr.push({
				id: 2,
				icon: 'wheels.png',
				label: 'Lowrider'
			});

			arr.push({
				id: 3,
				icon: 'wheels.png',
				label: 'SUV'
			});

			arr.push({
				id: 4,
				icon: 'wheels.png',
				label: 'Offroad'
			});

			arr.push({
				id: 5,
				icon: 'wheels.png',
				label: 'Tuner'
			});

			arr.push({
				id: 7,
				icon: 'wheels.png',
				label: 'High End'
			});

			arr.push({
				id: 8,
				icon: 'wheels.png',
				label: `Benny's Original`
			});

			arr.push({
				id: 9,
				icon: 'wheels.png',
				label: `Benny's Bespoke`
			});

			arr.push({
				id: 10,
				icon: 'wheels.png',
				label: `Open Wheel`
			});

			arr.push({
				id: 11,
				icon: 'wheels.png',
				label: `Street`
			});
		} else {
			// Repair the vehicle..
			arr.push({
				id: 'repair',
				icon: 'repair.png',
				label: menuLang.get('repairVehicle')
			});

			// Change the plate..
			arr.push({
				id: 'plate',
				icon: 'plate.png',
				label: menuLang.get('customPlate')
			});

			// Paint  the vehicle..
			arr.push({
				id: 'paint',
				icon: 'paint.png',
				label: menuLang.get('paintVehicle')
			});

			if (data.businessType > 1) {
				// Bikes can't buy neons..
				if (data.vehicle.info.type === 'car') {
					// Buy neons..
					arr.push({
						id: 'neon',
						icon: 'neon.png',
						label: 'Neon'
					});
				}

				arr.push({
					id: 'wheels',
					icon: 'wheels.png',
					label: 'Wheels'
				});

				arr.push({
					id: 'tireSmoke',
					icon: 'tireSmoke.png',
					label: `Tire smoke`
				});

				arr.push({
					id: 'xenonLights',
					icon: 'xenonLights.png',
					label: 'Xenon lights'
				});

				// Show a menu option for each mod available..
				Object.keys(data.mods.ids).forEach((modKey) => {
					// Is this vehicle is not tunnable
					if (data.mods.compatible[modKey] < 1) return;
					if (modKey === 'frontWheels') return false; // We have separate window for this one.
					if (modKey === 'plate') return; // Bugged out trebuie reparat.
					arr.push({
						id: `mod:${modKey}`,
						icon: `/mods/${modKey}.png`,
						label: modsLang.get(modKey)
					});
				});
			} else {
				arr.push({
					id: 'unableToTune',
					icon: 'info.png',
					label: menuLang.get('unableToTune')
				});
			}
		}

		// If they're not on the main menu let's show them a go back button as first option..
		if (screen !== null && [...catWithSubCategories].includes(screen.type)) {
			arr.splice(0, 0, {
				id: 'goBack',
				icon: 'back.png',
				label: controlsLang.get('goBack')
			});
		}

		return arr;
	};

	const selectMenuOption = (entry: ExpectedAny) => {
		// If they selected go back on a screen.
		if (entry.id === 'goBack' && screen !== null) {
			setScreen(null);
			playAudio(`${__ASSETS__}/audios/systems/businesses/tunning/onBack.WAV`, { volume: 0.03 });
			return false;
		}

		// If they are on the main menu and select an option..
		if (screen === null) {
			const isModEntry = entry.id.includes('mod:') ? true : false;
			const modId = isModEntry ? entry.id.split('mod:')[1] : null;

			// Set the right game screen: Either a repair or a mods listing?
			const newScreeen = {
				type: isModEntry ? 'mods' : entry.id,
				payload: isModEntry ? { id: modId } : {}
			};

			setScreen(newScreeen);

			// Play a nice sound effect..
			playAudio(`${__ASSETS__}/audios/systems/businesses/tunning/onBack.WAV`, { volume: 0.03 });

			return false;
		}

		// If it's a category that requires a sub-category to be picked..
		if (screen && catWithSubCategories.includes(screen.type)) {
			if (option && option === entry.id) return false; // same thing.
			// Select the entry..
			setOption(entry.id);

			// Play a nice sound effect..
			playAudio(`${__ASSETS__}/audios/systems/businesses/tunning/onBack.WAV`, { volume: 0.03 });
			return false;
		}
	};

	const onKeyPressed = (key: string, entryFocused: ExpectedAny) => {
		if (key === 'Enter' && entryFocused) {
			if (entryFocused.id === 'neon' && !data.vehicle.info.isNeonCompatible) {
				return window.toast({
					message: menuLang.get('neonDisabled'),
					type: 'error'
				});
			}

			selectMenuOption(entryFocused);
		} else if (key === 'Backspace' && screen !== null) {
			if (screen && screen.type === 'plate') return false; // That screen cannot go back by Keyboard.
			// For plate we need special way to go back.
			if (screen && catWithSubCategories.includes(screen.type) && option !== null) {
				setOption(null);
			} else {
				setScreen(null);
				setOption(null);
			}

			// Play a nice sound effect..
			playAudio(`${__ASSETS__}/audios/systems/businesses/tunning/onBack.WAV`, { volume: 0.03 });
		}
	};

	const onNavigationIndexChanged = () => {
		// When they use the arrows to navigate arund..
		playAudio(`${__ASSETS__}/audios/systems/businesses/tunning/navigation.mp3`, { volume: 0.03 });

		// If they're on the home screen let's remember their last index to rollback to.
		if (screen === null) {
			mainMenuOptionLast.current = selectedMenuIndex;
		}
	};

	const isNavigatingDisabled = () => {
		if (screen && catWithSubCategories.includes(screen.type) && option === null) return false;
		if (screen) return true; // regular screens once locked in.
		return false;
	};

	const setNavigationIndex = (navIndex: number) => {
		document.dispatchEvent(
			new CustomEvent(`horizontalMenu:setIndex`, {
				detail: {
					index: navIndex,
					instant: true
				}
			})
		);
	};

	useEffect(() => {
		// When they go back to main menu we need to set the entry focused to what it was before.
		if (screen === null && mainMenuOptionLast.current !== 0) {
			setNavigationIndex(mainMenuOptionLast.current);
		}

		// They just entered a menu with sub-categories
		if (screen && catWithSubCategories.includes(screen.type)) {
			setNavigationIndex(0);
		}
	}, [screen]);

	useEffect(() => {
		onNavigationIndexChanged();
	}, [selectedMenuIndex]);

	const isCurrentWheelType = (id: number) => {
		if (data.vehicle.info.class === 'motorcycle' && id === 6) return true;
		const currentValue = data.vehicle.modifications.wheelType;
		return currentValue === id || (currentValue === undefined && id === -1) ? true : false;
	};

	return (
		<React.Fragment>
			<KeyboardMenu
				selectedIndex={selectedMenuIndex}
				setSelectedIndex={setSelectedMenuIndex}
				data={getMenuListing()}
				disableNavigation={isNavigatingDisabled()}
				onLimitReachedReset={true}
				onCallbacks={{
					onKeyPressed: onKeyPressed
				}}
				className={`component-menu`}
				entryClassName={(entry, isSelected) => {
					const classNames = ['entry'];

					if (isSelected) {
						classNames.push('hovered');
					}

					if (isSelected && screen && catWithSubCategories.includes(screen.type)) {
						if (option === entry.id) {
							classNames.push('selected');
						}
					}

					if (isSelected && screen && screen.type === entry.id) {
						classNames.push('selected');
					}

					if (screen && screen.type === 'mods' && entry.id.includes('mod:') && screen.payload.id === entry.id.split(':')[1]) {
						classNames.push('selected');
					}

					return classNames.join(' ');
				}}
				renderEntry={(entry: ExpectedAny, ix: number) => (
					<React.Fragment key={ix}>
						<div className="content" style={{ flexDirection: 'column' }}>
							{screen && screen.type === 'wheels' && isCurrentWheelType(entry.id) && (
								<React.Fragment>
									<div className="badge">
										<i className="elm fa-solid fa-star"></i>
									</div>
								</React.Fragment>
							)}

							<img
								className="image"
								src={`/assets/images/systems/businesses/tunning/options/${entry.icon}`}
								alt=""
								onLoad={(ev: UndefinedAny) => (ev.target.className += ` loaded`)}
							/>

							<div className="label">{entry.label}</div>
							<div className="corners">
								<div className="shared-left left-top"></div>
								<div className="shared-right right-top"></div>
								<div className="shared-left bottom-left"></div>
								<div className="shared-right bottom-right"></div>
							</div>
						</div>
					</React.Fragment>
				)}
			/>
		</React.Fragment>
	);
};

export default Component;
