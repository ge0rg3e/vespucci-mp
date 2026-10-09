import React, { useEffect, useState } from 'react';
import moment from 'moment';
import { ComponentState } from '..';

// Dependencies
import { formatNumber } from '@/utils/helpers';

// Types
import { DroppedItem } from '../sections/pickup/components/entry/types';
import { SeparatedItem } from '../sections/externalStorage/components/entry/types';
import { InventoryItem } from '../sections/items/components/types';
import { eventPosition } from './tooltip.type';
import { getLanguagePack } from '@vmp/i18n';

// @TODO:
// This is not as performant as it should be. When the data changes all tooltips should be formatted once and saved in the browser's state.
// When we hover we should simply display that state saved data.
// Rather than using getData() funcs every miliseconds, is a waste of memory.

const Tooltip = () => {
	const {
		data,
		refs,
		lang,
		activeDragId,
		getItemMeta,
		getClothingMeta,
		getMeta,
		getItemProperties,
		getWeaponFromSlot
	} = ComponentState();
	const [mouseCoords, setMouseCoords] = useState({ x: null, y: null });
	const [tooltipData, _setTooltipData] = useState<FixableAny>(null);
	const [positions, setPositions] = useState<eventPosition>({
		left: 0,
		top: 0,
		visibility: 'hidden'
	});

	const tooltipDataRef = React.useRef<ExpectedAny>(tooltipData);

	const setTooltipData = (data: FixableAny) => {
		_setTooltipData(data);
		tooltipDataRef.current = data;
	};

	const hideTooltip = () => {
		setTooltipData(null);
		setPositions({ left: 0, top: 0, visibility: 'hidden' });
		setMouseCoords({ x: null, y: null });
	};

	useEffect(() => {
		// The user starts dragging an item
		if (tooltipData !== null && activeDragId !== null) {
			hideTooltip();
		}
		// eslint-disable-next-line
	}, [activeDragId]);

	useEffect(() => {
		// Somehow the item is no longer in this user's inventory.
		if (tooltipData !== null) {
			hideTooltip(); // refreshing the ui for a sec
		}
		// eslint-disable-next-line
	}, [data]);

	const contextMenuOpened = document.getElementsByClassName('item-context-menu')[0] ? true : false;

	const updatePositionCoords = async () => {
		const { x, y }: ExpectedAny = mouseCoords;
		const tooltipElement = document.getElementsByClassName('item-tooltip')[0];
		const inventory = document.getElementsByClassName('system-contents')[0];
		const slot: UndefinedAny = document.elementFromPoint(x, y);

		if (!tooltipElement) return false;
		const tooltipRect = tooltipElement.getBoundingClientRect();
		const invRect = inventory.getBoundingClientRect();
		const slotRect = slot.getBoundingClientRect();

		let accurateTop = 0;
		const accurateLeft = x - 130;

		const heightTooltip = tooltipRect.height;
		if (y + heightTooltip + 50 > invRect.bottom) {
			accurateTop = slotRect.top - heightTooltip - 5;
		} else {
			accurateTop = y + 50;
		}

		if (accurateLeft > 0 && accurateTop > 0) {
			setPositions({
				left: accurateLeft,
				top: accurateTop,
				visibility: 'unset'
			});
		}
	};

	useEffect(() => {
		if (tooltipData !== null) {
			updatePositionCoords();
		}
		// eslint-disable-next-line
	}, [mouseCoords]);

	const getItemSourceData = (type: string, id: string) => {
		let entity = null;
		const data = refs.current.data;

		if (type === 'item') {
			entity = data.remoteInfo.inventory.find((i: InventoryItem) => i.id === id);
		}

		if (type === 'weapon') {
			entity = data.remoteInfo.weapons.find((i: PlayerWeapon) => `${i.slot}` === `${id}`);
		}

		if (type === 'dropped-item') {
			entity = data.nearbyPickups.find((i: DroppedItem) => i.id === id);
		}

		if (type === 'separated-item') {
			entity = data.remoteSeparateInventory.items.find((i: SeparatedItem) => i.id === id);
		}

		return entity;
	};

	const getTooltipData = (type: FixableAny, id: string) => {
		if (type === 'item' || type === 'dropped-item' || type === 'separated-item') {
			// Get the data about this inventory item.
			const entity = getItemSourceData(type, id);
			if (!entity) return undefined;

			// Get meta about this item.
			const item = getItemMeta(entity.itemId);
			if (!item) return undefined;

			// Get item properties from meta.
			const itemProperties = getItemProperties(entity.id, type);

			// Creating the tooltip data..
			const tooltipData: ExpectedAny = {
				name: item.name || 'Nameless',
				description: item.description,
				properties: [],
				tradable: item.tradable
			};

			// If this is a dropped item we need this.
			if (type === 'dropped-item') {
				tooltipData.properties.push({
					label: lang.get('TooltipDroppedBy'),
					value: entity.droppedBy
				});
			}

			// If the item will expire at some point.
			if (entity.expiresAt) {
				tooltipData.properties.push({
					label: lang.get('TooltipExpiryDate'),
					value: moment(new Date(entity.expiresAt)).format('DD MMM yyyy, HH:mm:ss')
				});
			}

			// If the back-end generated properties for this item.
			if (itemProperties) {
				tooltipData.properties = [...tooltipData.properties, ...itemProperties];
			}

			// We need to replace the clothes name.
			if (entity.itemId === 3) {
				const data = getMeta(`clothes:${entity.meta.clothingId}`);

				if (data) {
					// Adding tooltip data
					tooltipData.name = data.name || 'Nameless';
				}
			}

			// We need to replace the weapons and description name.
			if (entity.itemId === 25) {
				const data = getMeta(`weapons:${entity.meta.weaponId}`);

				if (data) {
					// Adding tooltip data
					tooltipData.name = data.displayName || 'Nameless';
				}
			}

			return tooltipData;
		} else if (type === 'clothing') {
			// Variables
			const key = id;
			const clothing = refs.current.data.remoteClothes[key];

			// Not wearing anything in this slot.
			if (!clothing) return null;

			// Getting clothes meta (clothing name)
			const meta = getClothingMeta(clothing);
			if (!meta) return undefined;

			// Preparing the properties
			const properties = [
				{
					label: 'ID',
					value: clothing
				},
				{
					label: lang.get('Gender'),
					value: lang.get(`GenderValue`, { value: meta.gender })
				}
			];

			if (meta.type === 'tops') {
				properties.push({
					label: lang.get('UndershirtCompatible'),
					value: lang.get(meta.meta.undershirtCompatible ? `Yes` : `No`)
				});
			}

			return {
				name: lang.get(`Clothes:${key}`),
				description: meta.name || 'Nameless',
				properties: properties
			};
		} else if (type === 'weapon::equipped-slot') {
			// Get the weapon data. (id = actual slot number)
			const weaponSlot = getWeaponFromSlot(parseInt(id), true);
			if (!weaponSlot) return false;

			// Get the weapon meta
			const weaponMeta = getMeta(`weapons:${weaponSlot.weaponId}`);
			if (!weaponMeta) return undefined;

			// Formatting the properties
			let properties = [];

			// Check if we have bullets
			const hasBullets = ['melee', 'thrown'].includes(weaponMeta.group) ? false : true;

			// Get languages for ammo types
			const tooltipLang = getLanguagePack(`inventory@weapon.tooltip`);
			const ammoLang = getLanguagePack(`inventory@weapon.ammoTypes`);
			const groupsLang = getLanguagePack(`inventory@weapon.groups`);

			// If this weapon has bullets
			if (hasBullets) {
				properties.push({
					label: tooltipLang.get('Ammunition'),
					value: `${weaponSlot.ammo} ${tooltipLang.get('Bullets')}`
				});

				properties.push({
					label: tooltipLang.get('AmmoType'),
					value: ammoLang.get(`${weaponMeta.ammoType}`)
				});
			}

			// This weapon doesn't have bullets but has quantity. (Ex: grenade!)
			if (!hasBullets && weaponMeta.group !== 'melee') {
				properties.push({
					label: tooltipLang.get('Quantity'), // RO: Cantitate
					value: `${weaponSlot.ammo} ${tooltipLang.get('Units')}` // RO: Bucati
				});
			}

			// Add weapon class too.
			properties.push({
				label: tooltipLang.get('Class'),
				value: groupsLang.get(`${weaponMeta.group}`)
			});

			return {
				name: weaponMeta.displayName || 'Nameless',
				description: weaponMeta.description || '',
				properties
			};
		} else if (type === 'weapon::empty-slot') {
			return {
				name: lang.get(`WeaponSlot`),
				description: lang.get(`DontHaveWeapon`, { type })
			};
		}

		return undefined;
	};

	const onMouseMove = (event: ExpectedAny) => {
		const { clientX, clientY } = event;
		const element: UndefinedAny = document.elementFromPoint(clientX, clientY);
		if (!element) return false;

		const type = element.getAttribute('data-type');

		if (tooltipDataRef.current !== null) {
			setMouseCoords({ x: clientX, y: clientY });
		}

		// Don't start the tooltip if context is opened
		if (contextMenuOpened) {
			if (tooltipDataRef.current !== null) {
				hideTooltip();
			}
			return false;
		}

		const allowedTypes = [
			'item',
			'dropped-item',
			'clothing',
			'weapon::equipped-slot',
			'weapon::empty-slot',
			'separated-item'
		];

		if (allowedTypes.includes(type)) {
			const id = element.getAttribute('data-id');
			if (tooltipDataRef.current !== null && tooltipDataRef.current.id === id) return false;
			const fetchData: FixableAny = getTooltipData(type, id);
			if (fetchData === undefined) return false;
			setTooltipData({ ...fetchData });

			updatePositionCoords();
			return false;
		}

		if (!allowedTypes.includes(type) && tooltipDataRef.current !== null) {
			hideTooltip();
		}
	};

	useEffect(() => {
		document.addEventListener('mousemove', onMouseMove);
		document.addEventListener(`hideTooltip`, hideTooltip);
		return () => {
			document.removeEventListener('mousemove', onMouseMove);
			document.removeEventListener(`hideTooltip`, hideTooltip);
		};
		// eslint-disable-next-line
	}, []);

	// Fixing a typescript error.
	const style: ExpectedAny = { ...positions };

	if (tooltipData === null || activeDragId !== null || contextMenuOpened) return null;

	return (
		<React.Fragment>
			<div className="item-tooltip" style={style}>
				<div className="title">{tooltipData.name}</div>
				{tooltipData.tradable === false && <div className="not-tradable">{lang.get('NonTradable')}</div>}
				<div className="description">{tooltipData.description || `No description. Lazy Developer?`}</div>
				{tooltipData.properties && tooltipData.properties.length > 0 && (
					<React.Fragment>
						<div className="divider" />
						<div className="specifications">
							{tooltipData.properties.map((specification: FixableAny, index: number) => (
								<div key={index} className="entry">
									<div className="label">{specification.label}</div>
									<div className="value">{specification.value}</div>
								</div>
							))}
						</div>
					</React.Fragment>
				)}
			</div>
		</React.Fragment>
	);
};

export default Tooltip;
