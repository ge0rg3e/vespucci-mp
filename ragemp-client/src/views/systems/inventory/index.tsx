import React, { createContext, useContext, useEffect, useState } from 'react';

// Context
const Context = createContext({});
export const ComponentState: ExpectedAny = () => useContext(Context);

// Dependencies
import { AppContext } from '@/utils/context';
import { InventoryItem } from './sections/items/components/types';

// Language
import * as i18n from '@vmp/i18n';
import Language from './index.language';
const languagePackId = `SYSTEM_INVENTORY`;
i18n.createLanguagePack(languagePackId, Language);

// Sections
import Items from './sections/items';
import Clothes from './sections/clothes';
import Pickup from './sections/pickup';
import SeparateInventory from './sections/externalStorage';
import Tabs from './sections/tabs';
import Weapons from './sections/weapons';

// Events
import Tooltip from './events/tooltip';
import ContextMenu from './events/contextMenu';
import Drag, { cleanDraggingElement } from './events/drag';

// Definitions
export const MAX_INVENTORY_SLOTS_PER_PAGE = 36;

// Demo data
import SimulatedResponse from './response';

const Component = () => {
	const [data, _setData] = useState<ExpectedAny>(null);
	const [page, setPage] = useState(0);
	const [activeDragId, setActiveDragId] = useState(null);
	const [activeDragType, setActiveDragType] = useState(null);
	const [useSeparateInventory, setUseSeparateInventory] = useState<boolean | null>(null);
	const [announced, setAnnounced] = useState(false);
	const { isDarkEnvironment } = AppContext();
	const [equipmentTab, setEquipmentTab] = useState('clothes');

	const refs = React.useRef<ExpectedAny>({
		data: null,
		activeDragId: null,
		activeDragType: null,
		page: 0,
		useSeparateInventory: null
	});

	const setData = (value: ExpectedAny) => {
		refs.current.data = value;
		_setData(value);
	};

	useEffect(() => {
		refs.current = {
			activeDragType,
			activeDragId,
			page,
			data,
			announced,
			useSeparateInventory
		};
	}, [activeDragType, activeDragType, page, data, useSeparateInventory, announced]);

	const updateInventoryInterfaceData = (data: ExpectedAny) => {
		const newObject = { ...refs.current.data, ...data };
		// console.log('newInventory', newObject);
		setData(newObject);

		if (refs.current.useSeparateInventory === null && data.remoteSeparateInventory) {
			setUseSeparateInventory(true);
		}

		if (refs.current.data !== null && refs.current.activeDragId === null) {
			// Once the items refreshed we must fix any glitches
			cleanDraggingElement();
		}

		if (refs.current.announced === false) {
			window.rpc.triggerClient('announceInventoryOpened');
			setAnnounced(true);
		}
	};

	useEffect(() => {
		window.socket.on('inventory:receivedData', updateInventoryInterfaceData);

		// Faking a response so we can see the inventory in the browser when simulating.
		if (window.mp.fake) {
			window.socket.simulateOn('inventory:receivedData', SimulatedResponse);
		}

		return () => {
			window.socket.off('inventory:receivedData');
		};
	}, []);

	const getItemFromSlot = (page: number, slot: number) =>
		refs.current.data.remoteInfo.inventory.find((i: InventoryItem) => i.pageId === page && i.slotId === slot);

	const getItemMeta = (itemId: string) => {
		if (refs.current.data === null) return undefined; // Fixes a bug
		return refs.current.data.meta[`item:${itemId}`];
	};

	const getItemProperties = (id: string, type: string) => {
		if (refs.current.data === null) return undefined; // Fixes a bug

		// The property is gonna be used later
		let propertyType = null;

		// Get the right property value..
		switch (type) {
			case 'separated-item':
				propertyType = 'remoteInventory';
				break;
			case 'dropped-item':
				propertyType = 'pickup';
				break;

			default:
				propertyType = 'inventory';
				break;
		}

		return refs.current.data.meta[`properties:${propertyType}:${id}`];
	};

	const getClothingMeta = (clothingId: string) => {
		if (refs.current.data === null) return undefined; // Fixes a bug
		return refs.current.data.meta[`clothes:${clothingId}`];
	};

	const getMeta = (path: string) => {
		if (refs.current.data === null) return undefined; // Fixes a bug
		return refs.current.data.meta[`${path}`];
	};

	/**
	 * Get data about the player's weapon.
	 * @param slot The slot number
	 * @returns The weapon equipped by the player or null.
	 */

	const getWeaponFromSlot = (slot: number) => {
		const match = refs.current.data.remoteInfo.weapons.find((c: PlayerWeapon) => c.slot === slot);
		return match || null;
	};

	/**
	 * Removes an equipped weapon from slot.
	 * @param slot
	 */

	const removeWeaponFromSlot = (slot: number) => {
		window.rpc.triggerServer(
			`playerWeapons.inventory@removeEquippedWeapon`,
			JSON.stringify({ slot, remoteId: refs.current.data.remoteId })
		);
	};

	const isMainFunctionality = data && data.remoteSeparateInventory === null ? true : false;

	const passedVariables = {
		refs,
		data,
		setData,
		lang: i18n.getLanguagePack(languagePackId, window.language),
		getItemFromSlot,
		getItemMeta,
		getClothingMeta,
		getMeta,
		page,
		setPage,
		activeDragId,
		setActiveDragId,
		activeDragType,
		setActiveDragType,
		isDarkEnvironment,
		useSeparateInventory,
		setUseSeparateInventory,
		isMainFunctionality,
		getItemProperties,
		// Equipment
		equipmentTab,
		setEquipmentTab,
		// Weapons
		getWeaponFromSlot,
		removeWeaponFromSlot
	};

	if (data == null) return null;

	return (
		<Context.Provider value={passedVariables}>
			<div className={`system-inventory ${isDarkEnvironment && 'night'}`}>
				<div className="system-contents">
					{isMainFunctionality && <Clothes />}

					<div className="action-area">
						<div className="left-side">
							<Tabs />
						</div>
						<div className={`middle-side ${!isMainFunctionality ? 'two-inventories' : 'single-inventory'}`}>
							<Items />
							<Pickup />
						</div>
						{!isMainFunctionality && <SeparateInventory />}
						{isMainFunctionality && (
							<div className="right-side">
								<Weapons />
							</div>
						)}
					</div>
				</div>
				<BackgroundImage />
				<Tooltip />
				<ContextMenu />
				<Drag />
			</div>
		</Context.Provider>
	);
};

const BackgroundImage = () => (
	<img
		src={`/assets/images/systems/inventory/background.png`}
		onLoad={(ev: UndefinedAny) => (ev.target.className += ` loaded`)}
		onContextMenu={(e) => e.preventDefault()}
		onDragStart={(e) => e.preventDefault()}
		className={`background`}
	/>
);

export default Component;
